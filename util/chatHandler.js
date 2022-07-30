import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

const chatHandler = () => {
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
      const res = await axios.get('/api/chat/conversation/?id=' + user?.email);
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
        const res = await axios.get('/api/chat/message/?id=' + currentChat._id);
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
      const res = await axios.post('/api/chat/message', body);
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
      const res = await axios.post('/api/chat/conversation', body);
      // setConversation([...conversation, res.data]);
      setCurrentChat(res.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
};

export default chatHandler;
