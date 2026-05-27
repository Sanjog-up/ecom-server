import Mail from "nodemailer/lib/mailer";
import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

type IEmailOption = {
    to: string;
    subject: string;
    html: string;
    cc?: string | string[];
    bcc?: string | string[];
    attatchments?: any[]; 
};

export const sendEmail = async ({attatchments,html,subject,to,bcc,cc} : IEmailOption) => {
    try {
        const mailOptions: Mail.Options = {
            to: to,
               from: `Project Ecoomerce <${ENV_CONFIG.smtp_user}>`,
            subject: subject,
            html: html,
        };
        if(cc) {
            mailOptions["cc"] = cc;
        }
        if(bcc){
            mailOptions["bcc"]= bcc;
        }
        if(attatchments){
            mailOptions["attachments"]= attatchments;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    };
};