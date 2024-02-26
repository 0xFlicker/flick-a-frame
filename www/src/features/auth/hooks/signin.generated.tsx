import type * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Web3SignInMutationVariables = Types.Exact<{
  address: Types.Scalars['ID']['input'];
  jwe: Types.Scalars['String']['input'];
}>;


export type Web3SignInMutation = { __typename?: 'Mutation', siwe: { __typename?: 'Web3LoginUser', token: string } };


export const Web3SignInDocument = gql`
    mutation web3SignIn($address: ID!, $jwe: String!) {
  siwe(address: $address, jwe: $jwe) {
    token
  }
}
    `;
export type Web3SignInMutationFn = Apollo.MutationFunction<Web3SignInMutation, Web3SignInMutationVariables>;

/**
 * __useWeb3SignInMutation__
 *
 * To run a mutation, you first call `useWeb3SignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWeb3SignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [web3SignInMutation, { data, loading, error }] = useWeb3SignInMutation({
 *   variables: {
 *      address: // value for 'address'
 *      jwe: // value for 'jwe'
 *   },
 * });
 */
export function useWeb3SignInMutation(baseOptions?: Apollo.MutationHookOptions<Web3SignInMutation, Web3SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Web3SignInMutation, Web3SignInMutationVariables>(Web3SignInDocument, options);
      }
export type Web3SignInMutationHookResult = ReturnType<typeof useWeb3SignInMutation>;
export type Web3SignInMutationResult = Apollo.MutationResult<Web3SignInMutation>;
export type Web3SignInMutationOptions = Apollo.BaseMutationOptions<Web3SignInMutation, Web3SignInMutationVariables>;