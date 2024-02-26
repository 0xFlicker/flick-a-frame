import {
  FC,
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWeb3 } from "@/features/web3";
import { useNonce } from "./useNonce";
import {
  createJweRequest,
  decodeJwtToken,
  TAllowedAction,
  Matcher,
} from "@0xflick/ordinals-rbac-models";
import { useSignIn } from "./useSignIn";
import { useSignOut } from "./useSignOut";
import { useEnsAvatar, useEnsName, useSignMessage } from "wagmi";
import { useSelf } from "./useSelf";
import { graphQlAllowedActionToPermission } from "../transforms/allowedActions";
import { useGetAppInfoQuery } from "./app.generated";

function useAuthContext({ autoLogin = false }: { autoLogin?: boolean }) {
  const [stateToken, setStateToken] = useState<string | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [state, setState] = useState<
    | "ANONYMOUS"
    | "REQUEST_SIGN_IN"
    | "SIGNING_MESSAGE"
    | "USER_MESSAGE_SIGNED"
    | "AUTHENTICATED"
    | "REQUEST_SIGN_OUT"
  >("ANONYMOUS");
  const isAnonymous = state === "ANONYMOUS";
  const isAuthenticated = state === "AUTHENTICATED";
  const {
    currentChain,
    activeConnector,
    selectedAddress: address,
    isConnected: isWeb3Connected,
  } = useWeb3();
  const { data: appInfoData } = useGetAppInfoQuery();
  const pubKey = appInfoData?.appInfo?.pubKey;
  const issuer = appInfoData?.appInfo?.name;

  useEffect(() => {
    if (autoLogin && isWeb3Connected && state === "ANONYMOUS") {
      setState("REQUEST_SIGN_IN");
    }
  }, [autoLogin, isWeb3Connected, state]);

  const { data: ensName, isLoading: ensNameIsLoading } = useEnsName({
    address,
    enabled: !!address,
  });
  const { data: ensAvatar, isLoading: ensAvatarIsLoading } = useEnsAvatar({
    name: ensName,
    enabled: !!address,
  });

  const isUserSigningMessage = state === "SIGNING_MESSAGE";
  const isUserRequestingSignIn = state === "REQUEST_SIGN_IN";
  const isUserSigningOut = state === "REQUEST_SIGN_OUT";

  // const { data: signer } = useSigner({});
  const [requestSignOut] = useSignOut();

  const chainId = currentChain?.id;
  const [
    fetchNonce,
    { data: nonceData, loading: nonceIsLoading, reset: nonceReset },
  ] = useNonce();
  const nonceIsSuccess = !!nonceData;
  const messageToSign = nonceData?.nonceEthereum?.messageToSign;
  const nonce = nonceData?.nonceEthereum?.nonce;

  const [
    fetchToken,
    {
      data: tokenData,
      error: tokenError,
      loading: tokenIsLoading,
      reset: tokenReset,
    },
  ] = useSignIn();
  const tokenIsSuccess = !!tokenData;
  const tokenIsError = !!tokenError;
  const {
    data: user,
    isLoggedIn: userIsLoggedInToGraphql,
    error: selfError,
    refetch: refetchSelf,
  } = useSelf({});
  useEffect(() => {
    if (userIsLoggedInToGraphql && user?.token) {
      setState("AUTHENTICATED");
      setRoleIds(user.roleIds);
      setStateToken(user.token);
      refetchSelf();
    } else if (selfError) {
      setState("ANONYMOUS");
      setRoleIds([]);
      setStateToken(null);
    }
  }, [user, userIsLoggedInToGraphql, selfError, refetchSelf]);
  const signIn = useCallback(() => {
    setState("REQUEST_SIGN_IN");
  }, []);

  const signOut = useCallback(() => {
    tokenReset();
    nonceReset();
    requestSignOut();
    setState("ANONYMOUS");
    setRoleIds([]);
    setStateToken(null);
  }, [tokenReset, nonceReset, requestSignOut]);

  useEffect(() => {
    if (isWeb3Connected && user && user.address !== address) {
      console.log("User is authenticated, but address has changed");
      signOut();
    }
  }, [user, address, signOut, isWeb3Connected]);

  useEffect(() => {
    if (address && isUserRequestingSignIn && chainId) {
      fetchNonce({ variables: { address, chainId } })
        .then(() => {
          setState("SIGNING_MESSAGE");
        })
        // TODO: toast
        .catch((err) => {
          console.error(err);
          setState("ANONYMOUS");
        });
    }
  }, [address, chainId, fetchNonce, isUserRequestingSignIn]);
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (tokenIsError) {
      setState("ANONYMOUS");
      setRoleIds([]);
      setStateToken(null);
    }
  }, [tokenIsError]);
  useEffect(() => {
    if (
      isUserSigningMessage &&
      nonceIsSuccess &&
      nonce &&
      activeConnector &&
      address &&
      chainId &&
      pubKey &&
      messageToSign
    ) {
      signMessageAsync({
        message: messageToSign,
      }).then(
        (signature: string) => {
          setState("USER_MESSAGE_SIGNED");
          createJweRequest({
            signature,
            nonce,
            pubKeyStr: pubKey,
          })
            .then((jwe) => {
              return fetchToken({
                variables: {
                  address,
                  jwe,
                },
              });
            })
            .catch((err) => {
              // TODO: toast
              console.error(err);
              setState("ANONYMOUS");
              setRoleIds([]);
              setStateToken(null);
            });
        },
        (err: Error) => {
          console.error(err);
          // FIXME: figure out rejection vs error vs wallet type
          //TODO: toast;
        }
      );
    }
  }, [
    nonceData,
    nonceIsSuccess,
    activeConnector,
    address,
    fetchToken,
    chainId,
    messageToSign,
    signMessageAsync,
    isUserSigningMessage,
    nonce,
    pubKey,
  ]);

  useEffect(() => {
    if (
      nonceIsSuccess &&
      nonceData &&
      tokenIsSuccess &&
      tokenData &&
      address &&
      issuer
    ) {
      const token = tokenData.siwe?.token;
      if (!token) {
        // TODO: toast
        console.warn("No token returned from server");
        setState("ANONYMOUS");
        setRoleIds([]);
        setStateToken(null);
        return;
      }
      try {
        const authUser = decodeJwtToken(token, issuer);
        if (authUser && authUser.address === address) {
          console.log(
            "Found a token and the token addresses matches the user, signing in"
          );
          setRoleIds(authUser.roleIds);
          setStateToken(token);
          setState("AUTHENTICATED");
          refetchSelf();
        } else {
          console.warn(`Unable to parse token for ${address}`);
          // TODO: toast
          setState("ANONYMOUS");
          setRoleIds([]);
          setStateToken(null);
        }
      } catch (err) {
        console.error(err);
        // TODO: toast
        setState("ANONYMOUS");
        setRoleIds([]);
        setStateToken(null);
      }
    }
  }, [
    address,
    issuer,
    nonceData,
    nonceIsSuccess,
    tokenData,
    tokenIsSuccess,
    refetchSelf,
  ]);
  const setToken = useCallback(
    (token: string) => {
      // decode token
      if (!address || !issuer) {
        console.warn("Unable to set token, no address or issuer");
      }
      const authUser = decodeJwtToken(token, issuer!);
      if (authUser && authUser.address === address) {
        setRoleIds(authUser.roleIds);
        setStateToken(token);
        setState("AUTHENTICATED");
      } else {
        console.warn(`Unable to parse token for ${address}`);
        // TODO: toast
        setState("ANONYMOUS");
        setRoleIds([]);
        setStateToken(null);
      }
    },
    [address, issuer]
  );
  const result = {
    isAuthenticated,
    isAnonymous,
    isUserRequestingSignIn,
    isUserSigningMessage,
    isUserWaiting: nonceIsLoading || tokenIsLoading,
    isUserSigningOut,
    token: stateToken || tokenData?.siwe?.token || user?.token || undefined,
    user,
    roleIds,
    allowedActions:
      user?.allowedActions.map(graphQlAllowedActionToPermission) ?? [],
    signIn,
    signOut,
    ensName,
    ensNameIsLoading,
    ensAvatar,
    ensAvatarIsLoading,
    setToken,
  };
  return result;
}

type TContext = ReturnType<typeof useAuthContext>;
const AuthProvider = createContext<TContext | null>(null);

export const Provider: FC<
  PropsWithChildren<{
    autoLogin?: boolean;
  }>
> = ({ autoLogin, children }) => {
  const context = useAuthContext({
    autoLogin,
  });

  return (
    <AuthProvider.Provider value={context}>{children}</AuthProvider.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthProvider);
  if (ctx === null) {
    throw new Error("No context defined");
  }
  return ctx;
}

export function useHasAllowedAction(
  permissionMatcher: Matcher<TAllowedAction[]>
) {
  const { allowedActions } = useAuth();
  return useMemo(() => {
    if (allowedActions) {
      return permissionMatcher(allowedActions);
    }
    return false;
  }, [permissionMatcher, allowedActions]);
}
