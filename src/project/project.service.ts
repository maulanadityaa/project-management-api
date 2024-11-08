import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ProjectRequest,
  ProjectResponse,
  ProjectSearchRequest,
  ProjectUpdateRequest,
} from '../model/project.model';
import { ProjectValidation } from './project.validation';
import { CloudinaryService } from '../common/cloudinary.service';
import { Project } from '@prisma/client';
import { TechnologyService } from '../technology/technology.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonResponse } from '../model/common-response.model';

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private cloudinaryService: CloudinaryService,
    private technologyService: TechnologyService,
    private jwtService: JwtService,
  ) {}

  async create(
    token: string,
    request: ProjectRequest,
  ): Promise<ProjectResponse> {
    this.logger.debug(
      `Creating project with data ${JSON.stringify(request.name)}`,
    );

    const createRequest: ProjectRequest = this.validationService.validate(
      ProjectValidation.CREATE,
      request,
    );

    const { userId } = await this.jwtService.verifyToken(token);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    let techIds = [];
    for (const techId of createRequest.technologies) {
      const tech = await this.technologyService.get(techId);
      if (tech) {
        techIds.push(tech.id);
      }
    }

    const image = await this.cloudinaryService.uploadImage(createRequest.image);

    const project = await this.prismaService.$transaction(async (prisma) => {
      return prisma.project.create({
        data: {
          name: createRequest.name,
          description: createRequest.description,
          project_image: {
            create: {
              url: image.secure_url,
            },
          },
          project_technology: {
            create: techIds.map((id) => {
              return {
                technology_id: id,
              };
            }),
          },
          ...{ user_id: user.id },
        },
      });
    });

    return await this.toProjectResponse(project);
  }

  async checkProjectMustExist(id: string): Promise<Project> {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: id,
      },
      include: {
        project_image: true,
        project_technology: {
          include: {
            technology: true,
          },
        },
        user: true,
      },
    });

    if (!project) {
      throw new HttpException('Project not found', 404);
    }

    return project;
  }

  async get(id: string): Promise<ProjectResponse> {
    this.logger.debug(`Getting project ${id}`);

    const project = await this.checkProjectMustExist(id);

    return await this.toProjectResponse(project);
  }

  async update(
    token: string,
    request: ProjectUpdateRequest,
  ): Promise<ProjectResponse> {
    this.logger.debug(
      `Updating project with data ${JSON.stringify(request.name)}`,
    );

    const updateRequest: ProjectUpdateRequest = this.validationService.validate(
      ProjectValidation.UPDATE,
      request,
    );

    const { userId } = await this.jwtService.verifyToken(token);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const project = await this.checkProjectMustExist(updateRequest.id);
    const image = await this.prismaService.projectImage.findFirst({
      where: {
        project_id: project.id,
      },
    });
    let imageUrl = image.url;

    if (request.image !== undefined) {
      const image = await this.cloudinaryService.uploadImage(request.image);
      imageUrl = image.secure_url;
    }

    let techIds = [];
    for (const techId of updateRequest.technologies) {
      const tech = await this.technologyService.get(techId);
      if (tech) {
        techIds.push(tech.id);
      }
    }

    const updatedProject = await this.prismaService.$transaction(
      async (prisma) => {
        return prisma.project.update({
          where: {
            id: updateRequest.id,
          },
          data: {
            name: updateRequest.name,
            description: updateRequest.description,
            project_technology: {
              deleteMany: {
                project_id: updateRequest.id,
              },
              create: techIds.map((id) => {
                return {
                  technology_id: id,
                };
              }),
            },
            project_image: {
              deleteMany: {
                project_id: updateRequest.id,
              },
              create: {
                url: imageUrl,
              },
            },
          },
        });
      },
    );

    return await this.toProjectResponse(updatedProject);
  }

  async search(
    request: ProjectSearchRequest,
  ): Promise<CommonResponse<ProjectResponse[]>> {
    this.logger.debug(`Searching project with data ${JSON.stringify(request)}`);

    const searchRequest: ProjectSearchRequest = this.validationService.validate(
      ProjectValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.name) {
      filters.push({
        name: {
          contains: searchRequest.name,
          mode: 'insensitive',
        },
      });
    }

    if (searchRequest.techs && searchRequest.techs.length > 0) {
      let techIds = [];
      for (const techId of searchRequest.techs) {
        const tech = await this.technologyService.getByName(techId);
        if (tech) {
          techIds.push(tech.id);
        }
      }

      filters.push({
        project_technology: {
          some: {
            technology_id: {
              in: techIds,
            },
          },
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const projects = await this.prismaService.project.findMany({
      where: {
        AND: filters,
      },
      include: {
        project_image: true,
        project_technology: {
          include: {
            technology: true,
          },
        },
        user: true,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.project.count({
      where: {
        AND: filters,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Projects found',
      data: await Promise.all(
        projects.map(async (project) => {
          return await this.toProjectResponse(project);
        }),
      ),
      paging: {
        currentPage: searchRequest.page,
        totalPage: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
        totalRows: total,
      },
    };
  }

  async toProjectResponse(project: Project): Promise<ProjectResponse> {
    const technologies = await this.prismaService.technology.findMany({
      where: {
        project_technology: {
          some: {
            project_id: project.id,
          },
        },
      },
    });

    const image = await this.prismaService.projectImage.findFirst({
      where: {
        project_id: project.id,
      },
    });

    const user = await this.prismaService.user.findFirst({
      where: {
        id: project.user_id,
      },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: technologies.map((technology) => technology.name),
      imageUrl: image.url,
      userResponse: {
        username: user.username,
        name: user.name,
      },
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }
}
