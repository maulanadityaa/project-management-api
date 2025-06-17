"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SwaggerService = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var node_process_1 = require("node:process");
var SwaggerService = /** @class */ (function () {
    function SwaggerService() {
    }
    SwaggerService.prototype.setupSwagger = function (app) {
        var config = new swagger_1.DocumentBuilder()
            .setTitle(node_process_1["default"].env.APP_NAME)
            .setDescription(node_process_1["default"].env.APP_DESCRIPTION)
            .setVersion(node_process_1["default"].env.APP_VERSION)
            .setContact(node_process_1["default"].env.APP_AUTHOR_NAME, node_process_1["default"].env.APP_AUTHOR_URL, node_process_1["default"].env.APP_AUTHOR_EMAIL)
            .addBearerAuth()
            .addServer(node_process_1["default"].env.APP_LOCAL_URL)
            .addServer(node_process_1["default"].env.APP_PROD_URL)
            .build();
        var document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true
            },
            customSiteTitle: 'Project Management API Documentation',
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
            ],
            customCssUrl: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
            ]
        });
    };
    SwaggerService = __decorate([
        common_1.Injectable()
    ], SwaggerService);
    return SwaggerService;
}());
exports.SwaggerService = SwaggerService;
