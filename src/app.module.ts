import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { TechnologyModule } from './technology/technology.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    JwtAuthModule,
    TechnologyModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
