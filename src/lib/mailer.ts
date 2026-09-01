// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
}

export function otpEmailTemplate(otp: string): string {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin: 0 0 16px;">Verify your email</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Use the code below to complete your registration:</p>
            <div style="background: #f1f5f9; border-radius: 10px; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a; margin: 16px 0;">
                ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
    `;
}
