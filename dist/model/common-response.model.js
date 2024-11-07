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
exports.CommonResponse = exports.Paging = void 0;
const swagger_1 = require("@nestjs/swagger");
class Paging {
}
exports.Paging = Paging;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Page size' }),
    __metadata("design:type", Number)
], Paging.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Page number' }),
    __metadata("design:type", Number)
], Paging.prototype, "totalPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Current page' }),
    __metadata("design:type", Number)
], Paging.prototype, "currentPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Total rows' }),
    __metadata("design:type", Number)
], Paging.prototype, "totalRows", void 0);
class CommonResponse {
}
exports.CommonResponse = CommonResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, description: 'Status code' }),
    __metadata("design:type", Number)
], CommonResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Success', description: 'Status message' }),
    __metadata("design:type", String)
], CommonResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'Data response' }),
    __metadata("design:type", Object)
], CommonResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Error message', description: 'Error message' }),
    __metadata("design:type", String)
], CommonResponse.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'Paging information' }),
    __metadata("design:type", Paging)
], CommonResponse.prototype, "paging", void 0);
//# sourceMappingURL=common-response.model.js.map