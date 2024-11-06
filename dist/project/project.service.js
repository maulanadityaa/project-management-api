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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const validation_service_1 = require("../common/validation.service");
const winston_1 = require("winston");
const nest_winston_1 = require("nest-winston");
const project_validation_1 = require("./project.validation");
const cloudinary_service_1 = require("../common/cloudinary.service");
const technology_service_1 = require("../technology/technology.service");
const jwt_service_1 = require("../jwt/jwt.service");
let ProjectService = class ProjectService {
    constructor(prismaService, validationService, logger, cloudinaryService, technologyService, jwtService) {
        this.prismaService = prismaService;
        this.validationService = validationService;
        this.logger = logger;
        this.cloudinaryService = cloudinaryService;
        this.technologyService = technologyService;
        this.jwtService = jwtService;
    }
    async create(token, request) {
        this.logger.debug(`Creating project with data ${JSON.stringify(request.name)}`);
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
        console.log('Service received file:', {
            fieldname: request.image?.fieldname,
            originalname: request.image?.originalname,
            mimetype: request.image?.mimetype,
            size: request.image?.size,
            hasBuffer: !!request.image?.buffer,
        });
        const image = await this.cloudinaryService.uploadImage(createRequest.image);
        console.log('secure URL', image.secure_url);
        let techIds = [];
        for (const techId of createRequest.technologies) {
            console.log('Checking technology:', techId);
            const tech = await this.technologyService.get(techId);
            if (tech) {
                techIds.push(tech.id);
            }
        }
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
        console.log('Project created:', project);
        return await this.toProjectResponse(project);
    }
    async checkProjectMustExist(id) {
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
                user: true
            }
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
        const image = await this.prismaService.projectImage.findFirst({
            where: {
                project_id: project.id
            }
        });
        let imageUrl = image.url;
        if (request.image !== undefined) {
            const image = await this.cloudinaryService.uploadImage(request.image);
            imageUrl = image.secure_url;
        }
        let techIds = [];
        for (const techId of updateRequest.technologies) {
            console.log('Checking technology:', techId);
            const tech = await this.technologyService.get(techId);
            if (tech) {
                techIds.push(tech.id);
            }
        }
        const updatedProject = await this.prismaService.$transaction(async (prisma) => {
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
                        }
                    }
                },
            });
        });
        return await this.toProjectResponse(updatedProject);
    }
    async search(request) {
        this.logger.debug(`Searching project with data ${JSON.stringify(request)}`);
        const searchRequest = this.validationService.validate(project_validation_1.ProjectValidation.SEARCH, request);
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
                user: true
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
            statusCode: common_1.HttpStatus.OK,
            message: 'Projects found',
            data: await Promise.all(projects.map(async (project) => {
                return await this.toProjectResponse(project);
            })),
            paging: {
                currentPage: searchRequest.page,
                totalPage: Math.ceil(total / searchRequest.size),
                size: searchRequest.size,
                totalRows: total
            }
        };
    }
    async toProjectResponse(project) {
        const technologies = await this.prismaService.technology.findMany({
            where: {
                project_technology: {
                    some: {
                        project_id: project.id,
                    }
                }
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
                name: user.name
            },
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        };
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