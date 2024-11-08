import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import {
  TechRequest,
  TechResponse,
  TechUpdateRequest,
} from '../model/technology.model';
import { CommonResponse } from '../model/common-response.model';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('/api/v1/technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new technology',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Technology created',
    type: TechResponse,
  })
  @ApiBody({ type: TechRequest })
  @ApiBearerAuth()
  async create(
    @Body() request: TechRequest,
  ): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.create(request);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Technology created',
      data: result,
    };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a technology',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Technology updated',
    type: TechResponse,
  })
  @ApiBody({ type: TechUpdateRequest })
  @ApiBearerAuth()
  async update(
    @Body() request: TechUpdateRequest,
  ): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.update(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology updated',
      data: result,
    };
  }

  @Get('/:techId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a technology' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Technology retrieved',
    type: TechResponse,
  })
  @ApiParam({ name: 'techId', type: String, example: 'ValidUUIDv4' })
  async get(
    @Param('techId') techId: string,
  ): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.get(techId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology retrieved',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all technologies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Technologies retrieved',
    type: TechResponse,
    isArray: true,
  })
  async list(): Promise<CommonResponse<TechResponse[]>> {
    const result = await this.technologyService.list();

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology retrieved',
      data: result,
    };
  }

  @Delete('/:techId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a technology',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Technology deleted',
    type: Boolean,
  })
  @ApiParam({ name: 'techId', type: String, example: 'ValidUUIDv4' })
  @ApiBearerAuth()
  async delete(
    @Param('techId') techId: string,
  ): Promise<CommonResponse<boolean>> {
    await this.technologyService.delete(techId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology deleted',
      data: true,
    };
  }
}
