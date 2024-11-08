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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResponse = exports.ProjectSearchRequest = exports.ProjectUpdateRequest = exports.ProjectRequest = void 0;
const auth_model_1 = require("./auth.model");
const swagger_1 = require("@nestjs/swagger");
class ProjectRequest {
}
exports.ProjectRequest = ProjectRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Name', description: 'Project Name' }),
    __metadata("design:type", String)
], ProjectRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Description', description: 'Project Description' }),
    __metadata("design:type", String)
], ProjectRequest.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['tech1', 'tech2'], description: 'Array of technologies', type: 'array', items: { type: 'string' } }),
    __metadata("design:type", Object)
], ProjectRequest.prototype, "technologies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image.jpg', description: 'Project Image', type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], ProjectRequest.prototype, "image", void 0);
class ProjectUpdateRequest {
}
exports.ProjectUpdateRequest = ProjectUpdateRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ValidUUIDv4', description: 'Project ID' }),
    __metadata("design:type", String)
], ProjectUpdateRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Project Name', description: 'Project Name (optional)' }),
    __metadata("design:type", String)
], ProjectUpdateRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Project Description', description: 'Project Description (optional)' }),
    __metadata("design:type", String)
], ProjectUpdateRequest.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['tech1', 'tech2'], description: 'Array of technologies (optional)', type: 'array', items: { type: 'string' } }),
    __metadata("design:type", Object)
], ProjectUpdateRequest.prototype, "technologies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'image.jpg', description: 'Project Image (optional)', type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], ProjectUpdateRequest.prototype, "image", void 0);
class ProjectSearchRequest {
}
exports.ProjectSearchRequest = ProjectSearchRequest;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Project Name', description: 'Project Name' }),
    __metadata("design:type", String)
], ProjectSearchRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['tech1', 'tech2'], description: 'Array of technologies (optional)', type: 'array', items: { type: 'string' } }),
    __metadata("design:type", Object)
], ProjectSearchRequest.prototype, "techs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Page number (optional) - default 1' }),
    __metadata("design:type", Number)
], ProjectSearchRequest.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Page size (optional) - default 10' }),
    __metadata("design:type", Number)
], ProjectSearchRequest.prototype, "size", void 0);
class ProjectResponse {
}
exports.ProjectResponse = ProjectResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ValidUUIDv4', description: 'Project ID' }),
    __metadata("design:type", String)
], ProjectResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Name', description: 'Project Name' }),
    __metadata("design:type", String)
], ProjectResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Description', description: 'Project Description' }),
    __metadata("design:type", String)
], ProjectResponse.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['tech1', 'tech2'], description: 'Array of technologies' }),
    __metadata("design:type", Array)
], ProjectResponse.prototype, "technologies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cloudinary-secure-url', description: 'Project Image' }),
    __metadata("design:type", String)
], ProjectResponse.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: auth_model_1.UserResponse, description: 'User' }),
    __metadata("design:type", auth_model_1.UserResponse)
], ProjectResponse.prototype, "userResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2021-01-01T00:00:00.000Z', description: 'Created At' }),
    __metadata("design:type", Date)
], ProjectResponse.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2021-01-01T00:00:00.000Z', description: 'Updated At' }),
    __metadata("design:type", Date)
], ProjectResponse.prototype, "updatedAt", void 0);
//# sourceMappingURL=project.model.js.map