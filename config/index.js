
import dotenv from 'dotenv';

dotenv.config();

//here we are destructing all variable 
export const {
    APP_PORT,
    DEBUG_MODE,
    MONGO_DB_URL,
    JWT_SECRET ,
} = process.env;