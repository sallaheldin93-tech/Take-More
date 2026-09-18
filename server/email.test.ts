import { describe, expect, it } from "vitest";
import { BOOKING_RECIPIENT, bookingEmailRecipient } from "./email";

describe("booking email recipient", () => {
  it("uses only the Take More owner mailbox", () => {
    expect(BOOKING_RECIPIENT).toBe("info@take-more.com");
    expect(bookingEmailRecipient()).toBe("info@take-more.com");
  });
});
