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
  useEffect(() => {
    const session = supabase.auth.session();
    const user = supabase.auth.user();

    if (!user || !session) {
      router.replace('/login');
    }
  }, [router]);

  return children;
};

export default PrivateRoute;
