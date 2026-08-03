# Auth Testing Playbook

Credentials: see /app/memory/test_credentials.md (admin@bulandawaaz.org / BulandAwaaz@2026).

Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, unique index on users.email, index on login_attempts.identifier.

Step 2: API Testing
```
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
curl -c cookies.txt -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@bulandawaaz.org","password":"BulandAwaaz@2026"}'
curl -b cookies.txt $API/api/auth/me
curl -b cookies.txt $API/api/admin/content
curl -b cookies.txt $API/api/admin/submissions
```
Login returns the user object and sets the access_token cookie. /me returns the same user.

Step 3: Brute force
5 failed logins on the same email → 429 for 15 minutes.
