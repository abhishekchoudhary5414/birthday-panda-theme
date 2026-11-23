export interface InvitationTemplateData {
  guestName: string;
  birthdayPersonName: string;
  birthdayDate: string;
  birthdayTime: string;
  birthdayLocation: string;
  birthdayWebsiteUrl: string;
  hostName: string;
  customMessage?: string;
}

/**
 * Replace dynamic template placeholders
 */
export function renderTemplateText(template: string, data: InvitationTemplateData): string {
  return template
    .replace(/\{\{guest_name\}\}/gi, data.guestName)
    .replace(/\{\{birthday_person_name\}\}/gi, data.birthdayPersonName)
    .replace(/\{\{birthday_date\}\}/gi, data.birthdayDate)
    .replace(/\{\{birthday_time\}\}/gi, data.birthdayTime)
    .replace(/\{\{birthday_location\}\}/gi, data.birthdayLocation)
    .replace(/\{\{birthday_website_url\}\}/gi, data.birthdayWebsiteUrl)
    .replace(/\{\{host_name\}\}/gi, data.hostName);
}

/**
 * Generate Modern, Responsive HTML Email
 */
export function generateInvitationHtml(data: InvitationTemplateData): string {
  const customMsg = data.customMessage || "We would love to invite you to celebrate this magical milestone with us! Join us for a joyful day filled with laughter, delicious treats, games, and warm family moments.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited to ${data.birthdayPersonName}'s Birthday!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAF7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D3A30;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8FAF7;
      padding: 40px 0;
    }
    .main {
      background-color: #FFFFFF;
      margin: 0 auto;
      max-width: 600px;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #E1ECE0;
      box-shadow: 0 10px 30px rgba(41, 75, 53, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #1B3824 0%, #294B35 60%, #437351 100%);
      padding: 40px 30px;
      text-align: center;
      color: #FFFFFF;
    }
    .header-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 5px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      color: #F5FAF3;
    }
    .header-title {
      font-size: 28px;
      font-weight: 800;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #1B3824;
      margin-bottom: 14px;
    }
    .message {
      font-size: 15px;
      line-height: 1.65;
      color: #4D5E51;
      margin-bottom: 26px;
    }
    .event-card {
      background-color: #F7FAF5;
      border: 1px solid #DFEDE0;
      border-radius: 16px;
      padding: 22px;
      margin-bottom: 30px;
    }
    .event-row {
      display: flex;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .event-label {
      width: 90px;
      font-weight: 700;
      color: #294B35;
    }
    .event-value {
      flex: 1;
      color: #334437;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 20px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #294B35 0%, #3e6b4d 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 34px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(41, 75, 53, 0.25);
    }
    .footer {
      background-color: #FAFDF9;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #EAF2E8;
      font-size: 13px;
      color: #7A8E7E;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <div class="main">
            <!-- Header -->
            <div class="header">
              <div class="header-badge">🎋 You're Invited!</div>
              <div style="font-size: 42px; line-height: 1; margin-bottom: 10px;">🐼🎂</div>
              <h1 class="header-title">${data.birthdayPersonName}'s Birthday Party</h1>
              <p style="margin: 0; font-size: 15px; color: #D5E5D1;">A celebration of smiles, laughter, and special memories</p>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">Hi ${data.guestName},</div>
              <div class="message">${customMsg}</div>

              <!-- Event Details Card -->
              <div class="event-card">
                <table width="100%" border="0" cellspacing="0" cellpadding="6">
                  <tr>
                    <td width="90" style="font-weight: bold; color: #294B35; font-size: 14px;">📅 Date:</td>
                    <td style="color: #334437; font-size: 14px; font-weight: 600;">${data.birthdayDate}</td>
                  </tr>
                  <tr>
                    <td width="90" style="font-weight: bold; color: #294B35; font-size: 14px;">⏰ Time:</td>
                    <td style="color: #334437; font-size: 14px;">${data.birthdayTime}</td>
                  </tr>
                  <tr>
                    <td width="90" style="font-weight: bold; color: #294B35; font-size: 14px;">📍 Location:</td>
                    <td style="color: #334437; font-size: 14px;">${data.birthdayLocation}</td>
                  </tr>
                </table>
              </div>

              <!-- Call to Action Button -->
              <div class="btn-container">
                <a href="${data.birthdayWebsiteUrl}" target="_blank" rel="noopener noreferrer" class="btn">
                  View Website &amp; RSVP Online 🌿
                </a>
              </div>

              <p style="text-align: center; font-size: 13px; color: #6E7E73; margin: 16px 0 0;">
                Click above to explore photos, browse party games, send a wish, and confirm your RSVP!
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 6px; font-weight: 600; color: #294B35;">Warm wishes,</p>
              <p style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #1B3824;">${data.hostName}</p>
              <p style="margin: 0; font-size: 12px; color: #9AB0A0;">
                Sent with love from the Birthday Celebration Website Platform &bull; <a href="${data.birthdayWebsiteUrl}" style="color: #294B35;">Visit Website</a>
              </p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

/**
 * Generate Plain-Text Fallback
 */
export function generateInvitationPlainText(data: InvitationTemplateData): string {
  const customMsg = data.customMessage || "We would love to invite you to celebrate this magical milestone with us! Join us for a joyful day filled with laughter, delicious treats, games, and warm family moments.";

  return `You're Invited to ${data.birthdayPersonName}'s Birthday Party! 🎂

Hi ${data.guestName},

${customMsg}

Event Details:
- Date: ${data.birthdayDate}
- Time: ${data.birthdayTime}
- Location: ${data.birthdayLocation}

Visit our invitation website to RSVP, view photos, and share wishes:
${data.birthdayWebsiteUrl}

We hope you can join us and make this day truly special!

Warm wishes,
${data.hostName}
`;
}
