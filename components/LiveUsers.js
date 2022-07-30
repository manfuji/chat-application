// import React, { useEffect, useState } from 'react';

const LiveUsers = ({ email }) => {
  //   const [otherUser, setOtherUser] = useState('');
  //   useEffect(() => {
  //     setOtherUser(conversation?.members.find((conv) => conv !== email));

  //     console.log('convo', otherUser);
  //   }, [conversation, email]);
  return (
    <div className="bg-gray-100 w-52 h-12 ring-1 ring-green-600 animate-pulse shadow-md rounded-lg flex flex-row justify-between px-2 items-center">
      <img src="/profile.png" alt="image" className="w-8 h-8 rounded-full" />
      <p className="text-gray-600 tracking-widest  text-sm ml-1">{email}</p>
    </div>
  );
};

export default LiveUsers;
