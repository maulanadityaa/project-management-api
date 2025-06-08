import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
export declare class AuthMiddleware implements NestMiddleware {
    private jwtService;
    constructor(jwtService: JwtService);
    use(req: any, res: any, next: (error?: any) => void): Promise<void>;
}
