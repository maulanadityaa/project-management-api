import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ProjectRequest,
  ProjectResponse,
  ProjectSearchRequest,
  ProjectUpdateRequest,
} from '../model/project.model';
import { CommonResponse } from '../model/common-response.model';
import { memoryStorage } from 'multer';
import { Auth } from '../common/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('/api/v1/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Project created', type: ProjectResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ProjectRequest
  })
  async create(
    @Auth() token: string,
    @Body() request: ProjectRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<CommonResponse<ProjectResponse>> {
    const projectData: ProjectRequest = {
      name: request.name,
      description: request.description,
      technologies: Array.isArray(request.technologies)
        ? request.technologies
        : request.technologies.split(','),
      image: image,
    };
    console.log(projectData);

    const result = await this.projectService.create(token, projectData);

    return {
      statusCode: 201,
      message: 'Project created',
      data: result,
    };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Project updated' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ProjectUpdateRequest
  })
  @ApiBearerAuth()
  async update(
    @Auth() token: string,
    @Body() request: ProjectUpdateRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ): Promise<CommonResponse<ProjectResponse>> {
    const projectData: ProjectUpdateRequest = {
      id: request.id,
      name: request.name,
      description: request.description,
      technologies: Array.isArray(request.technologies)
        ? request.technologies
        : request.technologies.split(','),
      image: image,
    };

    const result = await this.projectService.update(token, projectData);

    return {
      statusCode: 200,
      message: 'Project updated',
      data: result,
    };
  }

  @Get('/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a project' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Project found' })
  @ApiParam({ name: 'projectId', description: 'Project ID', example: 'ValidUUIDv4' })
  async get(
    @Param('projectId') projectId: string,
  ): Promise<CommonResponse<ProjectResponse>> {
    const result = await this.projectService.get(projectId);

    return {
      statusCode: 200,
      message: 'Project found',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search projects' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Projects found' })
  @ApiQuery({ name: 'name', description: 'Project Name', example: 'Project Name', required: false })
  @ApiQuery({ name: 'techs', description: 'Array of technologies', example: ['tech1', 'tech2'], required: false })
  @ApiQuery({ name: 'page', description: 'Page number (optional) - default 1', example: 1, required: false })
  @ApiQuery({ name: 'size', description: 'Page size (optional) - default 10', example: 10, required: false })
  async search(
    @Query('name') name?: string,
    @Query('techs') techs?: any,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<CommonResponse<ProjectResponse[]>> {
    const request: ProjectSearchRequest = {
      name: name,
      techs: Array.isArray(techs) ? techs : techs?.split(','),
      page: parseInt(String(page)) || 1,
      size: parseInt(String(size)) || 10,
    };

    return await this.projectService.search(request);
  }
}
