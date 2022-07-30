import Head from 'next/head';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import OnlineUser from '../components/OnlineUser';
import ChatCard from '../components/ChatCard';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import LiveUsers from '../components/LiveUsers';
const ChatApp = () => {
  const router = useRouter();
  const { user, loading, error } = useUser(),
    [conversation, setConversation] = useState([]),
    [currentChat, setCurrentChat] = useState(null),
    [message, setMessage] = useState([]),
    [sendMessage, setSendMessage] = useState(''),
    [socketMessage, setSocketMessage] = useState(null),
    socket = useRef(),
    [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io('https://fujisocket.herokuapp.com');
    socket.current.on('getMessage', (data) => {
      setSocketMessage({
        senderId: data.senderId,
        message: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socketMessage &&
      currentChat &&
      currentChat?.members?.includes(socketMessage.senderId) &&
      setMessage((prev) => [...prev, socketMessage]);
  }, [socketMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user?.email);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
      // console.log(users);
    });
  }, [user]);

  console.log(onlineUsers);

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
  // getting all user chats

  console.log(currentChat);
  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get('/api/message/?id=' + currentChat._id);
        setMessage(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat?._id]);

  console.log(sendMessage);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      conversationId: currentChat._id,
      senderId: user?.email,
      message: sendMessage,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user.email
    );

    socket.current.emit('sendMessage', {
      senderId: user.email,
      receiverId,
      text: sendMessage,
    });

    try {
      const res = await axios.post('/api/message', body);
      setMessage([...message, res.data]);
      setSendMessage('');
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // defing scrolling into view
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  // removing current user from the online users
  const filteredOnlineUsers = onlineUsers.filter(
    (onlineUser) => onlineUser.userId !== user?.email
  );

  const handleNewConversation = async (userId) => {
    const body = {
      senderId: user.email,
      receiverId: userId,
    };
    try {
      const res = await axios.post('/api/conversation', body);
      // setConversation([...conversation, res.data]);
      setCurrentChat(res.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" min-h-screen w-full bg-gray-200">
      <Navbar />

      <div className="bg-gray-200 flex flex-col md:flex-row justify-between md:h-screen md:pt-24">
        {/* left side bar  */}
        <div className="md:w-[25%] w-full overflow-y-scroll px-3 scrollbar-hide sticky top-0 bg-gray-200 md:bg-transparent flex flex-col justify-md:evenly ">
          <div className="flex md:flex-col flex-row py-5 ">
            <div className="md:my-4 border-b border-gray-300">
              <p className="w-[85%] md:w-[90%] text-gray-700 mr-3 md:mr-0 text-center text-lg md:text-2xl font-bold tracking-widest">
                Chats
              </p>
            </div>
            <ul className=" flex md:flex-col flex-row overflow-x-scroll space-x-2 md:overflow-hidden items-center md:space-y-5 scrollbar-hide">
              {conversation.map((convo) => (
                <div
                  key={convo._id}
                  onClick={() => setCurrentChat(convo)}
                  className="cursor-pointer"
                >
                  <OnlineUser conversation={convo} email={user?.email} />
                </div>
              ))}
            </ul>
          </div>
          <div className="flex md:flex-col flex-row pb-3 ">
            <div className="md:my-4 border-b border-gray-300">
              <p className="w-full md:w-[90%] mr-3 md:mr-0 text-gray-700 text-center text-lg md:text-2xl font-bold tracking-widest">
                Online Users
              </p>
            </div>
            <ul className=" flex md:flex-col flex-row overflow-x-scroll space-x-2 md:overflow-hidden items-center md:space-y-5 scrollbar-hide ">
              {filteredOnlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.socketId}
                  onClick={() => handleNewConversation(onlineUser.userId)}
                  className="cursor-pointer"
                >
                  <LiveUsers email={onlineUser.userId} />

                  {/* <OnlineUser conversation={onlineUser} email={user?.email} /> */}
                </div>
              ))}
            </ul>
          </div>
          <div className="md:hidden mb-2">
            <Link href="/api/auth/logout">
              <li className="font-medium text-red-600 tracking-widest bg-white px-3 py-2 rounded-xl text-center cursor-pointer">
                Logout
              </li>
            </Link>
          </div>
        </div>
        {/* right bar  */}
        {currentChat ? (
          <div className="w-full md:w-[75%] flex flex-col justify-between h-[90%] px-4 ">
            <div className="w-full flex flex-col justify-between overflow-y-scroll scrollbar-hide h-full">
              <ul className="flex flex-row space-x-4 mb-2 ">
                <li className="font-medium text-red-600 tracking-widest bg-white px-3 py-2 rounded-xl text-center cursor-pointer">
                  Block
                </li>
              </ul>
              {message.map((mess) => (
                <div ref={scrollRef} key={mess.createdAt}>
                  <ChatCard
                    owner={mess.senderId === user.email}
                    message={mess}
                  />
                </div>
              ))}
            </div>
            <div className="max-w-7xl mx-auto flex-1 pb-4 pt-5  ">
              <form className="flex md:flex-row md:space-x-4 flex-col items-center space-y-4">
                <textarea
                  placeholder="Type message....."
                  cols={70}
                  rows={4}
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  className="w-full mx-auto px-2 py-3 outline-none rounded-lg text-gray-700"
                />
                <button
                  onClick={handleSubmit}
                  className="lg:text-base text-sm h-12 tracking-widest pb-2 uppercase text-blue-700 shadow-lg shadow-gray-400 w-64 bg-slate-20 bg-slate-100 pt-2.5 mt-5 ring-1 rounded-xl px-4 ring-gray-200 text-center justify-center items-center"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="font-bold max-w-4xl mx-auto min-h-screen text-lg md:text-3xl text-gray-400 mt-[20%] ">
            Please Start A conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
