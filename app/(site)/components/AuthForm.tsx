"use client";

import Button from '@/app/components/Button';
import Input from '@/app/components/input/Input';
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsFacebook, BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type variant= 'LOGIN' | 'REGISTER';
const AuthForm = () => {
    const session=useSession();
    const router=useRouter();
    const [variant,setvariant]=useState<variant>('LOGIN');
    const [isLoading,setIsLoading]=useState(false);

    useEffect(()=>{
        if(session?.status=='authenticated'){
            router.push('/users');
        }   
    },[session?.status,router])

    const toggleVariant=useCallback(()=>{
        if(variant=='LOGIN') setvariant('REGISTER')
        else setvariant('LOGIN')
    },[variant]);

    const {
        register,handleSubmit,
        formState:{
            errors
        }
    }=useForm<FieldValues>({
        defaultValues:{
            name:'',
            email:'',
            password:''
        }
    })

    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true)
        if(variant=='REGISTER'){
            axios.post('/api/register',data)
            .then(()=>signIn('credentials',data))
            .catch(()=>toast.error("Something went wrong"))
            .finally(()=>setIsLoading(false))
            }
        if(variant=='LOGIN'){
            signIn('credentials',{
                ...data,
                redirect:false
            })
            .then((callback)=>{
                if(callback?.error){
                    toast.error("Invalid Credentials")
                }
                if(callback?.ok && !callback?.error){
                    toast.success("Logged In!")
                    router.push('/users');
                }
            })
            .finally(()=>setIsLoading(false))
            }
    }

    const socialAction=(action:string)=>{
        setIsLoading(true)
        //nextauth social sign-in
    }
  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='
        bg-white px-4 py-8 shadow
        sm:rounded-lg
        sm:px-10
        '>
            <form className='space-y-6'
            onSubmit={handleSubmit(onSubmit)}
            >
                {variant=='REGISTER' && (

            
                <Input
                id="name"
                label='Name'
                register={register}
                errors={errors}
                disabled={isLoading}
                />
                    )}
                    <Input
                id="email"
                label='Email address'
                type='email'
                register={register}
                errors={errors}
                disabled={isLoading}
                />
                <Input
                id="password"
                label='Password'
                type='password'
                register={register}
                errors={errors}
                disabled={isLoading}
                />
                <div>
                    <Button
                    disabled={isLoading}
                    fullWidth
                    type="submit"
                    >{variant=='LOGIN' ? 'Sign In':'Register'}</Button>
                </div>
            </form>
            <div className='mt-6'>
                    <div className='relative'>
                        <div 
                        className='
                        absolute
                        inset-0
                        flex
                        items-center
                        '
                        >
                          <div className='w-full border-t border-gray-400'/>
                                
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'> or continue with</span>
                        </div>
                    </div>
                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton
                        icon={BsGithub}
                        onClick={()=>socialAction('github')}
                        />

                         <AuthSocialButton
                        icon={BsGoogle}
                        onClick={()=>socialAction('google')}
                        />
                        <AuthSocialButton
                        icon={BsFacebook}
                        onClick={()=>socialAction('facebook')}
                        />
                    </div>
            </div>
            <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                    <div>
                        {variant=='LOGIN' ?'New to the Messenger?':'Already Have an Account?'}
                    </div>
                    <div 
                    onClick={toggleVariant}
                    className='underline cursor-pointer'
                    >
                        {variant=='LOGIN' ? 'Create an Account':'Login to Your Account'}
                    </div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm