import { describe, expect, it } from "vitest";
import { notifyBooking } from "./whatsapp";

describe("WhatsApp booking notifications", () => {
  it("does not call an external API when credentials are not configured", async () => {
    const originalToken = process.env.META_WHATSAPP_TOKEN;
    const originalPhoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.META_WHATSAPP_TOKEN;
    delete process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const result = await notifyBooking({
      bookingCode: "TM-TEST01",
      customerName: "Test Customer",
      customerPhone: "+201000000000",
      serviceName: "Websites",
      dateLabel: "12 Sep 2026",
      timeLabel: "10:00",
    });
    expect(result).toEqual({ customerSent: false, ownerSent: false });
    if (originalToken) process.env.META_WHATSAPP_TOKEN = originalToken;
    if (originalPhoneId) process.env.META_WHATSAPP_PHONE_NUMBER_ID = originalPhoneId;
  });
});
