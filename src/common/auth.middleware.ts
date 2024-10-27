import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { DecodedUser } from "../model/auth.model";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new HttpException('Authorization header not found', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token not found', 401);
    }

    const decoded = await this.jwtService.verifyToken(token);
    if (!decoded.username || !decoded.name || !decoded.userId || !decoded) {
      throw new HttpException('Invalid or expired token', 401);
    }

    next();
  }
}