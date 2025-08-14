import { fetchWeatherApi } from "openmeteo";
import { Coordinates, LocationName } from "../model/codenates";

export class GetWeather {
  latitude: number | null;
  longitude: number | null;

  constructor({ latitude, longitude }: Coordinates) {
    this.latitude = latitude;
    this.longitude = longitude;
    console.log("GetWeather initialized with", latitude, longitude);
  }

  static async getLocationNameFromCoordinates({ latitude, longitude }: Coordinates): Promise<LocationName> {
    if (latitude === null || longitude === null) return { name: "Unknown location" };

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      if (data.error) return { name: "Unknown location" };
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "Unknown city";
      const country = data.address?.country || "Unknown country";
      return { name: `${city}, ${country}` };
    } catch (error) {
      console.error("Error getting location name:", error);
      return { name: "Unknown location" };
    }
  }



  static async getWeather({ latitude, longitude }: Coordinates) {
    const lat = latitude ?? 0;
    const lon = longitude ?? 0;

    const params = {
      latitude: lat,
      longitude: lon,
      hourly: "temperature_2m,relative_humidity_2m,windspeed_10m,weathercode",
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
      forecast_days: 2,
      timezone: "auto",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;
    const hourlyTimes = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
      (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    );

    const hourlyTemps = hourly.variables(0)?.valuesArray() || [];
    const hourlyHumidity = hourly.variables(1)?.valuesArray() || [];
    const hourlyWind = hourly.variables(2)?.valuesArray() || [];
    const hourlyWeatherCode = hourly.variables(3)?.valuesArray() || [];

    const now = new Date();
    const next8HoursData = hourlyTimes
      .map((time, index) => ({
        time,
        temperature: hourlyTemps[index] ?? null,
        humidity: hourlyHumidity[index] ?? null,
        wind: hourlyWind[index] ?? null,
        weatherCode: hourlyWeatherCode[index] ?? null,
      }))
      .filter((entry) => entry.time >= now && entry.time <= new Date(now.getTime() + 8 * 60 * 60 * 1000));

    const daily = response.daily()!;
    const dailyTimes = [...Array(daily.timeEnd() - daily.time())].map(
      (_, i) => new Date((Number(daily.time()) + i * 24 * 60 * 60 + utcOffsetSeconds) * 1000)
    );
    const dailyMax = daily.variables(0)?.valuesArray() || [];
    const dailyMin = daily.variables(1)?.valuesArray() || [];
    const dailyWeatherCode = daily.variables(2)?.valuesArray() || [];

    const dailyData = dailyTimes.map((time, index) => ({
      date: time,
      max: dailyMax[index] ?? null,
      min: dailyMin[index] ?? null,
      weatherCode: dailyWeatherCode[index] ?? null,
    }));

    return {
      hourly: next8HoursData,
      locationName: await GetWeather.getLocationNameFromCoordinates({ latitude, longitude }),
      daily: dailyData,
    };
  }
}
