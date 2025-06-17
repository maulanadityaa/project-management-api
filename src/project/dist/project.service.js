"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ProjectService = void 0;
var common_1 = require("@nestjs/common");
var nest_winston_1 = require("nest-winston");
var project_validation_1 = require("./project.validation");
var moment_timezone_1 = require("moment-timezone");
var ProjectService = /** @class */ (function () {
    function ProjectService(prismaService, validationService, logger, cloudinaryService, technologyService, jwtService) {
        this.prismaService = prismaService;
        this.validationService = validationService;
        this.logger = logger;
        this.cloudinaryService = cloudinaryService;
        this.technologyService = technologyService;
        this.jwtService = jwtService;
        this.dateNow = moment_timezone_1["default"]().tz(process.env.APP_TIMEZONE).toDate();
    }
    ProjectService.prototype.create = function (token, request) {
        return __awaiter(this, void 0, Promise, function () {
            var createRequest, userId, user, techIds, _i, _a, techId, tech, image, project;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug("Creating project with data " + JSON.stringify(request.name));
                        console.log('DAteNOW', this.dateNow);
                        request.technologies = Array.isArray(request.technologies)
                            ? request.technologies
                            : request.technologies.split(',');
                        createRequest = this.validationService.validate(project_validation_1.ProjectValidation.CREATE, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userId = (_b.sent()).userId;
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 404);
                        }
                        techIds = [];
                        _i = 0, _a = createRequest.technologies;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        techId = _a[_i];
                        return [4 /*yield*/, this.technologyService.get(techId)];
                    case 4:
                        tech = _b.sent();
                        if (tech) {
                            techIds.push(tech.id);
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, this.cloudinaryService.uploadImage(createRequest.image)];
                    case 7:
                        image = _b.sent();
                        return [4 /*yield*/, this.prismaService.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, prisma.project.create({
                                            data: __assign({ name: createRequest.name, description: createRequest.description, link: createRequest.link, created_at: this.dateNow, updated_at: this.dateNow, project_image: {
                                                    create: {
                                                        url: image.secure_url
                                                    }
                                                }, project_technology: {
                                                    create: techIds.map(function (id) {
                                                        return {
                                                            technology_id: id
                                                        };
                                                    })
                                                } }, { user_id: user.id })
                                        })];
                                });
                            }); })];
                    case 8:
                        project = _b.sent();
                        return [4 /*yield*/, this.toProjectResponse(project)];
                    case 9: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ProjectService.prototype.checkProjectMustExist = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaService.project.findFirst({
                            where: {
                                id: id,
                                is_active: true
                            },
                            include: {
                                project_image: true,
                                project_technology: {
                                    include: {
                                        technology: true
                                    }
                                },
                                user: true
                            }
                        })];
                    case 1:
                        project = _a.sent();
                        if (!project) {
                            throw new common_1.HttpException('Project not found', 404);
                        }
                        return [2 /*return*/, project];
                }
            });
        });
    };
    ProjectService.prototype.get = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Getting project " + id);
                        return [4 /*yield*/, this.checkProjectMustExist(id)];
                    case 1:
                        project = _a.sent();
                        return [4 /*yield*/, this.toProjectResponse(project)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectService.prototype.update = function (token, request) {
        return __awaiter(this, void 0, Promise, function () {
            var updateRequest, userId, user, project, image, imageUrl, image_1, techIds, _i, _a, techId, tech, updatedProject;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug("Updating project with data " + JSON.stringify(request.name));
                        if (request.technologies) {
                            request.technologies = Array.isArray(request.technologies)
                                ? request.technologies
                                : request.technologies.split(',');
                        }
                        updateRequest = this.validationService.validate(project_validation_1.ProjectValidation.UPDATE, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userId = (_b.sent()).userId;
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 404);
                        }
                        return [4 /*yield*/, this.checkProjectMustExist(updateRequest.id)];
                    case 3:
                        project = _b.sent();
                        if (userId !== project.user_id) {
                            throw new common_1.HttpException('Unauthorized', 401);
                        }
                        return [4 /*yield*/, this.prismaService.projectImage.findFirst({
                                where: {
                                    project_id: project.id
                                }
                            })];
                    case 4:
                        image = _b.sent();
                        imageUrl = image.url;
                        if (!(updateRequest.image !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.cloudinaryService.uploadImage(request.image)];
                    case 5:
                        image_1 = _b.sent();
                        imageUrl = image_1.secure_url;
                        _b.label = 6;
                    case 6:
                        techIds = [];
                        if (!(updateRequest.technologies !== undefined)) return [3 /*break*/, 10];
                        _i = 0, _a = updateRequest.technologies;
                        _b.label = 7;
                    case 7:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        techId = _a[_i];
                        return [4 /*yield*/, this.technologyService.get(techId)];
                    case 8:
                        tech = _b.sent();
                        if (tech) {
                            techIds.push(tech.id);
                        }
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.prismaService.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(techIds.length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, prisma.projectTechnology.deleteMany({
                                                where: {
                                                    project_id: updateRequest.id
                                                }
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, prisma.projectTechnology.createMany({
                                                data: techIds.map(function (id) {
                                                    return {
                                                        technology_id: id,
                                                        project_id: updateRequest.id
                                                    };
                                                })
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        if (!(updateRequest.image !== undefined)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, prisma.projectImage.deleteMany({
                                                where: {
                                                    project_id: updateRequest.id
                                                }
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, prisma.projectImage.create({
                                                data: {
                                                    url: imageUrl,
                                                    project_id: updateRequest.id
                                                }
                                            })];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6: return [2 /*return*/, prisma.project.update({
                                            where: {
                                                id: updateRequest.id
                                            },
                                            data: {
                                                name: updateRequest.name,
                                                description: updateRequest.description,
                                                link: updateRequest.link,
                                                updated_at: this.dateNow
                                            }
                                        })];
                                }
                            });
                        }); })];
                    case 11:
                        updatedProject = _b.sent();
                        return [4 /*yield*/, this.toProjectResponse(updatedProject)];
                    case 12: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ProjectService.prototype.search = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var searchRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Searching project with data " + JSON.stringify(request));
                        searchRequest = this.validationService.validate(project_validation_1.ProjectValidation.SEARCH, request);
                        return [4 /*yield*/, this.searchProjects(searchRequest)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectService.prototype.searchProjects = function (searchRequest, userId) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var filters, techIds, _i, _c, techName, tech, skip, projects, total, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        filters = [];
                        if (userId) {
                            filters.push({
                                user_id: userId
                            });
                        }
                        if (searchRequest.name) {
                            filters.push({
                                name: {
                                    contains: searchRequest.name,
                                    mode: 'insensitive'
                                }
                            });
                        }
                        if (!(searchRequest.techs && searchRequest.techs.length > 0)) return [3 /*break*/, 5];
                        techIds = [];
                        _i = 0, _c = searchRequest.techs;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _c.length)) return [3 /*break*/, 4];
                        techName = _c[_i];
                        return [4 /*yield*/, this.technologyService.getByName(techName)];
                    case 2:
                        tech = _e.sent();
                        if (tech) {
                            techIds.push(tech.id);
                        }
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        filters.push({
                            project_technology: {
                                some: {
                                    technology_id: {
                                        "in": techIds
                                    }
                                }
                            }
                        });
                        _e.label = 5;
                    case 5:
                        skip = (searchRequest.page - 1) * searchRequest.size;
                        return [4 /*yield*/, this.prismaService.project.findMany({
                                where: {
                                    is_active: (_a = searchRequest.isActive) !== null && _a !== void 0 ? _a : true,
                                    AND: filters
                                },
                                orderBy: {
                                    updated_at: 'desc'
                                },
                                include: {
                                    project_image: true,
                                    project_technology: {
                                        include: {
                                            technology: true
                                        }
                                    },
                                    user: true
                                },
                                take: searchRequest.size,
                                skip: skip
                            })];
                    case 6:
                        projects = _e.sent();
                        return [4 /*yield*/, this.prismaService.project.count({
                                where: {
                                    is_active: (_b = searchRequest.isActive) !== null && _b !== void 0 ? _b : true,
                                    AND: filters
                                }
                            })];
                    case 7:
                        total = _e.sent();
                        _d = {
                            statusCode: common_1.HttpStatus.OK,
                            message: 'Projects found'
                        };
                        return [4 /*yield*/, Promise.all(projects.map(function (project) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.toProjectResponse(project)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 8: return [2 /*return*/, (_d.data = _e.sent(),
                            _d.paging = {
                                currentPage: searchRequest.page,
                                totalPage: Math.ceil(total / searchRequest.size),
                                size: searchRequest.size,
                                totalRows: total
                            },
                            _d)];
                }
            });
        });
    };
    ProjectService.prototype.getProjectsPerUser = function (token, request) {
        return __awaiter(this, void 0, Promise, function () {
            var searchRequest, userId, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Search projects per current user");
                        searchRequest = this.validationService.validate(project_validation_1.ProjectValidation.SEARCH, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userId = (_a.sent()).userId;
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 404);
                        }
                        return [4 /*yield*/, this.searchProjects(searchRequest, userId)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectService.prototype.toProjectResponse = function (project) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var technologies, image, imageUrl, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prismaService.technology.findMany({
                            where: {
                                project_technology: {
                                    some: {
                                        project_id: project.id
                                    }
                                }
                            }
                        })];
                    case 1:
                        technologies = _b.sent();
                        return [4 /*yield*/, this.prismaService.projectImage.findFirst({
                                where: {
                                    project_id: project.id
                                }
                            })];
                    case 2:
                        image = _b.sent();
                        imageUrl = (_a = image === null || image === void 0 ? void 0 : image.url) !== null && _a !== void 0 ? _a : 'https://placehold.co/600x400';
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: project.user_id
                                }
                            })];
                    case 3:
                        user = _b.sent();
                        return [2 /*return*/, {
                                id: project.id,
                                name: project.name,
                                description: project.description,
                                link: project.link,
                                technologies: technologies.map(function (technology) { return technology.name; }),
                                imageUrl: imageUrl,
                                userResponse: {
                                    uid: user.id,
                                    email: user.email,
                                    username: user.username,
                                    name: user.name
                                },
                                createdAt: project.created_at,
                                updatedAt: project.updated_at
                            }];
                }
            });
        });
    };
    ProjectService.prototype["delete"] = function (token, id) {
        return __awaiter(this, void 0, Promise, function () {
            var userId, user, project, deletedProject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Deleting project " + id);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userId = (_a.sent()).userId;
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 404);
                        }
                        return [4 /*yield*/, this.checkProjectMustExist(id)];
                    case 3:
                        project = _a.sent();
                        if (userId !== project.user_id) {
                            throw new common_1.HttpException('Unauthorized', 401);
                        }
                        return [4 /*yield*/, this.prismaService.project.update({
                                where: {
                                    id: id
                                },
                                data: {
                                    is_active: false,
                                    updated_at: this.dateNow
                                }
                            })];
                    case 4:
                        deletedProject = _a.sent();
                        return [4 /*yield*/, this.toProjectResponse(deletedProject)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectService.prototype.reactivate = function (token, id) {
        return __awaiter(this, void 0, Promise, function () {
            var userId, user, project, reactivatedProject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Reactivating project " + id);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userId = (_a.sent()).userId;
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 404);
                        }
                        return [4 /*yield*/, this.checkProjectMustExist(id)];
                    case 3:
                        project = _a.sent();
                        if (userId !== project.user_id) {
                            throw new common_1.HttpException('Unauthorized', 401);
                        }
                        return [4 /*yield*/, this.prismaService.project.update({
                                where: {
                                    id: id
                                },
                                data: {
                                    is_active: true,
                                    updated_at: this.dateNow
                                }
                            })];
                    case 4:
                        reactivatedProject = _a.sent();
                        return [4 /*yield*/, this.toProjectResponse(reactivatedProject)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER))
    ], ProjectService);
    return ProjectService;
}());
exports.ProjectService = ProjectService;
