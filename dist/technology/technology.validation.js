"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnologyValidation = void 0;
const zod_1 = require("zod");
class TechnologyValidation {
}
exports.TechnologyValidation = TechnologyValidation;
TechnologyValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
});
TechnologyValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().min(1).max(255),
    name: zod_1.z.string().min(1).max(255),
});
//# sourceMappingURL=technology.validation.js.map