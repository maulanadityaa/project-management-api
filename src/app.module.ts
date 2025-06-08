import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { TechnologyModule } from './technology/technology.module';
import { ProjectModule } from './project/project.module';
import { SwaggerModule } from './swagger/swagger.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    JwtAuthModule,
    TechnologyModule,
    ProjectModule,
    SwaggerModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
