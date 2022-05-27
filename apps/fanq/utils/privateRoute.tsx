import { jsx } from '@emotion/react';
import { User, Session } from '@supabase/supabase-js';
import { NextComponentType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface IPrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const publicRoutes = ['/login', '/'];
    try {
      setIsLoading(true);
      const session = supabase.auth.session();
      const user = supabase.auth.user();
      if ((!user || !session) && !publicRoutes.includes(router.pathname)) {
        router.replace('/login');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return isLoading ? <div>Loading...</div> : children;
};

export default PrivateRoute;
