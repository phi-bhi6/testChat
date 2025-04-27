// import { useParams } from "next/navigation";
// import { useMemo } from "react";

// const userConversation=()=>{
//     const params=useParams();

//     const converationId=useMemo(()=>{
//         if(!params?.converationId){
//             return ''
//         }
//         return params.converationId as string;
//     },[params?.converationId]);

//     const isOpen=useMemo(()=>!!converationId,[converationId])

//     return useMemo(()=>({
//         isOpen,
//         converationId: conversationId
//     }),[isOpen,converationId])
// };

// export default userConversation;



import { useParams } from "next/navigation";
import { useMemo } from "react";

const userConversation = () => {
    const params = useParams();

    const conversationId = useMemo(() => {
        if (!params?.conversationId) {
            return '';
        }
        return params.conversationId as string;
    }, [params?.conversationId]);

    const isOpen = useMemo(() => !!conversationId, [conversationId]);

   
    return useMemo(() => ({
        isOpen,
        converationId: conversationId
    }), [isOpen, conversationId]);
};

export default userConversation;
