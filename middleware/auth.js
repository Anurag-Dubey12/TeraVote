import jwtService from '../helpers/jwtService.js';
import mongoose from 'mongoose';

const auth = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Please use Bearer token'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwtService.verify(token);
        
        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token structure'
            });
        }

        // Set user in request with _id to match the controller expectation
        req.user = {
            _id: new mongoose.Types.ObjectId(decoded.userId)
        };
        
        next();
    } catch (error) {
        console.log("Auth error:", error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token or token expired'
        });
    }
};

export default auth;