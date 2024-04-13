const z = require("zod")
const signupSchema = z.object({
    firstName: z.string().min(1, { message: "FirstName is required" }).trim(),
    lastName: z.string().min(1, { message: "LastName is required" }).trim(),
    email : z.string().email({message:"Enter Valid Email"}).trim(),
    password : z.string().min(8,{message:"Password must be of 8 letters"}).trim()
})

const signinSchema = z.object({
    email : z.string().email({message:"Enter Valid Email"}).trim(),
    password : z.string().min(8,{message:"Password must be of 8 letters"}).trim()
})

module.exports = {signupSchema,signinSchema}