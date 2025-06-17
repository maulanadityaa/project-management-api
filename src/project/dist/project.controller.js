"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ProjectController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var project_model_1 = require("../model/project.model");
var multer_1 = require("multer");
var auth_decorator_1 = require("../common/auth.decorator");
var swagger_1 = require("@nestjs/swagger");
var ProjectController = /** @class */ (function () {
    function ProjectController(projectService) {
        this.projectService = projectService;
    }
    ProjectController.prototype.create = function (token, request, image) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request.image = image;
                        return [4 /*yield*/, this.projectService.create(token, request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: 'Project created',
                                data: result
                            }];
                }
            });
        });
    };
    ProjectController.prototype.update = function (token, request, image) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request.image = image;
                        return [4 /*yield*/, this.projectService.update(token, request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: 'Project updated',
                                data: result
                            }];
                }
            });
        });
    };
    ProjectController.prototype.searchPerUser = function (token, name, techs, page, size) {
        if (page === void 0) { page = 1; }
        if (size === void 0) { size = 10; }
        return __awaiter(this, void 0, Promise, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            name: name,
                            techs: Array.isArray(techs) ? techs : techs === null || techs === void 0 ? void 0 : techs.split(','),
                            page: parseInt(String(page)) || 1,
                            size: parseInt(String(size)) || 10
                        };
                        return [4 /*yield*/, this.projectService.getProjectsPerUser(token, request)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectController.prototype.get = function (projectId) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectService.get(projectId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: 'Project found',
                                data: result
                            }];
                }
            });
        });
    };
    ProjectController.prototype.search = function (name, techs, page, size) {
        if (page === void 0) { page = 1; }
        if (size === void 0) { size = 10; }
        return __awaiter(this, void 0, Promise, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            name: name,
                            techs: Array.isArray(techs) ? techs : techs === null || techs === void 0 ? void 0 : techs.split(','),
                            page: parseInt(String(page)) || 1,
                            size: parseInt(String(size)) || 10
                        };
                        return [4 /*yield*/, this.projectService.search(request)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectController.prototype["delete"] = function (token, projectId) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectService["delete"](token, projectId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: 'Project deleted',
                                data: result
                            }];
                }
            });
        });
    };
    ProjectController.prototype.reactivate = function (token, projectId) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectService.reactivate(token, projectId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: 'Project reactivated',
                                data: result
                            }];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        })),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({
            summary: 'Create a new project',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.CREATED,
            description: 'Project created',
            type: project_model_1.ProjectResponse
        }),
        swagger_1.ApiConsumes('multipart/form-data'),
        swagger_1.ApiBody({
            type: project_model_1.ProjectRequest
        }),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Body()),
        __param(2, common_1.UploadedFile(new common_1.ParseFilePipe({
            validators: [
                new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
            ]
        })))
    ], ProjectController.prototype, "create");
    __decorate([
        common_1.Put(),
        common_1.HttpCode(common_1.HttpStatus.OK),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        })),
        swagger_1.ApiOperation({
            summary: 'Update a project',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.OK, description: 'Project updated' }),
        swagger_1.ApiConsumes('multipart/form-data'),
        swagger_1.ApiBody({
            type: project_model_1.ProjectUpdateRequest
        }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Body()),
        __param(2, common_1.UploadedFile(new common_1.ParseFilePipe({
            validators: [
                new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
            ],
            fileIsRequired: false
        })))
    ], ProjectController.prototype, "update");
    __decorate([
        common_1.Get('/search-per-user'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Search projects per user' }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.OK, description: 'Projects found' }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Query('name')),
        __param(2, common_1.Query('techs')),
        __param(3, common_1.Query('page')),
        __param(4, common_1.Query('size'))
    ], ProjectController.prototype, "searchPerUser");
    __decorate([
        common_1.Get('/:projectId'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Get a project' }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.OK, description: 'Project found' }),
        swagger_1.ApiParam({
            name: 'projectId',
            description: 'Project ID',
            example: 'ValidUUIDv4'
        }),
        __param(0, common_1.Param('projectId'))
    ], ProjectController.prototype, "get");
    __decorate([
        common_1.Get(),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Search projects' }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.OK, description: 'Projects found' }),
        swagger_1.ApiQuery({
            name: 'name',
            description: 'Project Name',
            example: 'Project Name',
            required: false
        }),
        swagger_1.ApiQuery({
            name: 'techs',
            description: 'Array of technologies',
            example: ['tech1', 'tech2'],
            required: false
        }),
        swagger_1.ApiQuery({
            name: 'page',
            description: 'Page number (optional) - default 1',
            example: 1,
            required: false
        }),
        swagger_1.ApiQuery({
            name: 'size',
            description: 'Page size (optional) - default 10',
            example: 10,
            required: false
        }),
        __param(0, common_1.Query('name')),
        __param(1, common_1.Query('techs')),
        __param(2, common_1.Query('page')),
        __param(3, common_1.Query('size'))
    ], ProjectController.prototype, "search");
    __decorate([
        common_1.Delete('/:projectId'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({
            summary: 'Delete a project',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Project delete',
            type: project_model_1.ProjectResponse
        }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Param('projectId'))
    ], ProjectController.prototype, "delete");
    __decorate([
        common_1.Patch('/:projectId/reactivate'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({
            summary: 'Reactivate a project',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Project reactivated',
            type: project_model_1.ProjectResponse
        }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Param('projectId'))
    ], ProjectController.prototype, "reactivate");
    ProjectController = __decorate([
        common_1.Controller('/api/v1/projects')
    ], ProjectController);
    return ProjectController;
}());
exports.ProjectController = ProjectController;
