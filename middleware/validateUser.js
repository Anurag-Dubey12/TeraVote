import User from '../models/auth_model.js';

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
