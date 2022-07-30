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
    if (window.closed) {
      router.push('/api/auth/logout');
    }
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
  }, []);

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
    </div>
  );
};

export default Navbar;
