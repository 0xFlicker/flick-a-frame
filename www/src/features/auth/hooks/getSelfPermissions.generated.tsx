import type * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSelfPermissionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetSelfPermissionsQuery = { __typename?: 'Query', self?: { __typename?: 'Web3User', allowedActions: Array<{ __typename?: 'Permission', action: Types.PermissionAction, resource: Types.PermissionResource }> } | null };


export const GetSelfPermissionsDocument = gql`
    query getSelfPermissions {
  self {
    allowedActions {
      action
      resource
    }
  }
}
    `;

/**
 * __useGetSelfPermissionsQuery__
 *
 * To run a query within a React component, call `useGetSelfPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelfPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelfPermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSelfPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<GetSelfPermissionsQuery, GetSelfPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSelfPermissionsQuery, GetSelfPermissionsQueryVariables>(GetSelfPermissionsDocument, options);
      }
export function useGetSelfPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSelfPermissionsQuery, GetSelfPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSelfPermissionsQuery, GetSelfPermissionsQueryVariables>(GetSelfPermissionsDocument, options);
        }
export type GetSelfPermissionsQueryHookResult = ReturnType<typeof useGetSelfPermissionsQuery>;
export type GetSelfPermissionsLazyQueryHookResult = ReturnType<typeof useGetSelfPermissionsLazyQuery>;
export type GetSelfPermissionsQueryResult = Apollo.QueryResult<GetSelfPermissionsQuery, GetSelfPermissionsQueryVariables>;