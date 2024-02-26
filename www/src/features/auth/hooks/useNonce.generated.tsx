import type * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNonceMutationVariables = Types.Exact<{
  address: Types.Scalars['ID']['input'];
  chainId: Types.Scalars['Int']['input'];
}>;


export type GetNonceMutation = { __typename?: 'Mutation', nonceEthereum: { __typename?: 'Nonce', nonce: string, messageToSign: string, pubKey: string, issuedAt: string, expiration: string, uri: string } };


export const GetNonceDocument = gql`
    mutation GetNonce($address: ID!, $chainId: Int!) {
  nonceEthereum(address: $address, chainId: $chainId) {
    nonce
    messageToSign
    pubKey
    issuedAt
    expiration
    uri
  }
}
    `;
export type GetNonceMutationFn = Apollo.MutationFunction<GetNonceMutation, GetNonceMutationVariables>;

/**
 * __useGetNonceMutation__
 *
 * To run a mutation, you first call `useGetNonceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetNonceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getNonceMutation, { data, loading, error }] = useGetNonceMutation({
 *   variables: {
 *      address: // value for 'address'
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetNonceMutation(baseOptions?: Apollo.MutationHookOptions<GetNonceMutation, GetNonceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetNonceMutation, GetNonceMutationVariables>(GetNonceDocument, options);
      }
export type GetNonceMutationHookResult = ReturnType<typeof useGetNonceMutation>;
export type GetNonceMutationResult = Apollo.MutationResult<GetNonceMutation>;
export type GetNonceMutationOptions = Apollo.BaseMutationOptions<GetNonceMutation, GetNonceMutationVariables>;