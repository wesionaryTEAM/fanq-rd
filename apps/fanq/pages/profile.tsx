import { useRouter } from 'next/router';
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile({ session }: any) {
  const router = useRouter();

  const handleSignOut = () => {
    supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session?.user?.email} disabled />
      </div>

      <div>
        <button className="button block" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
