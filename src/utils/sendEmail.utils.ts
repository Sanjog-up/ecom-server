import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

type IEmailOption = {
    to: string;
    subject: string;
    html: string;
    cc?: string | string[];
    bcc?: string | string[];
    attatchments: any[]; 
};

export const sendEmail = async (options: IEmailOption) => {
    try {
        await transporter.sendMail({
            to: "vuntuaale92@gmail.com",
            from: `Project Ecoomerce <${ENV_CONFIG.smtp_user}>`,
            subject: "welcom to ecom",
            // text: "login successful. Welcome to ecom",
            html : ``,
        })
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    };
};