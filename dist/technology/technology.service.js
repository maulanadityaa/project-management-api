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
exports.TechnologyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const validation_service_1 = require("../common/validation.service");
const winston_1 = require("winston");
const nest_winston_1 = require("nest-winston");
const technology_validation_1 = require("./technology.validation");
let TechnologyService = class TechnologyService {
    constructor(prismaService, validationService, logger) {
        this.prismaService = prismaService;
        this.validationService = validationService;
        this.logger = logger;
    }
    async checkTechExists(techName) {
        const tech = await this.prismaService.technology.findFirst({
            where: {
                name: {
                    equals: techName,
                    mode: 'insensitive',
                },
            },
        });
        if (tech) {
            throw new common_1.HttpException('Technology already exists', 400);
        }
        return tech;
    }
    async checkTechMustExists(techId) {
        const tech = await this.prismaService.technology.findUnique({
            where: {
                id: techId,
            },
        });
        if (!tech) {
            throw new common_1.HttpException(`Technology with id: ${techId} not found`, 404);
        }
        return tech;
    }
    async create(request) {
        this.logger.debug(`Creating technology ${JSON.stringify(request)}`);
        const techRequest = this.validationService.validate(technology_validation_1.TechnologyValidation.CREATE, request);
        let technology = await this.checkTechExists(techRequest.name);
        technology = await this.prismaService.technology.create({
            data: techRequest,
        });
        return {
            id: technology.id,
            name: technology.name,
        };
    }
    async update(request) {
        this.logger.debug(`Updating technology ${JSON.stringify(request)}`);
        const techUpdateRequest = this.validationService.validate(technology_validation_1.TechnologyValidation.UPDATE, request);
        let technology = await this.checkTechMustExists(techUpdateRequest.id);
        technology = await this.prismaService.technology.update({
            where: {
                id: techUpdateRequest.id,
            },
            data: {
                name: techUpdateRequest.name,
            },
        });
        return {
            id: technology.id,
            name: technology.name,
        };
    }
    async delete(id) {
        this.logger.debug(`Deleting technology ${id}`);
        let technology = await this.checkTechMustExists(id);
        technology = await this.prismaService.technology.delete({
            where: {
                id,
            },
        });
        return {
            id: technology.id,
            name: technology.name,
        };
    }
    async get(id) {
        this.logger.debug(`Getting technology ${id}`);
        const technology = await this.checkTechMustExists(id);
        return {
            id: technology.id,
            name: technology.name,
        };
    }
    async getByName(name) {
        this.logger.debug(`Getting technology ${name}`);
        const technology = await this.prismaService.technology.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
        if (!technology) {
            throw new common_1.HttpException('Technology not found', 404);
        }
        return {
            id: technology.id,
            name: technology.name,
        };
    }
    async list() {
        this.logger.debug(`Listing technologies`);
        const technologies = await this.prismaService.technology.findMany();
        return technologies.map((technology) => ({
            id: technology.id,
            name: technology.name,
        }));
    }
};
exports.TechnologyService = TechnologyService;
exports.TechnologyService = TechnologyService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        validation_service_1.ValidationService,
        winston_1.Logger])
], TechnologyService);
//# sourceMappingURL=technology.service.js.map