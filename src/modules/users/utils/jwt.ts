import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { Role, UserWithoutPass } from '../types'


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

const rank: Record<Role, number> = { editor: 1, admin: 2 };

export function requireRole(minRole: Role) {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        if (!userRole) return res.status(401).json({ error: 'No autenticado' });
        if (rank[userRole] < rank[minRole]) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        return next();
    };
}