const LATITUDE = 40.6711;
const LONGITUDE = -73.9911;

function addMinutesToTime(time, x) {
  let [hour, minute] = time.split(":").map(Number);

  minute += x;

  if (minute >= 60) {
    minute -= 60;
    hour += 1;
  }

  if (hour == 24) {
    hour = 0;
  }

  return `${hour}:${minute.toString().padStart(2, "0")}`;
}

function c1(adhanTime) {
  MARKS = [15, 30, 45, 60];

  let [, minute] = adhanTime.split(":").map(Number);

  if (minute == 0) {
    return addMinutesToTime(adhanTime, 15);
  }

  for (const m of MARKS) {
    let diff = m - minute;
    if (diff < 0) {
      continue;
    } else if (diff == 0) {
      return addMinutesToTime(adhanTime, 15);
    } else {
      return addMinutesToTime(adhanTime, 15 + diff);
    }
  }
}

for (let i = 0; i < 60; i++) {
  let j = `04:${String(i).padStart(2, "0")}`;
  console.log(j, c1(j));
}

console.log(c1("05:00"));
console.log(c1("05:57"));
console.log(c1("03:42"));
console.log(c1("07:23"));
console.log(c1("07:00"));

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

async function getData() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}-${month}-${year}`;

  // console.log(date);

  // const date = "06-10-2025"; // Correct date format

  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${LATITUDE}&longitude=${LONGITUDE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    // console.log(result);
    // console.log(result.data);
    // console.log(result.data.timings.Fajr);
    // console.log(result.data.timings.Dhuhr);
    // console.log(result.data.timings.Asr);
    // console.log(result.data.timings.Maghrib);
    // console.log(result.data.timings.Isha);

    document.getElementById("1").innerText = convertTo12HourFormat(
      result.data.timings.Fajr,
    );
    document.getElementById("2").innerText = convertTo12HourFormat(
      result.data.timings.Dhuhr,
    );
    document.getElementById("3").innerText = convertTo12HourFormat(
      result.data.timings.Asr,
    );
    document.getElementById("4").innerText = convertTo12HourFormat(
      result.data.timings.Maghrib,
    );
    document.getElementById("5").innerText = convertTo12HourFormat(
      result.data.timings.Isha,
    );

    document.getElementById("maghrib-iqamah-time").innerText =
      convertTo12HourFormat(addMinutesToTime(result.data.timings.Maghrib, 11));

    document.getElementById("isha-iqamah-time").innerText =
      convertTo12HourFormat(c1(result.data.timings.Isha));

    document.getElementById("fajr-iqamah-time").innerText =
      convertTo12HourFormat(c1(result.data.timings.Fajr));

    document.getElementById("asr-iqamah-time").innerText =
      convertTo12HourFormat(c1(result.data.timings.Asr));
  } catch (error) {
    console.error(error.message);
  }
}

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
