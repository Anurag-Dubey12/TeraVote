import bcrypt from 'bcrypt';
const excryption={
    async hashPassword(plainPassword) {
        try {
            if (!plainPassword) {
                throw new Error("Password is required");
            }
            const saltRounds = 10;
            const encryptedPassword = await bcrypt.hash(plainPassword, saltRounds);
            return encryptedPassword;
        } catch (error) {
            console.error("Error hashing password:", error.message);
            throw error;
        }
    },
    async compareHash(plainPassword, hashedPassword) {
        try {
            if (!plainPassword || !hashedPassword) {
                throw new Error("Both plainPassword and hashedPassword are required");
            }
            const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatched;
        } catch (error) {
            console.error("Error comparing password:", error.message);
            throw error;
        }
    }
}

export default excryption;