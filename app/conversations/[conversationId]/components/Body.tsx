"use client"

import userConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox'
import axios from 'axios'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'

interface BodyProps{
  initialMessages:FullMessageType[]
};

const Body:React.FC<BodyProps> = ({
  initialMessages
}) => {
  const [messages,setMessages]=useState(initialMessages)
  const bottomRef= useRef<HTMLDivElement>(null)
  const { converationId}=userConversation();

  useEffect(()=>{
    axios.post(`/api/conversations/${converationId}/seen`)
  },[converationId])

  useEffect(()=>{
    pusherClient.subscribe(converationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler=(message:FullMessageType)=>{
      axios.post(`/api/conversations/${converationId}/seen`)
      setMessages((current)=>{
        if(find(current,{id:message.id})){
          return current;
        }
        return [...current,message]
      });
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler=(newmessage:FullMessageType)=>{
      setMessages((current)=>current.map((currentMessage)=>{
        if(currentMessage.id==newmessage.id){
          return newmessage;
        }
        return currentMessage;
      }))
    };

    pusherClient.bind('messages:new',messageHandler);
    return ()=>{
      pusherClient.unsubscribe(converationId);
      pusherClient.unbind('messages:new',messageHandler);

      pusherClient.bind('message:update',updateMessageHandler);
      pusherClient.unbind('message:update',updateMessageHandler);
    }
  },[converationId])
  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message,i)=>(
        <MessageBox
        isLast={i==messages.length-1}
        key={message.id}
        data={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24'/>
    </div>
  )
}

export default Body