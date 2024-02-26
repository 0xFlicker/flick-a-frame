import { useGetNonceMutation } from "./useNonce.generated";

export const useNonce = () => {
  return useGetNonceMutation();
};
