import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from "./jwt/jwt.module";

@Module({
  imports: [CommonModule, AuthModule, JwtAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
