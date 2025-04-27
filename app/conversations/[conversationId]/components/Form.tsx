"use client"
import React from 'react'
import userConversation from '@/app/hooks/useConversation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { HiPaperAirplane } from 'react-icons/hi2';
import {CldUploadButton} from "next-cloudinary"
const Form = () => {
    const {converationId}=userConversation();
    const{ register,handleSubmit,setValue,formState:{errors,}
} =useForm<FieldValues>({
        defaultValues:{
            message:''
        }
    })

    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
        setValue('message','',{shouldValidate:true});
        axios.post('/api/messages',{
            ...data,
            conversationId:converationId
        })
    }
    // const handleUpload=(result:any)=>{
    //     console.log("Received data:");
    //     axios.post('/api/messages',{
    //         image:result?.info?.secure_url,
    //         conversationId:converationId
            
    //     })
    // }
    const handleUpload = (result: any) => {
        console.log("Cloudinary upload result:", result);
      
        axios.post('/api/messages', {
          image: result?.info?.secure_url,
          conversationId: converationId,
        });
      };
  return (
    <div
    className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4
    w-full
    '
    >
    <CldUploadButton
    options={{maxFiles:1}}
    onSuccess={(result) => {
        // console.log("UPLOAD SUCCESS TRIGGERED");
        handleUpload(result);
      }}
    uploadPreset='chat-media'
     >
    <HiPhoto size={25} className='text-sky-500'/>
    </CldUploadButton>
    <form onSubmit={handleSubmit(onSubmit)}
    className='flex items-center gap-2  lg:gap-4 w-full'
    >
        <MessageInput id="message"
        register={register}
        errors={errors}
        required
        placeholder="Write a Message..."
        />
        <button type='submit'
        className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'
        >
            <HiPaperAirplane size={20} className='text-white'/>
        </button>
    </form>
    </div>
  )
}

export default Form