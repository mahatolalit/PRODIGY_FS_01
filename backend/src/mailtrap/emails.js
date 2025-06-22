import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"
import "dotenv/config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email", error);
    }

}

export const sendWelcomeEmail = async (email, fullName) => {
    const recipient = [{email}]

    try {

        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: process.env.WELCOME_EMAIL_TEMPLATE_UUID,
            template_variables: {
                "company_info_name": "Authify Labs",
                "name": fullName,
            },
        });
        console.log("Welcome email sent successfully");
        
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email", error);
    }
}