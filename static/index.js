// Manual iqamah times (leave empty if unused)
const FAJR_IQAMAH_MANUAL = "";
const DHUHR_IQAMAH_MANUAL = "13:15";
const ASR_IQAMAH_MANUAL = "";
const MAGHRIB_IQAMAH_MANUAL = "";
const ISHA_IQAMAH_MANUAL = "";

function compare(time24, maghribAdhanTime) {
  let a = time24.replace(":", "");
  let b = maghribAdhanTime.replace(":", "");
  x = parseInt(a);
  y = parseInt(b);

  return x >= y && x < 2359;
}

function convertTo12HourFormat(time24) {
  let [hours, minutes] = time24.split(":");

  hours = parseInt(hours);
  const suffix = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minutes} ${suffix}`;
}

function addMinutes(time24, m) {
  let [hour, minute] = time24.split(":").map(Number);

  minute += m;

  if (minute >= 60) {
    minute -= 60;
    hour += 1;
  }

  if (hour == 24) {
    hour = 0;
  }

  return `${hour}:${minute.toString().padStart(2, "0")}`;
}

function calculateIqamahForFajrAsrIsha(adhanTime) {
  MARKS = [15, 30, 45, 60];

  let [, minute] = adhanTime.split(":").map(Number);

  if (minute == 0) {
    return addMinutes(adhanTime, 15);
  }

  for (const m of MARKS) {
    let diff = m - minute;
    if (diff < 0) {
      continue;
    } else if (diff == 0) {
      return addMinutes(adhanTime, 15);
    } else {
      return addMinutes(adhanTime, 15 + diff);
    }
  }
}

function setTime(className, time24) {
  for (const e of document.getElementsByClassName(className)) {
    if (className.endsWith("-ar")) {
      // e.innerText = arabicmap(convertTo12HourFormat(time24));
      // e.innerText = new Intl.DateTimeFormat("ar", {
      //   hour: "numeric",
      //   minute: "numeric",
      //   hour12: true, // Use 12-hour format with AM/PM (or their Arabic equivalents)
      // }).format(time24);
      // Split the 24-hour time string into hours and minutes
      const [hour, minute] = time24.split(":").map((num) => parseInt(num, 10));

      // Create a Date object with the provided hour and minute
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);

      // Use Intl.DateTimeFormat to format the time in Arabic numerals with AM/PM
      const formattedTime = new Intl.DateTimeFormat("ar-YE", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);

      e.innerText = formattedTime;
    } else {
      e.innerText = convertTo12HourFormat(time24);
    }
  }
}

function getCurrentDateFormatted() {
  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  return `${formattedDay}-${formattedMonth}-${year}`;
}

async function getData() {
  const date = getCurrentDateFormatted();
  const latitude = 40.6711;
  const longitude = -73.9911;

  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    const fajrAdhanTime = result.data.timings.Fajr;
    const dhuhrAdhanTime = result.data.timings.Dhuhr;
    const asrAdhanTime = result.data.timings.Asr;
    const maghribAdhanTime = result.data.timings.Maghrib;
    const ishaAdhanTime = result.data.timings.Isha;

    setTime("fajr-adhan-time", fajrAdhanTime);
    setTime("dhuhr-adhan-time", dhuhrAdhanTime);
    setTime("asr-adhan-time", asrAdhanTime);
    setTime("maghrib-adhan-time", maghribAdhanTime);
    setTime("isha-adhan-time", ishaAdhanTime);

    setTime("fajr-adhan-time-ar", fajrAdhanTime);
    setTime("dhuhr-adhan-time-ar", dhuhrAdhanTime);
    setTime("asr-adhan-time-ar", asrAdhanTime);
    setTime("maghrib-adhan-time-ar", maghribAdhanTime);
    setTime("isha-adhan-time-ar", ishaAdhanTime);

    setTime(
      "fajr-iqamah-time",
      FAJR_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(fajrAdhanTime),
    );

    setTime("dhuhr-iqamah-time", DHUHR_IQAMAH_MANUAL);

    setTime(
      "asr-iqamah-time",
      ASR_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(asrAdhanTime),
    );

    setTime(
      "maghrib-iqamah-time",
      MAGHRIB_IQAMAH_MANUAL || addMinutes(maghribAdhanTime, 11),
    );

    setTime(
      "isha-iqamah-time",
      ISHA_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(ishaAdhanTime),
    );
    ///////////////
    setTime(
      "fajr-iqamah-time-ar",
      FAJR_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(fajrAdhanTime),
    );

    setTime("dhuhr-iqamah-time-ar", DHUHR_IQAMAH_MANUAL);

    setTime(
      "asr-iqamah-time-ar",
      ASR_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(asrAdhanTime),
    );

    setTime(
      "maghrib-iqamah-time-ar",
      MAGHRIB_IQAMAH_MANUAL || addMinutes(maghribAdhanTime, 11),
    );

    setTime(
      "isha-iqamah-time-ar",
      ISHA_IQAMAH_MANUAL || calculateIqamahForFajrAsrIsha(ishaAdhanTime),
    );

    return maghribAdhanTime;
  } catch (error) {
    console.error(error.message);
  }
}

async function main() {
  const d = new Date();

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  };

  document.getElementById("gregorian-date").innerText = d.toLocaleDateString(
    document.documentElement.lang,
    options,
  );

  const x = await getData();

  const maghribAdhanTime = document.getElementById("maghrib-adhan-time");
  console.log(maghribAdhanTime);

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0"); // Hours in 24-hour format
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutes

  const time = `${hours}:${minutes}`;
  console.log(time); // Outputs: HH:MM (e.g., 14:05)

  if (compare(time, x)) {
    d.setDate(d.getDate() + 1);
  }

  const h = d.toLocaleDateString(document.documentElement.lang, {
    ...options,
    calendar: "islamic-umalqura",
  });

  document.getElementById("hijri-date").innerText = `(${h})`;
}

main();
