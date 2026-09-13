import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeWhatsAppNumber, notifyBooking } from "./whatsapp";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
});

describe("WhatsApp booking notifications", () => {
  it("does not call an external API when credentials are not configured", async () => {
    delete process.env.META_WHATSAPP_TOKEN;
    delete process.env.META_WHATSAPP_PHONE_NUMBER_ID;

    const result = await notifyBooking({
      bookingCode: "TM-TEST01",
      customerName: "Test Customer",
      customerPhone: "+201000000000",
      serviceName: "Websites",
      dateLabel: "12 Sep 2026",
      timeLabel: "10:00",
      language: "en",
    });

    expect(result.customerSent).toBe(false);
    expect(result.customerReason).toContain("credentials");
    expect(result.ownerSent).toBe(false);
  });

  it("normalizes common Egyptian local WhatsApp numbers", () => {
    expect(normalizeWhatsAppNumber("0115 321 3270")).toBe("201153213270");
    expect(normalizeWhatsAppNumber("٠١١٥٣٢١٣٢٧٠")).toBe("201153213270");
    expect(normalizeWhatsAppNumber("+20 115 321 3270")).toBe("201153213270");
  });

  it("sends an approved utility template with booking variables", async () => {
    process.env.META_WHATSAPP_TOKEN = "test-token";
    process.env.META_WHATSAPP_PHONE_NUMBER_ID = "123456";
    process.env.WHATSAPP_BOOKING_TEMPLATE_NAME = "booking_confirmation";
    delete process.env.WHATSAPP_OWNER_TEXT_ENABLED;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ messages: [{ id: "wamid.test" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await notifyBooking({
      bookingCode: "TM-TEST01",
      customerName: "Ahmed Ali",
      customerPhone: "01153213270",
      serviceName: "ERP Solutions",
      dateLabel: "12 Sep 2026",
      timeLabel: "10:00",
      language: "ar",
    });

    expect(result.customerSent).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0];
    const body = JSON.parse(String(request?.[1]?.body));
    expect(body.to).toBe("201153213270");
    expect(body.type).toBe("template");
    expect(body.template).toMatchObject({ name: "booking_confirmation", language: { code: "ar" } });
    expect(body.template.components[0].parameters).toHaveLength(5);
  });
});
