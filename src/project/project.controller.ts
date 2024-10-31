import {
  Body,
  Controller, FileTypeValidator, Get, HttpCode,
  HttpException, HttpStatus,
  MaxFileSizeValidator, Param,
  ParseFilePipe, ParseIntPipe,
  Post, Put, Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProjectRequest, ProjectResponse, ProjectSearchRequest, ProjectUpdateRequest } from "../model/project.model";
import { CommonResponse } from "../model/common-response.model";
import { memoryStorage } from "multer";
import { Auth } from "../common/auth.decorator";

@Controller('/api/v1/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async create(
    @Auth() token: string,
    @Body() request: ProjectRequest,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
      ],
    }),) image: Express.Multer.File
  ): Promise<CommonResponse<ProjectResponse>> {
    console.log('Controller file:', {
      fieldname: image?.fieldname,
      originalname: image?.originalname,
      mimetype: image?.mimetype,
      size: image?.size,
      hasBuffer: !!image?.buffer
    });

    // Don't spread the file object or modify it
    const projectData: ProjectRequest = {
      name: request.name,
      description: request.description,
      technologies: Array.isArray(request.technologies)
        ? request.technologies
        : [request.technologies],
      image: image
    };

    const result = await this.projectService.create(token, projectData);

    return {
      statusCode: 201,
      message: 'Project created',
      data: result
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async update(
    @Auth() token: string,
    @Body() request: ProjectUpdateRequest,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
      ],
      fileIsRequired: false
    }),) image: Express.Multer.File
  ): Promise<CommonResponse<ProjectResponse>> {
    const projectData: ProjectUpdateRequest = {
      id: request.id,
      name: request.name,
      description: request.description,
      technologies: Array.isArray(request.technologies)
        ? request.technologies
        : [request.technologies],
      image: image
    };

    const result = await this.projectService.update(token, projectData);

    return {
      statusCode: 200,
      message: 'Project updated',
      data: result
    }
  }

  @Get('/:projectId')
  @HttpCode(HttpStatus.OK)
  async get(@Param('projectId') projectId: string): Promise<CommonResponse<ProjectResponse>> {
    const result = await this.projectService.get(projectId);

    return {
      statusCode: 200,
      message: 'Project found',
      data: result
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async search(
    @Query('name') name?: string,
    @Query('techs') techs?: string[],
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ): Promise<CommonResponse<ProjectResponse[]>> {
    console.log('Searching projects:', { name, techs, page, size });
    const request: ProjectSearchRequest = {
      name: name,
      techs: techs,
      page: page || 1,
      size: size || 10,
    }

    return await this.projectService.search(request);
  }
}
