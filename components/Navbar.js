import Image from 'next/image';
import Link from 'next/link';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import OnlineUser from './OnlineUser';
import { useRouter } from 'next/router';
import axios from 'axios';

const Navbar = () => {
  const [toggle, setToggle] = useState(false),
    [shadow, setShadow] = useState(false),
    // { user } = useUser();
    { user, loading, error } = useUser(),
    [conversation, setConversation] = useState([]),
    router = useRouter(),
    [currentChat, setCurrentChat] = useState({});

  useEffect(() => {
    // if (window.closed) {
    //   router.push('/api/auth/logout');
    // }
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
  }, []);

  const getConversation = async () => {
    try {
      const res = await axios.get('/api/conversation/?id=' + user?.email);
      setConversation(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversation();

    const timer = window.setInterval(() => {
      getConversation();
    }, 10000);
    return () => {
      // Return callback to run on unmount.
      window.clearInterval(timer);
    };
  }, [currentChat, user]);

  return (
    <div
      className={
        shadow
          ? 'fixed z-[100] h-20 w-full bg-white shadow-xl hidden md:inline-block'
          : 'fixed z-[100] h-20 w-full bg-white hidden md:inline-block'
      }
    >
      <div className="flex h-full w-full items-center justify-between px-6 2xl:p-16">
        <Image
          // layout="fill"
          src="/favicon.ico"
          alt=""
          height="50"
          width="125"
          objectFit="contain"
        />
        <div>
          {user && (
            <ul className=" hidden md:flex ">
              <Link href="/">
                <li className="ml-10 font-semibold tracking-wider cursor-pointer text-sm uppercase hover:border-b">
                  {user?.name}
                </li>
              </Link>
              <Link href="/api/auth/logout">
                <li className="ml-10 text-red-600 cursor-pointer text-sm uppercase hover:border-b">
                  Logout
                </li>
              </Link>
            </ul>
          )}
        </div>
        <div className=" cursor-pointer shadow-sm hover:bg-gray-200 md:hidden">
          <MenuIcon className="h-8 w-8" onClick={() => setToggle(!toggle)} />
        </div>
      </div>

      <div
        className={`${
          toggle
            ? ' fixed left-0 top-0 h-screen w-full bg-black/70 md:hidden'
            : ''
        }`}
      >
        <div
          className={`${
            toggle
              ? 'fixed left-0 top-0 h-screen w-[75%] justify-between bg-[#ecf0f3] p-10 transition-all duration-500 ease-in  sm:w-[65%] md:w-[45%]'
              : 'hidden transition-all duration-500 ease-in'
          }`}
        >
          <div className=" flex justify-between">
            <Image
              // layout="fill"
              src="/favicon.ico"
              alt=""
              height="30"
              width="100"
              objectFit="contain"
            />
            <div
              className="cursor-pointer rounded-full p-3 shadow-xl shadow-gray-400"
              onClick={() => setToggle(!toggle)}
            >
              <XIcon className="inline-flex h-8 w-8 " />
            </div>
          </div>
          <div className="my-4 border-b border-gray-300">
            <p className="w-[85%] md:w-[90%] text-gray-50">People Online</p>
          </div>
          <div className="flex flex-col py-5">
            <ul className=" flex flex-col items-center space-y-5 ">
              {conversation.map((convo) => (
                <div key={convo._id} className="cursor-pointer">
                  <OnlineUser conversation={convo} email={user?.email} />
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
