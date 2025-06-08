"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const cloudinary_service_1 = require("../common/cloudinary.service");
const prisma_service_1 = require("../common/prisma.service");
const validation_service_1 = require("../common/validation.service");
const jwt_service_1 = require("../jwt/jwt.service");
const technology_service_1 = require("../technology/technology.service");
const project_validation_1 = require("./project.validation");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
let ProjectService = class ProjectService {
    constructor(prismaService, validationService, logger, cloudinaryService, technologyService, jwtService) {
        this.prismaService = prismaService;
        this.validationService = validationService;
        this.logger = logger;
        this.cloudinaryService = cloudinaryService;
        this.technologyService = technologyService;
        this.jwtService = jwtService;
        this.dateNow = (0, moment_timezone_1.default)().tz(process.env.APP_TIMEZONE).toDate();
    }
    async create(token, request) {
        this.logger.debug(`Creating project with data ${JSON.stringify(request.name)}`);
        console.log('DAteNOW', this.dateNow);
        request.technologies = Array.isArray(request.technologies)
            ? request.technologies
            : request.technologies.split(',');
        const createRequest = this.validationService.validate(project_validation_1.ProjectValidation.CREATE, request);
        const { userId } = await this.jwtService.verifyToken(token);
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
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
    async checkProjectMustExist(id) {
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
            throw new common_1.HttpException('Project not found', 404);
        }
        return project;
    }
    async get(id) {
        this.logger.debug(`Getting project ${id}`);
        const project = await this.checkProjectMustExist(id);
        return await this.toProjectResponse(project);
    }
    async update(token, request) {
        this.logger.debug(`Updating project with data ${JSON.stringify(request.name)}`);
        if (request.technologies) {
            request.technologies = Array.isArray(request.technologies)
                ? request.technologies
                : request.technologies.split(',');
        }
        const updateRequest = this.validationService.validate(project_validation_1.ProjectValidation.UPDATE, request);
        const { userId } = await this.jwtService.verifyToken(token);
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
        }
        const project = await this.checkProjectMustExist(updateRequest.id);
        if (userId !== project.user_id) {
            throw new common_1.HttpException('Unauthorized', 401);
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
        const updatedProject = await this.prismaService.$transaction(async (prisma) => {
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
        });
        return await this.toProjectResponse(updatedProject);
    }
    async search(request) {
        this.logger.debug(`Searching project with data ${JSON.stringify(request)}`);
        const searchRequest = this.validationService.validate(project_validation_1.ProjectValidation.SEARCH, request);
        return await this.searchProjects(searchRequest);
    }
    async searchProjects(searchRequest, userId) {
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
            statusCode: common_1.HttpStatus.OK,
            message: 'Projects found',
            data: await Promise.all(projects.map(async (project) => {
                return await this.toProjectResponse(project);
            })),
            paging: {
                currentPage: searchRequest.page,
                totalPage: Math.ceil(total / searchRequest.size),
                size: searchRequest.size,
                totalRows: total,
            },
        };
    }
    async getProjectsPerUser(token, request) {
        this.logger.debug(`Search projects per current user`);
        const searchRequest = this.validationService.validate(project_validation_1.ProjectValidation.SEARCH, request);
        const { userId } = await this.jwtService.verifyToken(token);
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
        }
        return await this.searchProjects(searchRequest, userId);
    }
    async toProjectResponse(project) {
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
                username: user.username,
                name: user.name,
            },
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        };
    }
    async delete(token, id) {
        this.logger.debug(`Deleting project ${id}`);
        const { userId } = await this.jwtService.verifyToken(token);
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
        }
        const project = await this.checkProjectMustExist(id);
        if (userId !== project.user_id) {
            throw new common_1.HttpException('Unauthorized', 401);
        }
        await this.prismaService.project.update({
            where: {
                id: id,
            },
            data: {
                is_active: false,
                updated_at: this.dateNow,
            },
        });
        return true;
    }
    async reactivate(token, id) {
        this.logger.debug(`Reactivating project ${id}`);
        const { userId } = await this.jwtService.verifyToken(token);
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 404);
        }
        const project = await this.checkProjectMustExist(id);
        if (userId !== project.user_id) {
            throw new common_1.HttpException('Unauthorized', 401);
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
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        validation_service_1.ValidationService,
        winston_1.Logger,
        cloudinary_service_1.CloudinaryService,
        technology_service_1.TechnologyService,
        jwt_service_1.JwtService])
], ProjectService);
//# sourceMappingURL=project.service.js.map