import getCurrentUser from "@/app/actions/getCurrentUser";
import Prisma  from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface Iparams{
    converationId?:string;
};

export async function POST(
    request:Request,
    {params}:{params:Iparams}
){
    try{
            const currentUser=await getCurrentUser();
            const{
                converationId
            }=params;

            if(!currentUser?.id||!currentUser?.email) return new NextResponse('Unauthorized',{status:401})

                const conversation=await Prisma.conversation.findUnique({
                    where:{
                        id:converationId
                    },
                    include:{
                        messages:{
                            include:{
                                seen:true
                            }
                        },
                        users:true,
                    }
                });

                if(!conversation) return new NextResponse('Invalid ID',{status:400})

                    const lastMessage=conversation.messages[conversation.messages.length-1]

                    if(!lastMessage) return  NextResponse.json(conversation);

                    const updatedMessage=await Prisma.message.update({
                        where:{
                            id:lastMessage.id
                        },
                        include:{
                            sender:true,
                            seen:true,
                        },
                        data:{
                            seen:{
                                connect:{
                                    id:currentUser.id
                                }
                            }
                        }
                    });
                    await pusherServer.trigger(currentUser.email,'conversation:update',{
                        id:converationId,
                        messages:[updatedMessage]
                    });

                    if(lastMessage.seenIds.indexOf(currentUser.id)!=-1){
                        return NextResponse.json(conversation);
                    }

                    await pusherServer.trigger(converationId!,'message:update',updatedMessage);
                    return NextResponse.json(updatedMessage)
    }catch(error:any){
        console.log(error,`ERROR_MESSAGES_SEEN`);
        return new NextResponse("Internal Error",{status:500})
    }
}