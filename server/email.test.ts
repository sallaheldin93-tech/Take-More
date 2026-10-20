import { describe, expect, it } from "vitest";
import { BOOKING_RECIPIENT, bookingEmailRecipient } from "./email.js";

describe("booking email recipient", () => {
  it("defaults to the owner inbox Resend allows before domain verification", () => {
    expect(BOOKING_RECIPIENT).toBe("sallaheldin93@gmail.com");
    expect(bookingEmailRecipient()).toBe(process.env.BOOKING_EMAIL_TO?.trim() || "sallaheldin93@gmail.com");
  });
});
