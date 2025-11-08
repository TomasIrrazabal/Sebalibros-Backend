import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { UserWithoutPass } from '../modules/users/types'
import { getUserByIdWithoutPass } from '../modules/users/utils/user.utils'

declare global {
    namespace Express {
        interface Request {
            user?: UserWithoutPass
        }
    }
}


export function generateJWT(payload: JwtPayload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
    })
    return token
}



export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.auth as string;
    if (!token) {
        const error = new Error('Not authenticated')
        res.status(401).json({ error: error.message })
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded === 'object' && decoded.id) {
            req.user = decoded as any;
            return next()
        }
        return res.status(401).json({ error: "Not authenticated" });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

export const getUser = async (req: Request, res: Response) => {
    res.send(req.user);
};