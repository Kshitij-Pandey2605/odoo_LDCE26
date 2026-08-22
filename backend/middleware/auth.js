import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'globetrotter_super_secret_token_123');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found. Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }
};
