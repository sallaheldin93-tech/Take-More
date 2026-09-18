import { Resend } from "resend";
import { ENV } from "./_core/env";

export const BOOKING_RECIPIENT = "info@take-more.com";
const DEFAULT_SENDER = "Take More <onboarding@resend.dev>";

export type BookingEmailInput = {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  notes?: string;
};

export type BookingEmailResult = {
  sent: boolean;
  reason?: "not_configured" | "send_failed";
  id?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export async function sendBookingEmail(input: BookingEmailInput): Promise<BookingEmailResult> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY is not configured; booking email skipped");
    return { sent: false, reason: "not_configured" };
  }

  const resend = new Resend(ENV.resendApiKey);
  const customerEmail = input.customerEmail?.trim();
  const replyTo = customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ? customerEmail
    : undefined;
  const safe = {
    bookingCode: escapeHtml(input.bookingCode),
    customerName: escapeHtml(input.customerName),
    customerPhone: escapeHtml(input.customerPhone),
    customerEmail: escapeHtml(customerEmail || "Not provided"),
    serviceName: escapeHtml(input.serviceName),
    dateLabel: escapeHtml(input.dateLabel),
    timeLabel: escapeHtml(input.timeLabel),
    notes: escapeHtml(input.notes?.trim() || "Not provided"),
  };

  try {
    const result = await resend.emails.send({
      from: ENV.bookingEmailFrom || DEFAULT_SENDER,
      to: [BOOKING_RECIPIENT],
      ...(replyTo ? { replyTo } : {}),
      subject: `New Take More booking — ${input.bookingCode}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#102a43">
        <h2>New Take More booking</h2>
        <p><strong>Booking code:</strong> ${safe.bookingCode}</p>
        <hr />
        <p><strong>Customer:</strong> ${safe.customerName}</p>
        <p><strong>Phone:</strong> ${safe.customerPhone}</p>
        <p><strong>Email:</strong> ${safe.customerEmail}</p>
        <p><strong>Service:</strong> ${safe.serviceName}</p>
        <p><strong>Date:</strong> ${safe.dateLabel}</p>
        <p><strong>Time:</strong> ${safe.timeLabel}</p>
        <p><strong>Notes:</strong> ${safe.notes}</p>
      </div>`,
    });

    if (result.error || !result.data?.id) {
      console.warn("[Email] Resend rejected booking email:", result.error);
      return { sent: false, reason: "send_failed" };
    }

    return { sent: true, id: result.data.id };
  } catch (error) {
    console.warn("[Email] Failed to send booking email:", error);
    return { sent: false, reason: "send_failed" };
  }
}

export function bookingEmailRecipient() {
  return BOOKING_RECIPIENT;
}

export function bookingEmailSender() {
  return ENV.bookingEmailFrom || DEFAULT_SENDER;
}
