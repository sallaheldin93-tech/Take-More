type WhatsAppResult = { sent: boolean; reason?: string };

function cleanPhone(value: string) {
  return value.replace(/[^0-9]/g, "");
}

async function sendMessage(to: string, body: string): Promise<WhatsAppResult> {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v23.0";
  if (!token || !phoneNumberId || !to) return { sent: false, reason: "WhatsApp credentials are not configured" };
  try {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: cleanPhone(to), type: "text", text: { preview_url: false, body } }),
    });
    if (!response.ok) return { sent: false, reason: `WhatsApp API returned ${response.status}` };
    return { sent: true };
  } catch (error) {
    console.warn("[WhatsApp] notification failed", error);
    return { sent: false, reason: "WhatsApp request failed" };
  }
}

export async function notifyBooking(payload: {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
}) {
  const body = `Take More — Booking confirmed\n\nCode: ${payload.bookingCode}\nName: ${payload.customerName}\nService: ${payload.serviceName}\nDate: ${payload.dateLabel}\nTime: ${payload.timeLabel}\n\nWe look forward to speaking with you.`;
  const customer = await sendMessage(payload.customerPhone, body);
  const owner = await sendMessage(process.env.WHATSAPP_OWNER_PHONE || "+201153213270", `New booking ${payload.bookingCode}\n${payload.customerName} — ${payload.serviceName}\n${payload.dateLabel} at ${payload.timeLabel}\nPhone: ${payload.customerPhone}`);
  return { customerSent: customer.sent, ownerSent: owner.sent };
}
