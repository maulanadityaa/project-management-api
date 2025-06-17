import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CloudinaryService } from '../common/cloudinary.service';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonResponse } from '../model/common-response.model';
import {
  ProjectRequest,
  ProjectResponse,
  ProjectSearchRequest,
  ProjectUpdateRequest,
} from '../model/project.model';
import { TechnologyService } from '../technology/technology.service';
import { ProjectValidation } from './project.validation';
import { fromZonedTime } from 'date-fns-tz';
import moment from 'moment-timezone';

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

  dateNow = moment().tz(process.env.APP_TIMEZONE).toDate();

  async create(
    token: string,
    request: ProjectRequest,
  ): Promise<ProjectResponse> {
    this.logger.debug(
      `Creating project with data ${JSON.stringify(request.name)}`,
    );
    console.log('DAteNOW', this.dateNow);

    request.technologies = Array.isArray(request.technologies)
      ? request.technologies
      : request.technologies.split(',');
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
          link: createRequest.link,
          created_at: this.dateNow,
          updated_at: this.dateNow,
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
        is_active: true,
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

    if (request.technologies) {
      request.technologies = Array.isArray(request.technologies)
        ? request.technologies
        : request.technologies.split(',');
    }

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
    if (userId !== project.user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const image = await this.prismaService.projectImage.findFirst({
      where: {
        project_id: project.id,
      },
    });
    let imageUrl = image.url;

    if (updateRequest.image !== undefined) {
      const image = await this.cloudinaryService.uploadImage(request.image);
      imageUrl = image.secure_url;
    }

    let techIds = [];
    if (updateRequest.technologies !== undefined) {
      for (const techId of updateRequest.technologies) {
        const tech = await this.technologyService.get(techId);
        if (tech) {
          techIds.push(tech.id);
        }
      }
    }

    const updatedProject = await this.prismaService.$transaction(
      async (prisma) => {
        if (techIds.length > 0) {
          await prisma.projectTechnology.deleteMany({
            where: {
              project_id: updateRequest.id,
            },
          });

          await prisma.projectTechnology.createMany({
            data: techIds.map((id) => {
              return {
                technology_id: id,
                project_id: updateRequest.id,
              };
            }),
          });
        }

        if (updateRequest.image !== undefined) {
          await prisma.projectImage.deleteMany({
            where: {
              project_id: updateRequest.id,
            },
          });

          await prisma.projectImage.create({
            data: {
              url: imageUrl,
              project_id: updateRequest.id,
            },
          });
        }

        return prisma.project.update({
          where: {
            id: updateRequest.id,
          },
          data: {
            name: updateRequest.name,
            description: updateRequest.description,
            link: updateRequest.link,
            updated_at: this.dateNow,
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

    return await this.searchProjects(searchRequest);
  }

  private async searchProjects(
    searchRequest: ProjectSearchRequest,
    userId?: string,
  ): Promise<CommonResponse<ProjectResponse[]>> {
    const filters = [];

    if (userId) {
      filters.push({
        user_id: userId,
      });
    }

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
      for (const techName of searchRequest.techs) {
        const tech = await this.technologyService.getByName(techName);
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
        is_active: searchRequest.isActive ?? true,
        AND: filters,
      },
      orderBy: {
        updated_at: 'desc',
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
        is_active: searchRequest.isActive ?? true,
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

  async getProjectsPerUser(
    token: string,
    request: ProjectSearchRequest,
  ): Promise<CommonResponse<ProjectResponse[]>> {
    this.logger.debug(`Search projects per current user`);

    const searchRequest: ProjectSearchRequest = this.validationService.validate(
      ProjectValidation.SEARCH,
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

    return await this.searchProjects(searchRequest, userId);
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
    const imageUrl = image?.url ?? 'https://placehold.co/600x400';

    const user = await this.prismaService.user.findFirst({
      where: {
        id: project.user_id,
      },
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      link: project.link,
      technologies: technologies.map((technology) => technology.name),
      imageUrl: imageUrl,
      userResponse: {
        uid: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }

  async delete(token: string, id: string): Promise<ProjectResponse> {
    this.logger.debug(`Deleting project ${id}`);

    const { userId } = await this.jwtService.verifyToken(token);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const project = await this.checkProjectMustExist(id);
    if (userId !== project.user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const deletedProject = await this.prismaService.project.update({
      where: {
        id: id,
      },
      data: {
        is_active: false,
        updated_at: this.dateNow,
      },
    });

    return await this.toProjectResponse(deletedProject);
  }

  async reactivate(token: string, id: string): Promise<ProjectResponse> {
    this.logger.debug(`Reactivating project ${id}`);

    const { userId } = await this.jwtService.verifyToken(token);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const project = await this.checkProjectMustExist(id);
    if (userId !== project.user_id) {
      throw new HttpException('Unauthorized', 401);
    }

    const reactivatedProject = await this.prismaService.project.update({
      where: {
        id: id,
      },
      data: {
        is_active: true,
        updated_at: this.dateNow,
      },
    });

    return await this.toProjectResponse(reactivatedProject);
  }
}
