import { useState, useEffect } from "react";
import { GetWeather } from "../../constructor/getweather";
import tapsstyle from "./tabs.module.css";
import { WeatherCodes } from "../../constructor/weathercodes";
import { showAllProps } from "../../model/thememodel";

export default function CustomTabs({ theme, latitude, longitude }: showAllProps) {
  const [activeTab, setActiveTab] = useState("Hours");
  const [weatherData, setWeatherData] = useState<any>(null);

  const myWeatherCodes = WeatherCodes.getWetherCode();

  useEffect(() => {
    GetWeather.getWeather({ latitude, longitude }).then((data) => {
      console.log("Hourly weather data:", data.hourly);
      setWeatherData(data);
    });
  }, [latitude, longitude]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const tabs = [
    {
      title: "Hours",
      content: (
        <div style={{ overflowX: "auto" }}>
          <table
            className={tapsstyle.noborderTable}
            style={{
              width: "100%",
              maxWidth: "500px",
              tableLayout: "fixed",
              backgroundColor: theme ? "#282c34fa" : "#f0f0f0fa",
              color: theme ? "white" : "#282c34fa",
            }}
          >
            <thead>
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>Weather</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.hourly.map((h: any) => {
                const hourDate = new Date(h.time);
                const info = myWeatherCodes[h.weatherCode] || { text: "Unknown", icon: "../images/unknown.png" };
                return (
                  <tr key={h.time}>
                    <td>{hourDate.toLocaleTimeString([], { hour: "2-digit" })}</td>
                    <td>{h.temperature.toFixed(0)}</td>
                    <td>
                      {info.text}{" "}
                      <img
                        className={tapsstyle.iconimage}
                        src={info.icon}
                        alt={`${info.text}-image`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Days",
      content: (
        <div style={{ overflowX: "auto" }}>
          <table
            className={tapsstyle.noborderTable}
            style={{
              width: "100%",
              maxWidth: "500px",
              tableLayout: "fixed",
              backgroundColor: theme ? "#282c34fa" : "#f0f0f0fa",
              color: theme ? "white" : "#282c34fa",
            }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Weather</th>
                <th>Max (°C)</th>
                <th>Min (°C)</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.daily.map((d: any) => {
                const info = myWeatherCodes[d.weatherCode] || { text: "Unknown", icon: "../images/unknown.png" };
                const dayDate = new Date(d.date);
                return (
                  <tr key={d.date}>
                    <td>{dayDate.toDateString()}</td>
                    <td>
                      <img
                        className={tapsstyle.iconimage}
                        src={info.icon}
                        alt={`${info.text}-image`}
                      />
                    </td>
                    <td>{d.max.toFixed(0)}</td>
                    <td>{d.min.toFixed(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <div className={tapsstyle.tabs}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #a8a8a8ff",
          backgroundColor: theme ? "#282c34fa" : "#f0f0f0fa",
          color: theme ? "white" : "#282c34fa",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => setActiveTab(tab.title)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === tab.title ? "3px solid white" : "none",
              cursor: "pointer",
              backgroundColor: activeTab === tab.title ? "#282c34" : "#f0f0f0fa",
              color: activeTab === tab.title ? "white" : "#282c34",
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div style={{ border: "none", borderTop: "none", maxWidth: "1200px", width: "100%" }}>
        {tabs.find((tab) => tab.title === activeTab)?.content}
      </div>
    </div>
  );
}
