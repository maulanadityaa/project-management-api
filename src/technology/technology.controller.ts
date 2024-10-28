import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { TechnologyService } from "./technology.service";
import { TechRequest, TechResponse, TechUpdateRequest } from "../model/technology.model";
import { CommonResponse } from "../model/common-response.model";

@Controller('/api/v1/technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService) {
  }

  @Post()
  async create(@Body() request: TechRequest): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.create(request);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Technology created',
      data: result
    }
  }

  @Put()
  async update(@Body() request: TechUpdateRequest): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.update(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology updated',
      data: result
    }
  }

  @Get('/:techId')
  async get(@Param('techId') techId: string): Promise<CommonResponse<TechResponse>> {
    const result = await this.technologyService.get(techId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology retrieved',
      data: result
    }
  }

  @Get()
  async list(): Promise<CommonResponse<TechResponse[]>> {
    const result = await this.technologyService.list();

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology retrieved',
      data: result
    }
  }

  @Delete('/:techId')
  async delete(@Param('techId') techId: string): Promise<CommonResponse<boolean>> {
    await this.technologyService.delete(techId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Technology deleted',
      data: true
    }
  }
}
