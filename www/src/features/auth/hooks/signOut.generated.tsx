import type * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignOutEthereumMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type SignOutEthereumMutation = { __typename?: 'Mutation', signOutEthereum: boolean };


export const SignOutEthereumDocument = gql`
    mutation SignOutEthereum {
  signOutEthereum
}
    `;
export type SignOutEthereumMutationFn = Apollo.MutationFunction<SignOutEthereumMutation, SignOutEthereumMutationVariables>;

/**
 * __useSignOutEthereumMutation__
 *
 * To run a mutation, you first call `useSignOutEthereumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutEthereumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutEthereumMutation, { data, loading, error }] = useSignOutEthereumMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutEthereumMutation(baseOptions?: Apollo.MutationHookOptions<SignOutEthereumMutation, SignOutEthereumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutEthereumMutation, SignOutEthereumMutationVariables>(SignOutEthereumDocument, options);
      }
export type SignOutEthereumMutationHookResult = ReturnType<typeof useSignOutEthereumMutation>;
export type SignOutEthereumMutationResult = Apollo.MutationResult<SignOutEthereumMutation>;
export type SignOutEthereumMutationOptions = Apollo.BaseMutationOptions<SignOutEthereumMutation, SignOutEthereumMutationVariables>;