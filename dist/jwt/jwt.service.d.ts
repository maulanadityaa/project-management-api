import { JwtService as NestJwtService } from '@nestjs/jwt';
export declare class JwtService {
    private readonly jwtService;
    constructor(jwtService: NestJwtService);
    generateToken(userInfo: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
    verifyTokenWithoutExpiration(token: string): Promise<any>;
    refreshToken(token: string, userInfo: any): Promise<string>;
}
