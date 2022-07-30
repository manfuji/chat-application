import Head from 'next/head';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const { user, loading, error } = useUser();
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  useEffect(() => {
    if (user) {
      const body = { email: user.email };
      axios
        .post('/api/user', body)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      router.push('/chatPage');
    }
  }, [user]);
  console.log(user);
  return (
    <div className="flex min-h-screen bg-gray-200 flex-col items-center justify-center py-2">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-3xl font-bold text-gray-500 uppercase animate-bounce">
          Login and Start Chatting
        </h1>

        {!user && (
          <Link href="/api/auth/login" className="">
            <a className="text-2xl font-bold tracking-widest pt-1 pb-2 uppercase text-blue-700 shadow-lg shadow-gray-400 w-64 bg-slate-20  mt-5 ring-1 rounded-xl px-4 ring-gray-200 text-center justify-center items-center">
              login
            </a>
          </Link>
        )}
      </main>
    </div>
  );
};

export default Home;
