export declare class EmailAdapter {
    transporterSettings: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    sendEmailForConfirmation(email: string, code: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendEmailForPasswordRecovery(email: string, code: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
