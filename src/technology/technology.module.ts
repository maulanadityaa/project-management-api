import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';

@Module({
  providers: [TechnologyService],
  controllers: [TechnologyController]
})
export class TechnologyModule {}
