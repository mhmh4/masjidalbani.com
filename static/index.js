const LATITUDE = 40.6711;
const LONGITUDE = -73.9911;

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
    e.innerText = convertTo12HourFormat(time24);
  }
}

async function getData() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}-${month}-${year}`;

  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${LATITUDE}&longitude=${LONGITUDE}`;

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

    setTime("fajr-iqamah-time", calculateIqamahForFajrAsrIsha(fajrAdhanTime));
    setTime("dhuhr-iqamah-time", "13:15");
    setTime("asr-iqamah-time", calculateIqamahForFajrAsrIsha(asrAdhanTime));
    setTime("maghrib-iqamah-time", addMinutes(maghribAdhanTime, 11));
    setTime("isha-iqamah-time", calculateIqamahForFajrAsrIsha(ishaAdhanTime));
  } catch (error) {
    console.error(error.message);
  }
}

function main() {
  const d = new Date();

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  };

  document.getElementById("gregorian-date").innerText = d.toLocaleDateString(
    "en-US",
    options,
  );

  const h = d.toLocaleDateString("en-US", {
    ...options,
    calendar: "islamic-umalqura",
  });

  document.getElementById("hijri-date").innerText = `(${h})`;

  getData();
}

main();
