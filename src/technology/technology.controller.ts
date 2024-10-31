import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { TechnologyService } from "./technology.service";
import { TechRequest, TechResponse, TechUpdateRequest } from "../model/technology.model";
import { CommonResponse } from "../model/common-response.model";
import { CloudinaryService } from "../common/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/api/v1/technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService, private cloudinaryService: CloudinaryService) {
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

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<CommonResponse<string>> {
    console.log(file);
    const result = await this.cloudinaryService.uploadImage(file);

    return {
      statusCode: HttpStatus.OK,
      message: 'Image uploaded',
      data: result.secure_url
    }
  }
}
