"use strict";
exports.__esModule = true;
exports.Auth = void 0;
var common_1 = require("@nestjs/common");
exports.Auth = common_1.createParamDecorator(function (data, context) {
    var request = context.switchToHttp().getRequest();
    var authorization = request.headers['authorization'] || '';
    var token = authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : authorization;
    if (token) {
        return token;
    }
    else {
        throw new common_1.HttpException('Unauthorized', 401);
    }
});
