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
 * High-Inbox Placement Clean HTML Email Template
 * Specifically formatted to read like genuine personal correspondence:
 * - Clean semantic markup with 100% inline styles (no <style> blocks that trigger spam filters)
 * - High text-to-code ratio
 * - Plain and direct celebration message
 * - Clean celebration link without misleading anchor text
 */
export function generateInvitationHtml(data: InvitationTemplateData): string {
  const customMsg = data.customMessage || "We would love for you to celebrate this special milestone with us! Join us for a joyful gathering with family, friends, and delicious birthday cake.";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf6; color: #233327; line-height: 1.6;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dce8db; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    
    <div style="border-bottom: 2px solid #294b35; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #1b3824; font-size: 20px; font-weight: 700;">
        ${data.birthdayPersonName}'s 1st Birthday Celebration
      </h2>
    </div>

    <p style="font-size: 16px; margin: 0 0 16px 0; color: #1b3824;">
      Hello ${data.guestName},
    </p>

    <p style="font-size: 15px; margin: 0 0 18px 0; color: #354a3a;">
      ${customMsg}
    </p>

    <div style="background-color: #f2f7f1; border-left: 4px solid #437351; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <div style="font-size: 14px; margin-bottom: 6px; color: #1b3824;">
        <strong>Date:</strong> ${data.birthdayDate}
      </div>
      <div style="font-size: 14px; margin-bottom: 6px; color: #1b3824;">
        <strong>Time:</strong> ${data.birthdayTime}
      </div>
      <div style="font-size: 14px; color: #1b3824;">
        <strong>Location:</strong> ${data.birthdayLocation}
      </div>
    </div>

    <p style="font-size: 15px; margin: 22px 0 14px 0; color: #354a3a;">
      You can view event details, photos, and confirm your RSVP on our birthday website:
    </p>

    <div style="margin: 18px 0 26px 0;">
      <a href="${data.birthdayWebsiteUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #294b35; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
        Open Birthday Website &rarr;
      </a>
    </div>

    <div style="border-top: 1px solid #e5ede4; padding-top: 18px; margin-top: 24px; font-size: 14px; color: #526657;">
      <p style="margin: 0 0 4px 0;">Warm regards,</p>
      <p style="margin: 0; font-weight: 700; color: #1b3824;">${data.hostName}</p>
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

  return `Hello ${data.guestName},

${customMsg}

Event Details:
- Date: ${data.birthdayDate}
- Time: ${data.birthdayTime}
- Location: ${data.birthdayLocation}

You can view full details, directions, and confirm your RSVP on our birthday website:
${data.birthdayWebsiteUrl}

Warm regards,
${data.hostName}
`;
}
