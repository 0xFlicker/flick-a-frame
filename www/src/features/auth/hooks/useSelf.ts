import { useMemo } from "react";
import { useGetSelfQuery } from "./getSelf.generated";

export const useSelf = ({ skip }: { skip?: boolean } = {}) => {
  const { data, ...rest } = useGetSelfQuery({
    skip,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const self = useMemo(
    () =>
      data && data.self
        ? {
            address: data.self.address,
            roleIds: data.self.roles?.map((role) => role.id) ?? [],
            allowedActions: data.self.allowedActions,
            token: data.self.token,
          }
        : undefined,
    [data]
  );

  const isLoggedIn = useMemo(() => !!self, [self]);

  return {
    data: self,
    isLoggedIn,
    ...rest,
  };
};
