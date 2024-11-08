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
exports.TechResponse = exports.TechUpdateRequest = exports.TechRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
class TechRequest {
}
exports.TechRequest = TechRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Technology Name', description: 'Technology Name' }),
    __metadata("design:type", String)
], TechRequest.prototype, "name", void 0);
class TechUpdateRequest {
}
exports.TechUpdateRequest = TechUpdateRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ValidUUIDv4', description: 'Technology ID' }),
    __metadata("design:type", String)
], TechUpdateRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated Technology Name', description: 'Technology Name (optional)' }),
    __metadata("design:type", String)
], TechUpdateRequest.prototype, "name", void 0);
class TechResponse {
}
exports.TechResponse = TechResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ValidUUIDv4', description: 'Technology ID' }),
    __metadata("design:type", String)
], TechResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Technology Name', description: 'Technology Name' }),
    __metadata("design:type", String)
], TechResponse.prototype, "name", void 0);
//# sourceMappingURL=technology.model.js.map