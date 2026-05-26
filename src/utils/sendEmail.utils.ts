import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";


export const sendEmail = async () => {
    try {
        await transporter.sendMail({
            to: "vuntuaale92@gmail.com",
            from: `Project Ecoomerce <${ENV_CONFIG.smtp_user}>`,
            subject: "welcom to ecom",
            text: "login successful. Welcome to ecom",
        })
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};