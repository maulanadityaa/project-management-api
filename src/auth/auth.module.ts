import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from "../jwt/jwt.module";

@Module({
  imports: [JwtAuthModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
