const input = document.querySelector(".input");
const icon = document.querySelector(".icon");
const cityName = document.querySelector(".city-name");
const nMande = document.querySelector(".num-mande");
const sMande = document.querySelector(".str-mande");
const one = document.querySelector(".one .a");
const two = document.querySelector(".two .a");
const three = document.querySelector(".three .a");
const four = document.querySelector(".four .a");
const five = document.querySelector(".five .a");
const six = document.querySelector(".six .a");
const q = [
  "تا اذان صبح",
  "تا طلوع آفتاب",
  "تا اذان ظهر",
  "تا غروب آفتاب",
  "تا اذان مغرب",
  "تا نیمه شب شرعی",
];

const fethAPI = async (code) => {
  const response = await fetch(
    `https://prayer.aviny.com/api/prayertimes/${code}`
  );
  const data = await response.json();
  return data;
};
const fethcity = async (city) => {
  const response = await fetch("https://prayer.aviny.com/api/city");
  const data = await response.json();
  const result = data.find((d) => {
    return d.Name == city;
  });
  return result;
};
const getData = () => {
  const value = input.value.trim() || "تهران";
  const result = fethcity(value);
  if (result) {
    result.then((response) => {
      console.log(response);
      fethAPI(response.Code).then((r) => {
        console.log(r);
        cityName.innerHTML = r.CityName;
        one.innerHTML = r.Imsaak;
        two.innerHTML = r.Sunrise;
        three.innerHTML = r.Noon;
        four.innerHTML = r.Sunset;
        five.innerHTML = r.Maghreb;
        six.innerHTML = r.Midnight;
        setTime(r.Imsaak, r.Sunrise, r.Noon, r.Sunset, r.Maghreb, r.Midnight);
      });
    });
  } else {
    input.value = "";
  }
};
let intervalId; // خارج از تابع، یک متغیر سراسری برای interval

const setTime = (...times) => {
  // پاک کردن interval قبلی اگر وجود دارد
  if (intervalId) clearInterval(intervalId);

  nMande.innerHTML = "";
  sMande.innerHTML = "";

  const parseTime = (str) => {
    const [h, m, s] = str.split(":").map(Number);
    return { h, m, s };
  };

  const toSeconds = ({ h, m, s }) => h * 3600 + m * 60 + s;
  const now = new Date();
  const nowSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let nextTime = times
    .map(parseTime)
    .map(toSeconds)
    .find((sec) => sec > nowSec);

  if (nextTime === undefined) {
    nextTime = toSeconds(parseTime(times[0])) + 24 * 3600;
  }

  let diff = nextTime - nowSec;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  nMande.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const index = times.findIndex(
    (t) => toSeconds(parseTime(t)) === nextTime % (24 * 3600)
  );
  sMande.innerHTML = q[index];

  intervalId = setInterval(() => {
    const now = new Date();
    const nowSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    let nextTime = times
      .map(parseTime)
      .map(toSeconds)
      .find((sec) => sec > nowSec);

    if (nextTime === undefined) {
      nextTime = toSeconds(parseTime(times[0])) + 24 * 3600;
    }

    let diff = nextTime - nowSec;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    nMande.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const index = times.findIndex(
      (t) => toSeconds(parseTime(t)) === nextTime % (24 * 3600)
    );
    sMande.innerHTML = q[index];
  }, 1000);
};

icon.addEventListener("click", getData);
getData();
