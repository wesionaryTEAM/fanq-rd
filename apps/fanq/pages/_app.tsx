import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';
import createApolloClient from '../lib/apolloClient';
import { ApolloProvider } from '@apollo/client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import PrivateRoute from '../utils/privateRoute';

const apolloClient = createApolloClient(
  {},
  {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HUSRA_ADMIN_SECRET,
    'Content-Type': 'application/json',
  }
);

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme} resetCSS={true}>
        <AuthProvider supabase={supabase}>
          <PrivateRoute>
            <Component {...pageProps} />
          </PrivateRoute>
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
