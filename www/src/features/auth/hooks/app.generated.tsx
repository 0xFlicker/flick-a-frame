import type * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAppInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAppInfoQuery = { __typename?: 'Query', appInfo: { __typename?: 'AppInfo', name: string, pubKey: string } };


export const GetAppInfoDocument = gql`
    query GetAppInfo {
  appInfo {
    name
    pubKey
  }
}
    `;

/**
 * __useGetAppInfoQuery__
 *
 * To run a query within a React component, call `useGetAppInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAppInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetAppInfoQuery, GetAppInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppInfoQuery, GetAppInfoQueryVariables>(GetAppInfoDocument, options);
      }
export function useGetAppInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppInfoQuery, GetAppInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppInfoQuery, GetAppInfoQueryVariables>(GetAppInfoDocument, options);
        }
export type GetAppInfoQueryHookResult = ReturnType<typeof useGetAppInfoQuery>;
export type GetAppInfoLazyQueryHookResult = ReturnType<typeof useGetAppInfoLazyQuery>;
export type GetAppInfoQueryResult = Apollo.QueryResult<GetAppInfoQuery, GetAppInfoQueryVariables>;