import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User 

    if (!session || !session.user) {
        return Response.json(
            {message : "Not authenticated", success : false},
            {status: 401}
        )  
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {
                isAcceptingMessage : acceptMessages
            },{new: true}
        )

        if(!updatedUser){
            return Response.json(
                {message : "Failed to update user status to update messages", success : false},
                {status: 401}
            )
        }

        return Response.json(
            {message : "message appceptance status updated successfully", success : true, updatedUser},
            {status: 200}
        )
    } catch (error) {
        console.error("Failed to update user status to update messages");
        return Response.json(
            {message : "Failed to update user status to update messages", success : false},
            {status: 500}
        )
    }
}


export async function GET(request : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User 

    if (!session || !session.user) {
        return Response.json(
            {message : "Not authenticated", success : false},
            {status: 401}
        )  
    }

    const userId = user._id

    try {
         const foundUser =   await UserModel.findById(userId)
    
         if (!foundUser) {
            return Response.json(
                {message : "User not found", success : false},
                {status: 404}
            )
         }
    
         return Response.json(
            {message : "user found successfully",isAcceptingMessages : user.isAcceptingMessages, success : true},
            {status: 302}
        )
    } catch (error) {
        console.error("Failed to update user status to accept messages");
        return Response.json(
            {message : "Error in getting messgae acceptance error", success : false},
            {status: 500}
        )
    }
}