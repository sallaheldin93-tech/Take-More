# WhatsApp Booking Confirmation Setup

The booking backend sends the customer confirmation through the **Meta WhatsApp Cloud API** using an approved **Utility** template. Meta requires approved templates for business-initiated messages outside the customer service window.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `META_WHATSAPP_TOKEN` | Permanent Meta system-user access token with WhatsApp messaging permission. |
| `META_WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID of the WhatsApp Business sending number. |
| `WHATSAPP_BOOKING_TEMPLATE_NAME` | Optional. Defaults to `booking_confirmation`. |
| `WHATSAPP_BOOKING_TEMPLATE_LANGUAGE_AR` | Optional. Defaults to `ar`. |
| `WHATSAPP_BOOKING_TEMPLATE_LANGUAGE_EN` | Optional. Defaults to `en_US`. |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Optional. Defaults to `20`, allowing Egyptian local numbers such as `011...`. |

## Template to create in WhatsApp Manager

Create an approved **Utility** template named `booking_confirmation` in both Arabic and English. Use five positional variables in this exact order:

1. Customer name
2. Booking code
3. Service name
4. Date
5. Time

### Arabic body

```text
مرحبًا {{1}}، تم تأكيد حجزك مع Take More.
رقم الحجز: {{2}}
الخدمة: {{3}}
التاريخ: {{4}}
الوقت: {{5}}
نتطلع للتحدث معك قريبًا.
```

### English body

```text
Hello {{1}}, your booking with Take More is confirmed.
Booking code: {{2}}
Service: {{3}}
Date: {{4}}
Time: {{5}}
We look forward to speaking with you.
```

The language codes used by the website are `ar` and `en_US`. The backend normalizes Egyptian local numbers such as `01153213270` to international format `201153213270` before sending.
