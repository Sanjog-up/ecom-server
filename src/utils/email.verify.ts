export const generateVerificationEmailHtml = (
  user: { full_name: string },
  verifyUrl: string
) => {
  return `
  <!DOCTYPE html>
  <html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f4f4;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#4facfe,#00f2fe);padding:30px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;">Verify your email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;color:#333;">
              <h2 style="margin-top:0;">Hello ${user.full_name},</h2>
              <p style="font-size:15px;line-height:1.6;">
                Thanks for signing up. Confirm your email to unlock checkout and orders.
              </p>
              <div style="text-align:center;margin-top:30px;">
                <a href="${verifyUrl}" style="background:#4facfe;color:#fff;text-decoration:none;padding:12px 25px;border-radius:6px;display:inline-block;font-weight:bold;">
                  Verify Email
                </a>
              </div>
              <p style="margin-top:20px;font-size:13px;color:#888;">This link expires in 24 hours.</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding:15px;font-size:12px;color:#888;background:#f8f8f8;">
              © ${new Date().getFullYear()} Grey Matter. All rights reserved.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
};