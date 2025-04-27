"use client"
import { User } from '@/app/generated/prisma';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../input/Input';
import Image from 'next/image';
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import Button from '../Button';
interface SettingsModalProps{
    isOpen?:boolean
    onClose:()=>void;
    currentuser:User
}
const SettingsModal:React.FC<SettingsModalProps> = ({
    isOpen,onClose,currentuser
}) => {
    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false)
    const{register,handleSubmit,setValue,watch,formState:{errors,}}=useForm<FieldValues>({
        defaultValues:{
            name:currentuser?.name,
            image:currentuser?.image
        }
    });

    const image=watch('image')

    const handleUpload=(result:any)=>{
        // console.log("handle Upload working.");
        setValue('image',result?.info?.secure_url,{
            shouldValidate:true
        })
    }

    const onsubmit:SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true)

        axios.post('/api/settings',data)
        .then(()=>{router.refresh(); onClose();})
        .catch(()=>toast.error('Something Went Wrong'))
        .finally(()=>setIsLoading(false))
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onsubmit)}>
            <div className='space-y-12'>
                <div className='border-gray-900/10 pb-12'>
                <h2 className='text-base font-semibold leading-7 text-gray-900'>Your Profile</h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>Edit Your Profile</p>
                <div className='mt-10 flex flex-col gap-y-8'>
                        <Input disabled={isLoading}
                        label='Name'
                        id="name"
                        errors={errors}
                        required
                        register={register}
                        />
                        <div>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>Photo</label>
                            <div className='mt-2 flex items-center gap-x-3 '> 
                                <Image width="52" height="52" className='rounded-full'
                                src={image||currentuser?.image||'/images/placeholder.png'} alt='Avatar'/>

                                
                                <CldUploadWidget
                                 uploadPreset="chat-media"
                                 options={{ maxFiles: 1 }}
                                 onSuccess={(result) => {
                                    // console.log("Upload Success:", result);
                                    handleUpload(result); // your logic to set image
                                  }}>

                                    {({ open }) => {
                                        return (
                                        <Button
                                            type="button"
                                            onClick={() => open?.()}
                                            disabled={isLoading}
                                            secondary
                                        >
                                            Change
                                        </Button>
                                        );
                                    }}
                                    </CldUploadWidget>
                            </div>
                        </div>
                </div>
                </div>

                <div className='mt-6 flex items-center justify-end gap-x-6 '>
                                <Button disabled={isLoading} secondary onClick={onClose}> Cancel</Button>
                                <Button disabled={isLoading} type='submit' onClick={onClose}> Save</Button>
                </div>
            </div>
        </form>
    </Modal>
  )
}

export default SettingsModal