import { ApolloClient, HttpLink, InMemoryCache, type NormalizedCacheObject } from '@apollo/client/core';
export const createApolloClient = (apiKey: string): ApolloClient<NormalizedCacheObject> => {
  const httpLink = new HttpLink({
    uri: process.env.LINEAR_GRAPHQL_URL!,
    fetch,
    headers: {
      Authorization: apiKey,
    },
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
    },
  });
};
