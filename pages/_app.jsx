// pages/_app.js
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import 'tailwindcss/tailwind.css';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
