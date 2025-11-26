"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { PDFViewer } from "@/components/widget/PDFViewer";
import { TOP_BAR_H } from "@/constants/sizes";
import {
  addSecondsToISODate,
  addSecondsToTime,
  extractTime,
  getDurationByClock,
  getDurationInSeconds,
  getHoursFromTime,
  getLocalTimezone,
  getMinutesFromTime,
  getRemainingSecondsUntil,
  getSecondsFromTime,
  getTimezoneOffsetMs,
  getUserNow,
  getUserTimezone,
  makeLocalDateTime,
  makeISODateTime,
  makeTime,
  makeUTCISODateTime,
  parseTimeToSeconds,
  resetTime,
  timezones,
} from "@/utils/time";
import { SimpleGrid } from "@chakra-ui/react";

const TimeUtilsTest = () => {
  // --- Setup/Dummy Data & Mocking ---

  // Data Dummy
  const DUMMY_TIMEZONE_KEY = "America/New_York";
  const DUMMY_ISO_DATE = "2025-11-26T00:00:00.000Z"; // Tanggal hari ini (UTC)
  const DUMMY_TIME_HHMMSS = "14:30:45";
  const DUMMY_TIME_HHMM = "08:15";
  const DUMMY_DATE_OBJECT = new Date("2025-11-26T12:00:00Z"); // Siang hari UTC
  const DUMMY_SECONDS_TO_ADD = 3661; // 1 jam, 1 menit, 1 detik (3600 + 60 + 1)

  // Catatan: Asumsikan semua fungsi utilitas waktu (getTimezoneOffsetMs, getLocalTimezone, dll.)
  // sudah tersedia di scope ini (seperti dari file yang telah di-refactor sebelumnya).

  // --- PANGGILAN FUNGSI (Output di Konsol) ---

  console.debug("--- 🌍 Timezone Utilities ---");
  // 1. getTimezoneOffsetMs
  console.debug(
    `1. getTimezoneOffsetMs(${DUMMY_TIMEZONE_KEY}):`,
    getTimezoneOffsetMs(DUMMY_TIMEZONE_KEY)
  );

  // 2. getLocalTimezone (Hasil akan tergantung pada lokasi runtime Anda)
  console.debug(`2. getLocalTimezone():`, getLocalTimezone());

  // 3. getUserTimezone (Mengambil dari mock getStorage: Asia/Jakarta)
  console.debug(`3. getUserTimezone():`, getUserTimezone());

  // 4. getUserNow (Menghitung waktu saat ini yang disesuaikan ke timezone pengguna)
  console.debug(`4. getUserNow():`, getUserNow());

  // 5. timezones (Menunjukkan 3 zona waktu pertama)
  console.debug("5. timezones(): (Showing first 3 results)");
  console.debug(timezones().slice(0, 3));

  console.debug("\n--- ⏱️ ISO / Time / Duration Utilities ---");
  const timeRangeStart = `${DUMMY_ISO_DATE.split("T")[0]}T10:00:00Z`; // 10:00 UTC
  const timeRangeEnd = `${DUMMY_ISO_DATE.split("T")[0]}T11:30:00Z`; // 11:30 UTC

  // 6. getDurationByClock
  console.debug(
    `6. getDurationByClock(10:00Z, 11:30Z):`,
    getDurationByClock(timeRangeStart, timeRangeEnd)
  ); // Hasil dalam milidetik

  // 7. parseTimeToSeconds
  console.debug(
    `7. parseTimeToSeconds(${DUMMY_TIME_HHMMSS}):`,
    parseTimeToSeconds(DUMMY_TIME_HHMMSS)
  );

  // 8. getDurationInSeconds (Dalam hari yang sama)
  console.debug(
    `8. getDurationInSeconds(08:00:00, 10:00:00):`,
    getDurationInSeconds("08:00:00", "10:00:00")
  );

  // 9. getDurationInSeconds (Lintas hari)
  console.debug(
    `9. getDurationInSeconds(23:00:00, 01:00:00 - Lintas hari):`,
    getDurationInSeconds("23:00:00", "01:00:00")
  );

  // 10. getHoursFromTime
  console.debug(
    `10. getHoursFromTime(${DUMMY_TIME_HHMMSS}):`,
    getHoursFromTime(DUMMY_TIME_HHMMSS)
  );

  // 11. getMinutesFromTime
  console.debug(
    `11. getMinutesFromTime(${DUMMY_TIME_HHMMSS}):`,
    getMinutesFromTime(DUMMY_TIME_HHMMSS)
  );

  // 12. getSecondsFromTime
  console.debug(
    `12. getSecondsFromTime(${DUMMY_TIME_HHMMSS}):`,
    getSecondsFromTime(DUMMY_TIME_HHMMSS)
  );

  // 13. makeTime (HH:mm)
  console.debug(
    `13. makeTime(${DUMMY_DATE_OBJECT.toISOString()}, 'HH:mm'):`,
    makeTime(DUMMY_DATE_OBJECT, "HH:mm")
  );

  // 14. makeTime (hh:mm A)
  console.debug(
    `14. makeTime(${DUMMY_DATE_OBJECT.toISOString()}, 'hh:mm A'):`,
    makeTime(DUMMY_DATE_OBJECT, "hh:mm A")
  );

  // 15. makeLocalDateTime
  console.debug(
    `15. makeLocalDateTime(${DUMMY_ISO_DATE}, ${DUMMY_TIME_HHMMSS}):`,
    makeLocalDateTime(DUMMY_ISO_DATE, DUMMY_TIME_HHMMSS)
  );

  // 16. makeISODateTime
  console.debug(
    `16. makeISODateTime(${DUMMY_ISO_DATE}, ${DUMMY_TIME_HHMMSS}):`,
    makeISODateTime(DUMMY_ISO_DATE, DUMMY_TIME_HHMMSS)
  );

  // 17. makeUTCISODateTime (Mengonversi waktu 10:00 Asia/Jakarta ke UTC ISO)
  console.debug(
    `17. makeUTCISODateTime(${DUMMY_ISO_DATE}, '10:00:00', Asia/Jakarta):`,
    makeUTCISODateTime(DUMMY_ISO_DATE, "10:00:00", {
      timezoneKey: "Asia/Jakarta",
    })
  );

  // 18. extractTime
  console.debug(
    `18. extractTime(${DUMMY_ISO_DATE}, withSeconds: false):`,
    extractTime(DUMMY_ISO_DATE, { withSeconds: false })
  );

  // 19. resetTime (Mengatur waktu objek Date ke 00:00:00)
  console.debug(
    `19. resetTime(${DUMMY_DATE_OBJECT.toISOString()}):`,
    resetTime(DUMMY_DATE_OBJECT)
  );

  // 20. addSecondsToTime
  console.debug(
    `20. addSecondsToTime(${DUMMY_TIME_HHMM}, ${DUMMY_SECONDS_TO_ADD}):`,
    addSecondsToTime(DUMMY_TIME_HHMM, DUMMY_SECONDS_TO_ADD)
  );

  // 21. getRemainingSecondsUntil (Hasil tergantung pada waktu saat kode dieksekusi)
  console.debug(
    `21. getRemainingSecondsUntil(09:00:00):`,
    getRemainingSecondsUntil("09:00:00")
  );

  // 22. addSecondsToISODate
  console.debug(
    `22. addSecondsToISODate(${DUMMY_ISO_DATE}, ${DUMMY_SECONDS_TO_ADD}):`,
    addSecondsToISODate(DUMMY_ISO_DATE, DUMMY_SECONDS_TO_ADD)
  );

  return (
    <CContainer>
      <P>Check console</P>
    </CContainer>
  );
};
const AdminDashboardRoute = () => {
  return (
    <SimpleGrid id="dashboard" columns={[1, null, 2]} gap={4} px={4} pb={4}>
      <PDFViewer
        fileUrl={`/assets/dummy-pdf.pdf`}
        h={`calc(100vh - ${TOP_BAR_H} - 16px)`}
      />

      <TimeUtilsTest />
    </SimpleGrid>
  );
};
export default AdminDashboardRoute;
