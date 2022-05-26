import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';
import createApolloClient from '../lib/apolloClient';
import { ApolloProvider } from '@apollo/client';

const apolloClient = createApolloClient(
  {},
  {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HUSRA_ADMIN_SECRET,
    'Content-Type': 'application/json',
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider supabase={supabase}>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
