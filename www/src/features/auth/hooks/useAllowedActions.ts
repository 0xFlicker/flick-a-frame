import { useMemo } from "react";
import { graphQlAllowedActionToPermission } from "../transforms/allowedActions";
import { useGetSelfPermissionsQuery } from "./getSelfPermissions.generated";

export const useAllowedActions = ({ skip }: { skip?: boolean }) => {
  const response = useGetSelfPermissionsQuery({
    skip,
    // fetchPolicy: "no-cache",
  });

  const allowedActions = useMemo(
    () =>
      response?.data?.self?.allowedActions.map(
        graphQlAllowedActionToPermission
      ),
    [response]
  );

  return {
    ...response,
    allowedActions,
  };
};
