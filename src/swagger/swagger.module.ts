import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { SwaggerController } from './swagger.controller';

@Module({
  providers: [SwaggerService],
  exports: [SwaggerService],
  controllers: [SwaggerController],
})
export class SwaggerModule {}
