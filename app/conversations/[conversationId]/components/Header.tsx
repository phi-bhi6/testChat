"use client"

import Avatar from '@/app/components/Avatar';
import { Conversation, User } from '@/app/generated/prisma';
import useOtherUser from '@/app/hooks/useOtherUser';
import Link from 'next/link';
import React, { useMemo, useState } from 'react'
import { HiEllipsisHorizontal, HiMiniChevronLeft } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/app/components/AvatarGroup';

interface HeaderProps{
    conversation:Conversation &{
        users:User[]
    }
}
const Header:React.FC<HeaderProps> = ({
    conversation
}) => {
  const otherUser=useOtherUser(conversation);
  const [drawerOpen,setDrawerOpen]=useState(false);

  const statusText=useMemo(()=>{
    if(conversation.isGroup){return `${conversation.users.length} members`}

    return 'Active';
  },[conversation])
  return (
    <>
    <ProfileDrawer
    data={conversation}
    isOpen={drawerOpen}
    onClose={()=>setDrawerOpen(false)}
    />
      <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4
    lg:px-6 justify-between items-center shadow-sm
    '>
      <div className='flex  gap-3  items-center'>
        <Link
        className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'

        href="/conversations">
        <HiMiniChevronLeft size={30}/>  
        </Link>
        {conversation.isGroup?(
            <AvatarGroup users={conversation.users}/>
        ):(
        <Avatar user={otherUser}/>
      )}
        <div className='flex flex-col '>
          <div>
            {conversation.name||otherUser.name}
          </div>
        <div className='
        text-sm  font-light text-neutral-500
        '>
            {statusText}
        </div>
        </div>
      </div>
      <HiEllipsisHorizontal size={30} onClick={()=>setDrawerOpen(true)}
        className='text-sky-500 cursor-pointer hover:text-sky-600 transition'
        />
      </div>
    </>
  )
}

export default Header