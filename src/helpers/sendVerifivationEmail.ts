import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationemail(email:string,
    username : string,
    verifyCode: string
):Promise<ApiResponse> {
    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Random message |Verification code',
            react: VerificationEmail({username, otp:verifyCode})
          });
        return {success:true, message:"Verification Email Sent Successfully"}
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {success:false, message:"Failed to send the verification email"}
    }
}