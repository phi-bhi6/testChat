"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5';

interface ModalProps{
    isOpen?:boolean;
    onClose:()=>void;
    children:React.ReactNode;
}
const Modal:React.FC<ModalProps> = ({
    isOpen,onClose,children
}) => {
    // console.log('📦 Modal rendered. isOpen:', isOpen);
  return (
    <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild as={Fragment} enter="ease-out duration-300"
         enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
                <div className='fixed inset-0 bg-gray-500/75 transition-opacity  '/>
        </TransitionChild>
            <div className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
        <TransitionChild as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
        enterTo='opacity-100 translate-y-0 sm:scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 translate-y-0 sm:scale-100'
        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
            <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl
            transition-all w-full sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10'>
                    <button type='button' className='rounded-md bg-white text-gray-400 hover:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2' onClick={onClose} >
                            <span className='sr-only'>Close</span>
                            <IoCloseCircleOutline className='h-6 w-6 '/>

                    </button>
                </div>
                {children}
            </DialogPanel>
        </TransitionChild>
        </div>
            </div>
        </Dialog>
    </Transition>
  )
}

export default Modal