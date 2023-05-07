"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAdapter = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailAdapter = class EmailAdapter {
    constructor() {
        this.transporterSettings = {
            host: 'smtp.mail.ru',
            port: 587,
            secure: false,
            auth: {
                user: 'd.diubajlo@mail.ru',
                pass: process.env.MAIL_PASS,
            },
        };
    }
    async sendEmailForConfirmation(email, code) {
        const transporter = nodemailer.createTransport(this.transporterSettings);
        console.log(this.transporterSettings);
        return await transporter.sendMail({
            from: 'd.diubajlo@mail.ru',
            to: email,
            subject: 'Successful registration',
            html: '<h1>Thank for your registration</h1>\n' +
                '       <p>To finish registration please follow the link below:\n' +
                `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
                '      </p>',
        });
    }
    async sendEmailForPasswordRecovery(email, code) {
        const transporter = nodemailer.createTransport(this.transporterSettings);
        return await transporter.sendMail({
            from: 'd.diubajlo@mail.ru',
            to: email,
            subject: 'Password recovery',
            html: '<h1>Password recovery</h1>\n' +
                '       <p>To finish password recovery please follow the link below:\n' +
                `          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>\n` +
                '      </p>',
        });
    }
};
EmailAdapter = __decorate([
    (0, common_1.Injectable)()
], EmailAdapter);
exports.EmailAdapter = EmailAdapter;
//# sourceMappingURL=email.adapter.js.map