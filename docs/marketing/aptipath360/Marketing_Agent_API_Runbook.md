# AptiPath360 Marketing Agent Runbook

## 1. Apply schema

Run:

```sql
SOURCE marketing_agent_schema_2026_03_02.sql;
```

Tables created:
- `rd_marketing_lead_profile`
- `rd_marketing_message_log`
- `rd_marketing_agent_task`
- `rd_marketing_booking`
- `rd_marketing_consent_audit`

## 2. New API endpoints

Base: `/marketing/api`

1. `POST /leads/upsert`
2. `POST /whatsapp/twilio/inbound` (Twilio webhook)
3. `POST /agent/run/{leadId}`
4. `POST /booking/create`
5. `GET /dashboard/kpi?from=YYYY-MM-DD&to=YYYY-MM-DD`

## 3. Sample requests

### Lead Upsert

```json
POST /marketing/api/leads/upsert
{
  "parentName": "Ravi Kumar",
  "phoneE164": "+919876543210",
  "studentName": "Aarav",
  "studentGrade": "10",
  "board": "CBSE",
  "city": "Hyderabad",
  "sourceChannel": "meta_ads",
  "campaignId": "apti_mar_week1",
  "consentOptIn": true,
  "notes": "Requested demo"
}
```

### Run Agent

```http
POST /marketing/api/agent/run/123
```

### Create Booking

```json
POST /marketing/api/booking/create
{
  "leadId": 123,
  "slotTime": "2026-03-05T18:30:00",
  "mode": "PHONE",
  "notes": "Prefers evening call"
}
```

### KPI

```http
GET /marketing/api/dashboard/kpi?from=2026-03-01&to=2026-03-07
```

## 4. Twilio webhook setup

Set Twilio WhatsApp inbound webhook URL to:

`https://<your-domain>/marketing/api/whatsapp/twilio/inbound`

Controller validates:
- `X-Twilio-Signature`
- request URL + form params

Using property:
- `twilio.authToken`

## 5. Agent behavior in MVP

- Captures inbound messages into `rd_marketing_message_log`
- Detects intents: demo interest, pricing, grade signal, opt-out
- Updates lead score and funnel stage
- Creates and executes next-best-action tasks
- Sends WhatsApp follow-up using existing Twilio service
- Handles opt-out (`STOP`, `UNSUBSCRIBE`, `NO MSG`) with audit

