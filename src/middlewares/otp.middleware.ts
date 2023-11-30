import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers['idtoken'];

    if (!idToken) {
        return res.status(401).json({ message: 'OTP not provided in the header' });
    }

    try {
        const tokenString = Array.isArray(idToken) ? idToken[0] : idToken;
        
        const decodedToken = await admin.auth().verifyIdToken(tokenString);
        req['user'] = decodedToken; // Attach user information to the request
        console.log(decodedToken);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid ID Token' });
    }
  }
}
