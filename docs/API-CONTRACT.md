# Shared API Contract (Admin/Customer team)

- Language: JavaScript. Backend: Node.js + Express. Database: one shared PostgreSQL database.
- Auth header: `Authorization: Bearer <JWT>`.
- JWT claims: `sub` = user UUID, `role` = ADMIN, STAFF, or CUSTOMER.
- User records and customer records are the same `users` table. Customer signup inserts `role_id=(SELECT id FROM roles WHERE name='CUSTOMER')`.
- Standard response: `{ "success": true, "data": ... }`; errors: `{ "success": false, "message": "..." }`.
- Dates use `YYYY-MM-DD`; timestamps are ISO-8601 UTC; currency values are decimal amounts.
- Admin routes are prefixed `/api/v1/admin`; shared authentication is `/api/v1/auth`.
- Do not create separate customer/admin user, subscription, invoice or payment tables. Discuss schema changes before merging.
