import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TechnologyModule } from '../technology/technology.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [TechnologyModule, JwtAuthModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
