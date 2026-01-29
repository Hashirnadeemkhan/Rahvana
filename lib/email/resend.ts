// lib/email/resend.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Rahvana <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export function getEmailConfirmationHtml(confirmLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td>
            <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Logo/Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">A</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #0f172a;">Welcome to Arachnie!</h1>
              </div>

              <!-- Content -->
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                Thank you for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmLink}" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px;">
                  Confirm Email
                </a>
              </div>

              <!-- Link fallback -->
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 20px; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 20px; color: #3b82f6; word-break: break-all;">
                ${confirmLink}
              </p>

              <!-- Expiry notice -->
              <div style="background-color: #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  ⏰ This link will expire in 24 hours.
                </p>
              </div>

              <!-- Footer -->
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #94a3b8;">
                If you didn't create an account with Arachnie, you can safely ignore this email.
              </p>
            </div>

            <!-- Footer branding -->
            <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Arachnie. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td>
            <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Logo/Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #334155 0%, #0f172a 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">A</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #0f172a;">Reset Your Password</h1>
              </div>
              
              <!-- Content -->
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              
              <!-- Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px;">
                  Reset Password
                </a>
              </div>
              
              <!-- Link fallback -->
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 20px; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 20px; color: #3b82f6; word-break: break-all;">
                ${resetLink}
              </p>
              
              <!-- Expiry notice -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  ⏰ This link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <!-- Footer -->
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #94a3b8;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <!-- Footer branding -->
            <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Arachnie. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getMFAEnabledEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Two-Factor Authentication Enabled</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td>
            <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Logo/Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">✓</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #0f172a;">2FA Enabled Successfully</h1>
              </div>
              
              <!-- Content -->
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                Great news! Two-factor authentication has been successfully enabled on your account.
              </p>
              
              <div style="background-color: #dcfce7; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 500;">
                  🔒 Your account is now more secure with an additional layer of protection.
                </p>
              </div>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                From now on, you'll need to enter a verification code from your authenticator app when signing in.
              </p>
              
              <!-- Security tips -->
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #0f172a;">Security Tips:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569;">
                  <li style="margin-bottom: 8px;">Keep your authenticator app secure</li>
                  <li style="margin-bottom: 8px;">Don't share your verification codes</li>
                  <li style="margin-bottom: 0;">Consider backing up your recovery codes</li>
                </ul>
              </div>
              
              <!-- Footer -->
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #94a3b8;">
                If you didn't enable two-factor authentication, please contact our support team immediately.
              </p>
            </div>
            
            <!-- Footer branding -->
            <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Arachnie. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function getMFADisabledEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Two-Factor Authentication Disabled</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td>
            <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Logo/Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">!</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #0f172a;">2FA Disabled</h1>
              </div>
              
              <!-- Content -->
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                Two-factor authentication has been disabled on your account.
              </p>
              
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 500;">
                  ⚠️ Your account security has been reduced. Consider re-enabling 2FA for better protection.
                </p>
              </div>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                You will no longer be required to enter a verification code when signing in.
              </p>
              
              <!-- Security warning -->
              <div style="background-color: #fee2e2; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #991b1b;">Security Notice:</h3>
                <p style="margin: 0; font-size: 14px; color: #b91c1c;">
                  If you didn't disable two-factor authentication, your account may have been compromised. Please enable 2FA again and change your password.
                </p>
              </div>
              
              <!-- Re-enable CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mfa-setup" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px;">
                  Re-enable 2FA
                </a>
              </div>
              
              <!-- Footer -->
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #94a3b8;">
                If you have any questions about this change, please contact our support team.
              </p>
            </div>
            
            <!-- Footer branding -->
            <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Arachnie. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
