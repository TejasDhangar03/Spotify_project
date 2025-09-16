import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const genToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}


export default { genToken};