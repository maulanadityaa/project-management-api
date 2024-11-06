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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const platform_express_1 = require("@nestjs/platform-express");
const project_model_1 = require("../model/project.model");
const multer_1 = require("multer");
const auth_decorator_1 = require("../common/auth.decorator");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async create(token, request, image) {
        console.log('Controller file:', {
            fieldname: image?.fieldname,
            originalname: image?.originalname,
            mimetype: image?.mimetype,
            size: image?.size,
            hasBuffer: !!image?.buffer
        });
        const projectData = {
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
        };
    }
    async update(token, request, image) {
        const projectData = {
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
        };
    }
    async get(projectId) {
        const result = await this.projectService.get(projectId);
        return {
            statusCode: 200,
            message: 'Project found',
            data: result
        };
    }
    async search(name, techs, page = 1, size = 10) {
        console.log('Searching projects:', { name, techs, page, size });
        const request = {
            name: name,
            techs: techs,
            page: parseInt(String(page)) || 1,
            size: parseInt(String(size)) || 10,
        };
        return await this.projectService.search(request);
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_model_1.ProjectRequest, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_model_1.ProjectUpdateRequest, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('techs')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "search", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('/api/v1/projects'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map