import React from 'react';
import { format } from 'timeago.js';
const ChatCard = ({ message, owner }) => {
  const leftChat = ' md:mr-[50%] px-1 py-1 rounded-xl text-gray-700',
    rightChat = ' md:ml-[50%] px-1 py-1 rounded-xl text-gray-700 ';

  return (
    <div className={owner ? leftChat : rightChat}>
      <p
        className={` ${
          owner ? 'bg-blue-100' : 'bg-slate-100'
        } rounded-xl px-3 py-1`}
      >
        {message.message}
      </p>
      <p className="font-light text-base text-gray-600 ml-4">
        {message.senderId}
        <span className="text-sm text-gray-500 font-light pl-2">
          {format(message.createdAt)}
        </span>
      </p>
    </div>
  );
};

export default ChatCard;
