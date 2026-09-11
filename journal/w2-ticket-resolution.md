# Week 3 : Complaint APIs, Validation and Error Handling

# Mock/Test Data Contaminating the Production Complaints Collection

## Error:
![Mock complaint timeline](file:///C:/Users/aryan/Civic_Pulse_project/journals/1024030920-aryan/assets/w2-mock-data-timeline.png)
> No thrown exception — silent data contamination. The `civicpulse`
> database contained 8 complaint records, but only 1
> (`CP1030`, a real "Pothole" complaint) was genuinely submitted
> through the frontend. The other 7 (`CP1021`–`CP1029`) were mock
> or test-generated records sitting in the same collection as real
> complaints, indistinguishable at a glance — e.g. `CP1029` had a
> full fake timeline ("Water board maintenance van...", "Delhi Jal
> Board Desk", "Priya Sharma (Citizen)") that looked exactly like a
> real complaint's audit trail.


## Relevant Context

Two separate sources were writing into the **same** primary
database:

1. `seedComplaints.js` (`backend/src/scripts/seedComplaints.js`) —
   a seed script that inserted mock complaints (`CP1021`, `CP1023`,
   `CP1025`, `CP1026`) directly into `civicpulse`.
2. `verify_complaints.js` (`backend/tests/verify_complaints.js`) —
   a backend verification test suite that, instead of running
   against an isolated test database, connected to and wrote
   complaint records (`CP1027`–`CP1029`) directly into the same
   `civicpulse` database used in development/production.

```javascript
// ❌ Original test setup — no isolation
// verify_complaints.js connected using the same MONGODB_URI
// as the main app, with no teardown after tests ran
mongoose.connect(process.env.MONGODB_URI);
```

## Key Observation

Nothing was throwing errors because nothing was technically wrong —
both the seed script and the test suite were functioning exactly
as written. The bug was architectural: there was no separation
between "data used to develop/test the app" and "data the app
actually serves to users." Every test run silently added more
realistic-looking fake complaints into the same collection real
users' complaints lived in, making it impossible to tell mock data
from genuine submissions just by querying the DB — `CP1029` had to
be traced by hand and matched against a screenshot to confirm it
was fake.

## Solution

1. **Isolated the test suite from the main database** — `verify_complaints.js`
   now connects to a dedicated test database via a separate env
   variable, and tears itself down after running:

```javascript
// ✅ Fixed
mongoose.connect(process.env.TEST_MONGODB_URI);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
```

2. **Wrote a one-time cleanup script** (`cleanMockComplaints.js`) to
   remove the existing mock records (`CP1021`–`CP1029`) from the
   production collection while preserving the real complaint
   (`CP1030`), and reset the complaint-ID counter so new complaints
   continue cleanly from `CP1031` instead of colliding with deleted
   mock IDs.

**Because**

Test and seed data should never share a database connection string
with the application's real data store. Without that separation,
every test run — even a "read-only verification" one — becomes a
write path into production data, and there's no reliable way to
distinguish real records from synthetic ones after the fact unless
they're tagged explicitly (e.g. an `isMock: true` flag) or kept in
a physically separate database. Isolating test environments isn't
just about avoiding crashes — it's about keeping the meaning of
production data trustworthy.