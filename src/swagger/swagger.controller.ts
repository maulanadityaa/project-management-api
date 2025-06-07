import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('/api/v1/docs')
@ApiExcludeController()
export class SwaggerController {
  @Get()
  @Redirect('api/v1/docs', 302)
  redirectSwagger() {
    return { url: 'api/v1/docs' };
  }
}
