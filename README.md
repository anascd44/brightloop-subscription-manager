# Brightloop Subscription Management - Admin Backend MVP

JavaScript only: Node.js, Express, PostgreSQL, SQL, JWT and bcryptjs.

## Setup
1. Create a PostgreSQL database named `brightloop`.
2. Run `database/schema.sql` in that database (pgAdmin Query Tool or psql).
3. Open a terminal in `backend/` and run `npm install`.
4. Copy `.env.example` to `.env`, set your PostgreSQL password in DATABASE_URL and replace JWT_SECRET with a long random secret. Set a strong ADMIN_PASSWORD.
5. Run `npm run seed` to create the first admin account.
6. Run `npm run dev` (or `npm start`). API: `http://localhost:5000/api/v1`.

## Login
POST `/api/v1/auth/login`
```json
{"email":"admin@brightloop.com","password":"your ADMIN_PASSWORD"}
```
Send `Authorization: Bearer <token>` for all `/admin` endpoints.

## Admin endpoints
- GET `/admin/dashboard`
- Products: GET/POST `/admin/products`; GET/PUT/DELETE `/admin/products/:id`; POST/GET `/admin/products/:id/variants`; PATCH `/admin/variants/:id`
- Plans: GET/POST `/admin/plans`; PUT `/admin/plans/:id`
- Taxes: GET/POST `/admin/taxes`; PATCH `/admin/taxes/:id`
- Discounts: GET/POST `/admin/discounts`; PATCH `/admin/discounts/:id`
- Customers: GET `/admin/customers`
- Staff: GET/POST `/admin/staff`; PUT `/admin/staff/:id/permissions`; PATCH `/admin/users/:id/status`
- Subscriptions: GET/POST `/admin/subscriptions`; GET `/admin/subscriptions/:id`; PATCH `/admin/subscriptions/:id/status`
- Invoices: POST `/admin/invoices/generate/:subscriptionId`; GET `/admin/invoices`; GET `/admin/invoices/:id`; PATCH `/admin/invoices/:id/cancel`
- Payments: GET/POST `/admin/payments`
- Reports: GET `/admin/reports/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD`; GET `/admin/reports/outstanding`; GET `/admin/reports/overdue`; GET `/admin/reports/monthly-revenue`

## Permission codes for staff
`products.manage`, `plans.manage`, `taxes.manage`, `discounts.manage`, `subscriptions.manage`, `invoices.manage`, `payments.manage`, `reports.view`, `users.manage`.
Example assign: PUT `/admin/staff/:id/permissions` body `{"permissions":["products.manage","reports.view"]}`.

## Important integration contract
- Both customer and admin backend code must use this SAME database and `users` table. Customer registration must insert role `CUSTOMER`.
- JWT payload: `{ "sub": "<user UUID>", "role": "ADMIN|STAFF|CUSTOMER" }`. Admin middleware verifies user from database; do not trust role sent by browser.
- API response shape: `{ "success": true, "data": ... }` or `{ "success": false, "message": "..." }`.
- Admin base URL: `/api/v1/admin`; auth base URL: `/api/v1/auth`.
- Use the shared schema; coordinate any schema changes with the customer backend developer before running migrations.

## Hackathon MVP limitations
This is a practical starter, not a fully audited production billing platform. Before demo, test the happy path end-to-end. Recurring invoice scheduling, password reset email, quotations/PDF, automated renewal/expiry jobs, prorating, refunds, audit logs, and full jurisdiction-specific tax compliance are not included. The current discount rule is applied at subscription level during invoice generation. Invoice period uniqueness is protected by PostgreSQL. Financial calculations use PostgreSQL NUMERIC and JavaScript rounding; for production, use a decimal arithmetic library and comprehensive tests.
