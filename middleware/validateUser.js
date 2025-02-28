import User from '../models/user.js';
import CustomErrorHandler from '../helper/CustomErrorHandler.js';
import jwtService from '../helper/jwtService.js';
const validateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("authHeader:", authHeader);
    if (!authHeader) {
        console.log("Authorization header is missing");
        return next(CustomErrorHandler.unAuthorized("Authorization header is missing.")); 
      }
     
      const token = authHeader.split(" ")[1];
    try {

        const {userId} = jwtService.verify(token);
        req.user = User;
           const userData = await User.findOne({ _id: userId });
           if (!userData) {
            console.log("User not found");
            return next(CustomErrorHandler.unAuthorized("User not found"));
          }
          
          global.user = userData;
        next();
    } catch (err) {
        console.log("JWT verification error:", err);
        return next(CustomErrorHandler.unAuthorized("Invalid or expired token."));
      }
};

export default validateUser;
