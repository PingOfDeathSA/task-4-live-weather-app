import { ReactNode, useEffect, useState } from "react";
import { GetWeather } from "../../constructor/getweather";
import showstate from "./show-results.module.css";
import { WeatherCodes } from "../../constructor/weathercodes";
import { Coordinates } from "../../model/codenates";
import { showAllProps, ThemeModel } from "../../model/thememodel";




export default function ShowResults( {theme, latitude, longitude }: showAllProps,) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Unknown location");
  const myWeatherCodes = WeatherCodes.getWetherCode();

  useEffect(() => {
    if (latitude != null && longitude != null) {
      GetWeather.getWeather({ latitude, longitude }).then((data) => {
        setWeatherData(data);
      });

      GetWeather.getLocationNameFromCoordinates({ latitude, longitude }).then((data) => {
        setLocationName(data.name);
      });
    }
  }, [latitude, longitude]);

  if (!weatherData) return <div>Loading weather...</div>;

  const currentHour = weatherData.hourly[0];
  const currentTemp = currentHour.temperature ?? 0;
  const currentTime = currentHour.time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const weatherInfo =
    myWeatherCodes[currentHour.weatherCode] || {
      text: "Unknown",
      icon: "../images/unknown.png",
    };

  return (
    <div className={showstate.showcontainer}
    style={{ backgroundColor: theme ? "#282c34fa" : "#f0f0f0fa" }}
    >
      <div>
        <h1 style={{ color: theme ? "white" : "#282c34fa" }} >Now — {locationName}</h1> 
        <div className={showstate.weatherContainer} >
          <img
            className={showstate.iconimage2}
            src={weatherInfo.icon}
            alt={`${weatherInfo.text}-image`}
          />
          <div className={showstate.weatherText} style={{ color: theme ? "white" : "#282c34fa" }} >
            <div >{weatherInfo.text}</div>
            <div>{currentTime} — {currentTemp.toFixed(0)}°C</div>
          </div>
        </div>
      </div>

      <div className={showstate.showcontainer2} style={{ color: theme ? "white" : "#282c34fa" }} >
        <div className={showstate.weatherInfo}>
          <div>Humidity: {currentHour.humidity?.toFixed(0) ?? "N/A"}%</div>
          <div>
            Wind:{" "}
            {currentHour.wind !== null && currentHour.wind !== undefined
              ? currentHour.wind.toFixed(2)
              : "N/A"}{" "}
            km/h
          </div>
        </div>
        <button className={showstate.changeLocationBtn}>Change Location</button>
      </div>
    </div>
  );
}
