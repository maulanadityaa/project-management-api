import { Strategy } from "passport-jwt";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    validate(payload: any): Promise<{
        name: any;
        username: any;
    }>;
}
export {};
