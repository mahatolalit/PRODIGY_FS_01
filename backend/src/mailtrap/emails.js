import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
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

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email", error);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",

        });
        console.log("Password reset success email sent successfully");
        
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email", error);
    }
}