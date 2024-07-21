import { z } from "zod";

export const usernameValidations = z
    .string()
    .min(2, 'Username must be atleast two characters')
    .max(20, 'Username must be no more than twenty characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can contain only letters and underscores. ')


export const signUpSchema = z.object({
        username : usernameValidations,
        email :z.string().email({message : "Please enter a valid email address"}),
        password : z.string().min(6, {message : 'Password must be atleast six characters'})
})

