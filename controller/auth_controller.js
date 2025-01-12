import Joi from "joi";
import {User} from "../models/index.js";
import { AuthService } from "../services/index.js";

const authController = {

    //#region create User
    async CreateUser(req,res,next){
        const userSchema = Joi.object({
            profilePicture: Joi.string().optional(), 
            firstName: Joi.string().required(), 
            lastName: Joi.string().optional(), 
            dateOfBirth: Joi.date().required().custom((value, helpers) => {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 13) {
                    return helpers.error('any.invalid', { message: 'User  must be at least 13 years old.' });
                }
                return value;
            }, 'Age Validation'),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            phone: Joi.string().optional(),
            password: Joi.string()
                .min(5)
                .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
                .required()
                .messages({
                    'string.pattern.base': 'Password must be alphanumeric and contain no spaces',
                }),
            country: Joi.string().optional(), 
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            Walk_of_life: Joi.string().required(),
            Interest: Joi.array().items(Joi.string()).required(),
            Biography: Joi.string().optional().min(20).max(320)
        });

        const {error}=userSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.message});
        }
        try{

            const isDataExist=await User.exists({
                $or:[
                    {emailAddress:req.body.emailAddress},
                    {phone:req.body.phone}
                ],
                isDeleted: false
            });
            if (isDataExist) {
                return next(
                    new Error("User already exists with this Email Address")
                );
            };
            const result=await AuthService.CreateUser(req.body);
            return res.status(201).json({
                success: true,
                message: "Profile created successfully",
                data: result
            });

        }catch(err){
            console.log("Error in creating user",err);
        }
    },
    //#endregion

    async editProfile(req,res,next){

        const userSchema = Joi.object({
            profilePicture: Joi.string().optional(), 
            firstName: Joi.string().required(), 
            lastName: Joi.string().optional(), 
            dateOfBirth: Joi.date().required().custom((value, helpers) => {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 13) {
                    return helpers.error('any.invalid', { message: 'User  must be at least 13 years old.' });
                }
                return value;
            }, 'Age Validation'),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            phone: Joi.string().optional(),
            password: Joi.string()
                .min(5)
                .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
                .required()
                .messages({
                    'string.pattern.base': 'Password must be alphanumeric and contain no spaces',
                }),
            country: Joi.string().optional(), 
            state: Joi.string().optional(),
            city: Joi.string().optional(),
        });
    }

}

export default authController;