import getCurrentUser from "@/app/actions/getCurrentUser";
import userConversation from "@/app/hooks/useConversation";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"

interface IParams{
    converationId?:string;
}

export async function DELETE(
    request:Request,
    {params}:{params:IParams}
){
    try{
        const {converationId}=params
        const currentUser=await getCurrentUser();

        if(!currentUser?.id) return new NextResponse('Unauthorized',{status:401})
            const existingConversation=await prisma.conversation.findUnique({
                where:{
                    id:converationId
                },
                include:{
                        users:true
                }
            })

            if(!existingConversation) return new NextResponse('Invalid Id',{status:400})

                const deletedConversation=await prisma.conversation.deleteMany({
                    where:{
                        id:converationId,
                        userIds:{
                            hasSome:[currentUser.id]
                        }
                    }
                });

                return NextResponse.json(deletedConversation)

    }catch(error:any){console.log(error,'ERROR_CONVERSATION_DELETE')
        return new NextResponse('Internal Error',{status:500})
    }

}