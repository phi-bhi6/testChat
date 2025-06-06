import getConversations from "../actions/getConversation"
import getUser from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar"
import ConversationList from "./components/ConversationList"

export default async function ConversationsLayout({
    children
}:{
    children:React.ReactNode
}){
    const conversations=await getConversations();
    const users=await getUser();

    return(
        <Sidebar>
            <div className="h-full">
                <ConversationList users={users}
                initialItems={conversations}
                />
            {children}
            </div>
        </Sidebar>
    )
}