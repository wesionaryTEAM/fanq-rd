// import fetch from 'isomorphic-unfetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

let accessToken = null;

// remove cached token on 401 from the server
const resetTokenLink = onError(({ networkError }) => {
  if (
    networkError &&
    networkError.name === 'ServerError' &&
    networkError.statusCode === 401
  ) {
    accessToken = null;
  }
});

const createHttpLink = (headers) => {
  const httpLink = new HttpLink({
    uri: process.env.APP_HOST,
    credentials: 'include',
    headers, // auth token is fetched on the server side
    fetch,
  });
  return httpLink;
};

export default function createApolloClient(initialState, headers) {
  const ssrMode = typeof window === 'undefined';
  let link;
  link = createHttpLink(headers);
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
