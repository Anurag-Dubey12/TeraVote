import User from '../models/user.js';

const validateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwtService.verify(token);
        
        // Find user and check if token is still valid in database
        const user = await User.findById(decoded.userId);
        if (!user || !user.hasValidToken(token)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default validateUser;
// import User from '../models/user.js';
// import jwtService from '../helper/jwtService.js';


// const validateUser  = async (req, res, next) => {
//     try {
//         // Extract authorization header from request
//         const authHeader = req.headers.authorization;

//         // Check if authorization header is present and in correct format
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'No Authorization token is provided',
//                 error: 'Unauthorized'
//             });
//         }

//         // Extract token from authorization header
//         const token = authHeader.split(' ')[1];

//         // Verify token using JWT service
//         const decoded = jwtService.verify(token);

//         // Find user by ID and check if token is still valid in database
//         const user = await User.findById(decoded.userId);

//         // Check if user exists and token is valid
//         if (!user || !user.hasValidToken(token)) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid or expired token',
//                 error: 'Unauthorized'
//             });
//         }

//         // Set user data in request object and global object
//         req.user = { userId: decoded.userId, ...user.toJSON() };
//         global.user = req.user;

//         // Proceed to next middleware function
//         next();
//     } catch (error) {
//         // Handle any errors during token verification or user retrieval
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid or expired token',
//             error: 'Unauthorized'
//         });
//     }
// };

// export default validateUser ;