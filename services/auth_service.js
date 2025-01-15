// authService.js
import { User } from "../models/index.js";
import encrypt from '../middleware/encryption.js';

const AuthService = {
    async CreateUser(data) {
        try {
            const {
                profilePicture,
                firstName,
                lastName,
                dateOfBirth,
                emailAddress,
                phone,
                password,
                country,
                state,
                city,
                Walk_of_life,
                Interest,
                Biography
            } = data;

            const encryptedPassword = await encrypt.hashPassword(password);
            
            const userDetails = new User({
                profilePicture,
                firstName,
                lastName,
                dateOfBirth,
                emailAddress,
                phone,
                password: encryptedPassword,
                country,
                state,
                city,
                Walk_of_life,
                Interest,
                Biography,
                isDeleted: false,
                isPhoneNumberVerified: false
            });

            const savedUser = await userDetails.save();
            const accessToken = await savedUser.generateAuthToken();

            const userData = savedUser.toObject();
            delete userData.password;
            delete userData.__v;

            return {
                user: userData,
            };

        } catch (error) {
            console.error("Error in AuthService.CreateUser:", error);
            return {
                success: false,
                message: error.message || "Failed to create user"
            };
        }
    }
};

export default AuthService;