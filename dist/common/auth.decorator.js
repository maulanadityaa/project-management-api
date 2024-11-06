"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
exports.Auth = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'] || '';
    const token = authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : authorization;
    if (token) {
        return token;
    }
    else {
        throw new common_1.HttpException('Unauthorized', 401);
    }
});
//# sourceMappingURL=auth.decorator.js.map