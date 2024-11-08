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
exports.TechnologyController = void 0;
const common_1 = require("@nestjs/common");
const technology_service_1 = require("./technology.service");
const technology_model_1 = require("../model/technology.model");
const swagger_1 = require("@nestjs/swagger");
let TechnologyController = class TechnologyController {
    constructor(technologyService) {
        this.technologyService = technologyService;
    }
    async create(request) {
        const result = await this.technologyService.create(request);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Technology created',
            data: result,
        };
    }
    async update(request) {
        const result = await this.technologyService.update(request);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Technology updated',
            data: result,
        };
    }
    async get(techId) {
        const result = await this.technologyService.get(techId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Technology retrieved',
            data: result,
        };
    }
    async list() {
        const result = await this.technologyService.list();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Technology retrieved',
            data: result,
        };
    }
    async delete(techId) {
        await this.technologyService.delete(techId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Technology deleted',
            data: true,
        };
    }
};
exports.TechnologyController = TechnologyController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new technology',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Technology created',
        type: technology_model_1.TechResponse,
    }),
    (0, swagger_1.ApiBody)({ type: technology_model_1.TechRequest }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [technology_model_1.TechRequest]),
    __metadata("design:returntype", Promise)
], TechnologyController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a technology',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Technology updated',
        type: technology_model_1.TechResponse,
    }),
    (0, swagger_1.ApiBody)({ type: technology_model_1.TechUpdateRequest }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [technology_model_1.TechUpdateRequest]),
    __metadata("design:returntype", Promise)
], TechnologyController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:techId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get a technology' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Technology retrieved',
        type: technology_model_1.TechResponse,
    }),
    (0, swagger_1.ApiParam)({ name: 'techId', type: String, example: 'ValidUUIDv4' }),
    __param(0, (0, common_1.Param)('techId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechnologyController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'List all technologies' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Technologies retrieved',
        type: technology_model_1.TechResponse,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TechnologyController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)('/:techId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a technology',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Technology deleted',
        type: Boolean,
    }),
    (0, swagger_1.ApiParam)({ name: 'techId', type: String, example: 'ValidUUIDv4' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('techId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechnologyController.prototype, "delete", null);
exports.TechnologyController = TechnologyController = __decorate([
    (0, common_1.Controller)('/api/v1/technologies'),
    __metadata("design:paramtypes", [technology_service_1.TechnologyService])
], TechnologyController);
//# sourceMappingURL=technology.controller.js.map