import { useWeb3SignInMutation } from "./signin.generated";

export const useSignIn = () => {
  const response = useWeb3SignInMutation();

  return response;
};
