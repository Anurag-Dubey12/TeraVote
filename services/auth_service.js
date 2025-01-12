import { User } from "../models/index.js";
import encrypt from '../middleware/encryption.js' 

const AuthService = {

    //#region create user

    async CreateUser(data){

        const {
            profilePicture,
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone,
            password,
            country,
            state,
            city
        }=data;

        console.log(data);

        const encryptedpassword=await  encrypt.hashPassword(password);

        const UserDetails=new User({
            profilePicture,
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone,
            password:encryptedpassword,
            country,
            state,
            city,
            isDeleted:false,
            isPhoneNumberVerified:false
        });

        try{
            const SavedUser=await UserDetails.save();
            const accesstoken=await SavedUser.generateAuthToken();
            return {
                user:SavedUser,
                accesstoken
            }

        }catch(error){
            console.log("Error in creating user",error);
        }
    }

    //#endregion
}

export default AuthService;