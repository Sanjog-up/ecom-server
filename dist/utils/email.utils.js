"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoginSuccessEmailHtml = void 0;
const generateLoginSuccessEmailHtml = (req, user) => {
    const ip = req.headers["x-forwarded-for"]?.toString() ||
        req.socket.remoteAddress ||
        "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Login Successful</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0; background:#f4f4f4;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0"
            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#4facfe,#00f2fe); padding:30px; text-align:center;">
                <h1 style="margin:0; color:#fff; font-size:26px;">
                  Login Successful
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px; color:#333;">

                <h2 style="margin-top:0;">
                  Hello ${user.full_name},
                </h2>

                <p style="font-size:15px; line-height:1.6;">
                  We detected a successful login to your account.
                </p>

                <table width="100%" cellpadding="10" cellspacing="0"
                  style="background:#f9f9f9; border-radius:8px; margin-top:20px; font-size:14px;">

                  <tr>
                    <td><strong>Email</strong></td>
                    <td>${user.email}</td>
                  </tr>

                  <tr>
                    <td><strong>User ID</strong></td>
                    <td>${user._id}</td>
                  </tr>

                  <tr>
                    <td><strong>IP Address</strong></td>
                    <td>${ip}</td>
                  </tr>

                  <tr>
                    <td><strong>Device</strong></td>
                    <td>${userAgent}</td>
                  </tr>

                </table>

                <p style="margin-top:20px; font-size:14px; color:#555; line-height:1.6;">
                  If this was you, you can safely ignore this email.
                  If you do not recognize this login, we strongly recommend changing your password immediately.
                </p>

                <div style="text-align:center; margin-top:30px;">
                  <a href="#"
                    style="background:#4facfe; color:#fff; text-decoration:none; padding:12px 25px;
                    border-radius:6px; display:inline-block; font-weight:bold;">
                    Secure Account
                  </a>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="text-align:center; padding:15px; font-size:12px; color:#888; background:#f8f8f8;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
    return html;
};
exports.generateLoginSuccessEmailHtml = generateLoginSuccessEmailHtml;
