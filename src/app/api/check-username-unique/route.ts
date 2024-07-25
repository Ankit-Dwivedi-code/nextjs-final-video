import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidations } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidations
})

export async function GET(request:Request) {

    //This was used in old version of next js now we not need this
    // if (request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message : "Only GET method is allowed"
    //         },
    //         {status : 405}
    //     )
    // }
    
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }

        //Validate witjh Zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); //Todo : remove

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {success: false,
                    message : usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                },
                {status : 400}
            )
        }

        const {username} =  result.data
        console.log("username", username);
        
        const existingVerifiedUser = await UserModel.findOne({username, isVerified : true})

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message : "Username is already taken"
                },
                {status : 400}
            )
        }

        return Response.json(
            {
                success: true,
                message : "Username is available"
            },
            {status : 200}
        )
        
    } catch (error) {
        console.error("Error in GET Username Query route", error)
        return Response.json(
            {
                success : false,
                message : "Internal Server Error, Error checking Username"
            },
            {status : 500}
        )
    }
}