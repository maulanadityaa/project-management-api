"use strict";
exports.__esModule = true;
exports.MailValidation = void 0;
var zod_1 = require("zod");
var MailValidation = /** @class */ (function () {
    function MailValidation() {
    }
    MailValidation.SEND = zod_1.z.object({
        to: zod_1.z.string().email(),
        subject: zod_1.z.string().min(1).max(255),
        text: zod_1.z.string().min(1).max(1000),
        html: zod_1.z.string().min(1).max(1000).optional()
    });
    MailValidation.SIGNUP_CONFIRMATION = zod_1.z.object({
        to: zod_1.z.string().email(),
        token: zod_1.z.string(),
        username: zod_1.z.string().min(1).max(255),
        link: zod_1.z.string().url()
    });
    MailValidation.PASSWORD_RESET = zod_1.z.object({
        to: zod_1.z.string().email(),
        token: zod_1.z.string(),
        username: zod_1.z.string().min(1).max(255),
        link: zod_1.z.string().url()
    });
    return MailValidation;
}());
exports.MailValidation = MailValidation;
