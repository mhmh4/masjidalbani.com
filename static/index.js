function addMinutesToTime(time) {
  // Extract the hours and minutes from the time string
  let [hour, minute] = time.split(":").map(Number);

  // Add 11 minutes
  minute += 11;

  // If minutes exceed 59, increment the hour and adjust minutes
  if (minute >= 60) {
    minute -= 60;
    hour += 1;
  }

  // If the hour goes beyond 12, reset it to 1 (12-hour format)
  if (hour > 12) {
    hour = 1;
  }

  // Format the result to match the 12-hour format with leading zeroes
  return `${hour}:${minute.toString().padStart(2, "0")} PM`;
}

function convert(time24) {
  let [hours, minutes] = time24.split(":");

  // Convert hours to number for easy manipulation
  hours = parseInt(hours);

  const suffix = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format (handle 0 for midnight and 12 for noon)
  if (hours === 0) {
    hours = 12; // Midnight case (12 AM)
  } else if (hours > 12) {
    hours -= 12; // Convert 13-23 hours to 1-11
  }

  // Return the formatted string
  return `${hours}:${minutes} ${suffix}`;
}

async function getData() {
  const today = new Date();

  // Get the day and pad with a leading zero if necessary
  const day = String(today.getDate()).padStart(2, "0");

  // Get the month (months are 0-indexed, so add 1) and pad
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // Get the full year
  const year = today.getFullYear();

  // Combine them into DD/MM/YEAR format
  const date = `${day}-${month}-${year}`;

  console.log(date);

  // const date = "06-10-2025"; // Correct date format
  const latitude = 40.6711; // Latitude as a number, no quotes
  const longitude = -73.9911; // Longitude as a number, no quotes

  const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    console.log(result.data);
    console.log(result.data.timings.Fajr);
    console.log(result.data.timings.Dhuhr);
    console.log(result.data.timings.Asr);
    console.log(result.data.timings.Maghrib);
    console.log(result.data.timings.Isha);

    document.getElementById("1").innerText = convert(result.data.timings.Fajr);
    document.getElementById("2").innerText = convert(result.data.timings.Dhuhr);
    document.getElementById("3").innerText = convert(result.data.timings.Asr);
    document.getElementById("4").innerText = convert(
      result.data.timings.Maghrib,
    );
    document.getElementById("5").innerText = convert(result.data.timings.Isha);
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
