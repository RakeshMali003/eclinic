# TODO: Fix Appointment Date Timezone Issue

## Completed Tasks
- [x] Analyzed the timezone issue in appointment booking
- [x] Identified root cause: Date parsing in backend treating local timezone instead of UTC
- [x] Updated appointmentController.js to treat appointment_date as UTC date at midnight
- [x] Updated appointmentModel.js getBookedSlots to treat date as UTC date at midnight
- [x] Updated appointmentModel.js findUpcomingByPatient to use UTC date for comparison
- [x] Updated frontend BookAppointment.tsx to send UTC date at midnight

## Summary
The issue was that when booking an appointment for the 22nd, it was being stored as the 21st due to timezone conversion. The frontend sends date in YYYY-MM-DD format, but the backend was parsing it as local time instead of UTC.

**Changes Made:**
1. In `backend/controllers/appointmentController.js`: Changed date parsing to explicitly create UTC date at midnight using `new Date(Date.UTC(year, month - 1, day))`
2. In `backend/models/appointmentModel.js`:
   - Updated `getBookedSlots` to parse date as UTC date at midnight
   - Updated `findUpcomingByPatient` to use UTC date for comparison
3. In `components/patient-portal/BookAppointment.tsx`: Changed date formatting to use `Date.UTC()` to create UTC date at midnight

These changes ensure dates are consistently treated as UTC midnight, preventing timezone shifts during storage and retrieval.
