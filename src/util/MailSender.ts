const environment = process.env.NODE_ENV;
const url = process.env.FRONT_URL;
import * as nodemailer from 'nodemailer';
const config = require('../config');
const pjson = require('../../package.json');

export class MailSender {

    private static transporter: nodemailer.Transporter;

    private static getTransporter() {

        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                //host : config.email.host,
                //port : config.email.port,
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.email.pass
                }
            })
        }
        return this.transporter;
    }

    public static sendPassRecoveryEmail(to: string, token: string): Promise<string> {
        let subject = `${pjson.name} - Trocar Senha`;
        let text = `Para trocar sua senha clique em: <a href="${url}/#/reset/${token}">${url}/#/reset/${token}</a>`;
        return this.sendEmail(to, subject, text);
    }

    public static sendPasswordResetConfirm(to: string): Promise<string> {
        let subject = `${pjson.name} - Senha Trocada`;
        let text = "Sua senha foi trocada com sucesso";
        return this.sendEmail(to, subject, text);
    }

    public static sendEmail(to: string, subject: string, text: string): Promise<string> {
        let options = {
            from: config.email.from,
            to: to,
            subject: subject,
            html: text
        }
        return this.send(options);
    }

    private static send(mailOptions: nodemailer.SendMailOptions): Promise<string> {

        if(environment === 'development') {
            return Promise.resolve("");
        }

        return new Promise((resolve, reject) => {
            this.getTransporter().sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.response);
                }
            })
        })
    }
}