export type WhatsAppResult = {
  sent: boolean;
  reason?: string;
  messageId?: string;
};

export type BookingNotificationResult = {
  customerSent: boolean;
  customerReason?: string;
  ownerSent: boolean;
  ownerReason?: string;
};

export function normalizeWhatsAppNumber(value: string) {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let digits = value
    .replace(/[٠-٩]/g, digit => String(arabicDigits.indexOf(digit)))
    .replace(/[^0-9]/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);

  const defaultCountryCode = (process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "20").replace(/[^0-9]/g, "");
  if (digits.startsWith("0") && defaultCountryCode) {
    digits = `${defaultCountryCode}${digits.slice(1)}`;
  }

  return digits;
}

function getConfig() {
  return {
    token: process.env.META_WHATSAPP_TOKEN,
    phoneNumberId: process.env.META_WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION || "v23.0",
  };
}

async function postWhatsApp(to: string, payload: Record<string, unknown>): Promise<WhatsAppResult> {
  const { token, phoneNumberId, apiVersion } = getConfig();
  const normalizedTo = normalizeWhatsAppNumber(to);

  if (!token || !phoneNumberId) {
    return { sent: false, reason: "WhatsApp Cloud API credentials are not configured" };
  }
  if (normalizedTo.length < 8) {
    return { sent: false, reason: "Customer WhatsApp number is invalid after normalization" };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizedTo,
        ...payload,
      }),
    });

    const result = await response.json().catch(() => ({})) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string; code?: number; error_subcode?: number };
    };

    if (!response.ok) {
      const details = result.error?.message || `HTTP ${response.status}`;
      const code = result.error?.code ? ` [${result.error.code}${result.error.error_subcode ? `/${result.error.error_subcode}` : ""}]` : "";
      console.warn(`[WhatsApp] Meta rejected message${code}: ${details}`);
      return { sent: false, reason: `${details}${code}` };
    }

    return { sent: true, messageId: result.messages?.[0]?.id };
  } catch (error) {
    console.warn("[WhatsApp] request failed", error);
    return { sent: false, reason: "WhatsApp Cloud API request failed" };
  }
}

async function sendBookingTemplate(
  to: string,
  payload: {
    bookingCode: string;
    customerName: string;
    serviceName: string;
    dateLabel: string;
    timeLabel: string;
    language: "ar" | "en";
  },
): Promise<WhatsAppResult> {
  const templateName = process.env.WHATSAPP_BOOKING_TEMPLATE_NAME || "booking_confirmation";
  const languageCode = payload.language === "ar"
    ? process.env.WHATSAPP_BOOKING_TEMPLATE_LANGUAGE_AR || "ar"
    : process.env.WHATSAPP_BOOKING_TEMPLATE_LANGUAGE_EN || "en_US";

  return postWhatsApp(to, {
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: payload.customerName },
            { type: "text", text: payload.bookingCode },
            { type: "text", text: payload.serviceName },
            { type: "text", text: payload.dateLabel },
            { type: "text", text: payload.timeLabel },
          ],
        },
      ],
    },
  });
}

async function sendOwnerText(to: string, body: string): Promise<WhatsAppResult> {
  if (!process.env.WHATSAPP_OWNER_TEXT_ENABLED) {
    return { sent: false, reason: "Owner WhatsApp text is disabled; owner receives the built-in project notification" };
  }
  return postWhatsApp(to, {
    type: "text",
    text: { preview_url: false, body },
  });
}

export async function notifyBooking(payload: {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  language?: "ar" | "en";
}): Promise<BookingNotificationResult> {
  const templatePayload = { ...payload, language: payload.language || "en" };
  const customer = await sendBookingTemplate(payload.customerPhone, templatePayload);
  const owner = await sendOwnerText(
    process.env.WHATSAPP_OWNER_PHONE || "+201153213270",
    `New booking ${payload.bookingCode}\n${payload.customerName} — ${payload.serviceName}\n${payload.dateLabel} at ${payload.timeLabel}\nPhone: ${payload.customerPhone}`,
  );

  return {
    customerSent: customer.sent,
    customerReason: customer.reason,
    ownerSent: owner.sent,
    ownerReason: owner.reason,
  };
}
