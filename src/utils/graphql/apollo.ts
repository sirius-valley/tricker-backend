import { ApolloClient, from, HttpLink, InMemoryCache, type NormalizedCacheObject } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { InternalServerErrorException } from '@utils';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors !== undefined) {
    const errors = graphQLErrors.map(({ message, extensions, path }) => ({
      message,
      path: path?.map((path) => path).toString(),
      extensions: JSON.stringify(extensions),
    }));
    throw new InternalServerErrorException('GraphQL Error', errors);
  }
  if (networkError !== undefined) {
    throw new InternalServerErrorException(`GraphQL network error: ${networkError?.message}`);
  }
});

const createHttpLink = (apiKey: string): HttpLink => {
  return new HttpLink({
    uri: process.env.LINEAR_GRAPHQL_URL!,
    fetch,
    headers: {
      Authorization: apiKey,
    },
  });
};

export const createApolloClient = (apiKey: string): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink(apiKey);

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
    },
  });
};
