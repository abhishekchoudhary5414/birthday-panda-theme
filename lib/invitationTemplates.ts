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
 * Replace dynamic template placeholders safely
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
 * Clean, Elegant, High-Deliverability HTML Email Template
 * Specifically crafted to maximize inbox placement:
 * - Natural text-to-code ratio
 * - No promotional spam keywords, spammy emojis or all-caps
 * - Single unambiguous primary link to invitation website
 * - Fully mobile-responsive, compatible with Gmail web & mobile apps
 * - Clean panda & bamboo color scheme (#1B3824, #294B35, #F4F7F2)
 */
export function generateInvitationHtml(data: InvitationTemplateData): string {
  const customMsg = data.customMessage || "We would love for you to celebrate this special milestone with us! Join us for a joyful gathering with family, friends, and delicious birthday cake.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Birthday Invitation: Celebrate with ${data.birthdayPersonName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAF7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D3A30;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      background-color: #F8FAF7;
      padding: 32px 12px;
    }
    .card {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2EDE0;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(41, 75, 53, 0.05);
    }
    .banner {
      background: #1B3824;
      padding: 32px 24px;
      text-align: center;
      color: #FFFFFF;
    }
    .banner-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 4px 14px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #E2EDE0;
      margin-bottom: 10px;
    }
    .banner-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 6px;
      color: #FFFFFF;
      letter-spacing: -0.3px;
    }
    .body-content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 17px;
      font-weight: 600;
      color: #1B3824;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 15px;
      color: #405244;
      margin-bottom: 22px;
      line-height: 1.65;
    }
    .details-box {
      background: #F4F7F2;
      border-radius: 12px;
      border: 1px solid #DFEDE0;
      padding: 18px 20px;
      margin: 22px 0 28px;
    }
    .detail-row {
      font-size: 14px;
      padding: 4px 0;
      color: #334437;
    }
    .detail-label {
      font-weight: 700;
      color: #294B35;
      display: inline-block;
      width: 80px;
    }
    .btn-wrap {
      text-align: center;
      margin: 28px 0 16px;
    }
    .primary-btn {
      display: inline-block;
      background: #294B35;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 13px 32px;
      border-radius: 28px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .footnote {
      text-align: center;
      font-size: 13px;
      color: #718375;
      margin-top: 18px;
    }
    .footer {
      background: #FAFCF9;
      border-top: 1px solid #EBF2EA;
      padding: 22px 28px;
      text-align: center;
      font-size: 12px;
      color: #7E9282;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Top Header -->
      <div class="banner">
        <div class="banner-badge">Birthday Celebration</div>
        <h1 class="banner-title">${data.birthdayPersonName}'s Birthday Party</h1>
        <p style="margin: 0; font-size: 14px; color: #D5E5D1;">You are warmly invited to join our celebration</p>
      </div>

      <!-- Main Body -->
      <div class="body-content">
        <div class="greeting">Hello ${data.guestName},</div>
        <div class="paragraph">${customMsg}</div>

        <!-- Event Details -->
        <div class="details-box">
          <div class="detail-row"><span class="detail-label">Date:</span> ${data.birthdayDate}</div>
          <div class="detail-row"><span class="detail-label">Time:</span> ${data.birthdayTime}</div>
          <div class="detail-row"><span class="detail-label">Location:</span> ${data.birthdayLocation}</div>
        </div>

        <!-- Primary Action Link -->
        <div class="btn-wrap">
          <a href="${data.birthdayWebsiteUrl}" target="_blank" rel="noopener noreferrer" class="primary-btn">
            View Invitation &amp; RSVP
          </a>
        </div>

        <div class="footnote">
          Please visit our celebration website to view party photos, send wishes, and confirm your attendance.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 4px; font-weight: 600; color: #294B35;">Best regards,</p>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #1B3824;">${data.hostName}</p>
        <p style="margin: 0; font-size: 11px; color: #9AB0A0;">
          Sent directly via host's Google account for ${data.birthdayPersonName}'s celebration.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Natural Plain-Text Fallback
 */
export function generateInvitationPlainText(data: InvitationTemplateData): string {
  const customMsg = data.customMessage || "We would love for you to celebrate this special milestone with us! Join us for a joyful gathering with family, friends, and delicious birthday cake.";

  return `Invitation: Celebrate ${data.birthdayPersonName}'s Birthday Party

Hello ${data.guestName},

${customMsg}

Event Details:
- Date: ${data.birthdayDate}
- Time: ${data.birthdayTime}
- Location: ${data.birthdayLocation}

Please visit our invitation website to view details and confirm your RSVP:
${data.birthdayWebsiteUrl}

We look forward to celebrating together!

Best regards,
${data.hostName}
`;
}
