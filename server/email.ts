import { Resend } from "resend";
import { ENV } from "./_core/env.js";

// Resend only delivers to the account owner's inbox until take-more.com is verified,
// so alerts default there; set BOOKING_EMAIL_TO to switch to info@take-more.com later.
export const BOOKING_RECIPIENT = "sallaheldin93@gmail.com";
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
      to: [bookingEmailRecipient()],
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

// Resend rejects mail to anyone but the account owner until take-more.com is verified,
// so customer confirmations only go out once BOOKING_EMAIL_FROM points at that domain.
export async function sendCustomerConfirmationEmail(input: BookingEmailInput): Promise<BookingEmailResult> {
  const customerEmail = input.customerEmail?.trim();
  if (!ENV.resendApiKey || !ENV.bookingEmailFrom || !customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { sent: false, reason: "not_configured" };
  }

  const safe = {
    bookingCode: escapeHtml(input.bookingCode),
    customerName: escapeHtml(input.customerName),
    serviceName: escapeHtml(input.serviceName),
    dateLabel: escapeHtml(input.dateLabel),
    timeLabel: escapeHtml(input.timeLabel),
  };

  try {
    const result = await new Resend(ENV.resendApiKey).emails.send({
      from: ENV.bookingEmailFrom,
      to: [customerEmail],
      replyTo: bookingEmailRecipient(),
      subject: `Your Take More booking is confirmed — ${input.bookingCode}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#102a43">
        <h2>Your booking is confirmed</h2>
        <p>Hi ${safe.customerName}, thanks for booking with Take More.</p>
        <p><strong>Service:</strong> ${safe.serviceName}</p>
        <p><strong>Date:</strong> ${safe.dateLabel}</p>
        <p><strong>Time:</strong> ${safe.timeLabel}</p>
        <p><strong>Booking code:</strong> ${safe.bookingCode}</p>
        <p>Need to change something? Just reply to this email.</p>
        <hr />
        <p dir="rtl">تم تأكيد حجزك مع Take More. كود الحجز: ${safe.bookingCode}</p>
      </div>`,
    });

    if (result.error || !result.data?.id) {
      console.warn("[Email] Resend rejected customer confirmation:", result.error);
      return { sent: false, reason: "send_failed" };
    }
    return { sent: true, id: result.data.id };
  } catch (error) {
    console.warn("[Email] Failed to send customer confirmation:", error);
    return { sent: false, reason: "send_failed" };
  }
}

export function bookingEmailRecipient() {
  return ENV.bookingEmailTo.trim() || BOOKING_RECIPIENT;
}

export function bookingEmailSender() {
  return ENV.bookingEmailFrom || DEFAULT_SENDER;
}
