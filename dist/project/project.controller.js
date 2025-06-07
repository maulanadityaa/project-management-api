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
const swagger_1 = require("@nestjs/swagger");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async create(token, request, image) {
        request.image = image;
        const result = await this.projectService.create(token, request);
        return {
            statusCode: 201,
            message: 'Project created',
            data: result,
        };
    }
    async update(token, request, image) {
        request.image = image;
        const result = await this.projectService.update(token, request);
        return {
            statusCode: 200,
            message: 'Project updated',
            data: result,
        };
    }
    async searchPerUser(token, name, techs, page = 1, size = 10) {
        const request = {
            name: name,
            techs: Array.isArray(techs) ? techs : techs?.split(','),
            page: parseInt(String(page)) || 1,
            size: parseInt(String(size)) || 10,
        };
        return await this.projectService.getProjectsPerUser(token, request);
    }
    async get(projectId) {
        const result = await this.projectService.get(projectId);
        return {
            statusCode: 200,
            message: 'Project found',
            data: result,
        };
    }
    async search(name, techs, page = 1, size = 10) {
        const request = {
            name: name,
            techs: Array.isArray(techs) ? techs : techs?.split(','),
            page: parseInt(String(page)) || 1,
            size: parseInt(String(size)) || 10,
        };
        return await this.projectService.search(request);
    }
    async delete(token, projectId) {
        const result = await this.projectService.delete(token, projectId);
        return {
            statusCode: 200,
            message: 'Project deleted',
            data: result,
        };
    }
    async reactivate(token, projectId) {
        const result = await this.projectService.reactivate(token, projectId);
        return {
            statusCode: 200,
            message: 'Project reactivated',
            data: result,
        };
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new project',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Project created',
        type: project_model_1.ProjectResponse,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        type: project_model_1.ProjectRequest,
    }),
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
    (0, swagger_1.ApiOperation)({
        summary: 'Update a project',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Project updated' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        type: project_model_1.ProjectUpdateRequest,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_model_1.ProjectUpdateRequest, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/search-per-user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Search projects per user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Projects found' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('techs')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "searchPerUser", null);
__decorate([
    (0, common_1.Get)('/:projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get a project' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Project found' }),
    (0, swagger_1.ApiParam)({
        name: 'projectId',
        description: 'Project ID',
        example: 'ValidUUIDv4',
    }),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Search projects' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Projects found' }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        description: 'Project Name',
        example: 'Project Name',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'techs',
        description: 'Array of technologies',
        example: ['tech1', 'tech2'],
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: 'Page number (optional) - default 1',
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'size',
        description: 'Page size (optional) - default 10',
        example: 10,
        required: false,
    }),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('techs')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "search", null);
__decorate([
    (0, common_1.Delete)('/:projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a project',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Project delete',
        type: Boolean,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)('/:projectId/reactivate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reactivate a project',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Project reactivated',
        type: project_model_1.ProjectResponse,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "reactivate", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('/api/v1/projects'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map