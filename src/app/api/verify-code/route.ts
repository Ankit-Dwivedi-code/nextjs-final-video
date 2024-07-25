import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function POST(request : Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername =  decodeURIComponent(username)

        const user = await UserModel.findOne(
            {username: decodedUsername}
        )
        if (!user) {
            return Response.json(
                {message : "User not found", success : false},
                {status: 500}
            )  
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCode) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {message : "User verified successfully", success : true},
                {status: 200}
            ) 
        }else if(!isCodeNotExpired){
            return Response.json(
                {message : "Verify code has expired please sign up again", success : false},
                {status: 400}
            ) 
        }else{
            return Response.json(
                {message : "Incorrect verification code!", success : false},
                {status: 400}
            ) 
        }

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {message : "Error verifying user", success : false},
            {status: 500}
        )
    }
}