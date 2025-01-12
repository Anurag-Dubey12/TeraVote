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
            city,
            Walk_of_life,
            Interest,
            Biography
        } = data;
        console.log(data);

        const encryptedpassword=await  encrypt.hashPassword(password);

        const userDetails = new User({
            profilePicture,
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone,
            password: encryptedpassword,
            country,
            state,
            city,
            Walk_of_life,
            Interest,
            Biography,
            isDeleted: false,
            isPhoneNumberVerified: false
        });

        try{
            const SavedUser=await userDetails.save();
            const accessToken=await SavedUser.generateAuthToken();
            SavedUser.accessToken = accessToken;

            return {
                user:SavedUser
            }

        }catch(error){
            console.log("Error in creating user",error);
        }
    }

    //#endregion
}

export default AuthService;