import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb"

import { NextResponse } from "next/server";

export  async function POST(
    request:Request
){
    try{
    const body=await request.json();
    const{
        email,name,password
    }=body;

    if(!email||!name||!password) return new NextResponse('Missing Details',{status:400})

    const hashedPassword=await bcrypt.hash(password,14);

    const user=await prisma.user.create({
        data:{
            name,email,hashedPassword
        }
    });

    return NextResponse.json(user);
}catch(error:any){
console.log(error,'Registration_Error')
return new NextResponse('Internal Error',{status:500});
}

}