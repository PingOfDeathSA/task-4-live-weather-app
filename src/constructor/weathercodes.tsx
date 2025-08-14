export class WeatherCodes {
    constructor(){
        console.log("WeatherCodes");
    }
    static getWetherCode(){
        const weatherMapping: Record<number, { text: string; icon: string }> = {
  0: { text: "Clear", icon: "../images/Sun.png" },
  1: { text: "Mainly clear", icon: "../images/Clear Sky.png" },
  2: { text: "Partly cloudy", icon: "../images/Partly Cloudy.png" },
  3: { text: "Overcast", icon: "../images/Rain Cloud.png" },
  61: { text: "Rain", icon: "../images/Rain.png" },
  63: { text: "Rain showers", icon: "../images/Rain.png" },
  80: { text: "Showers", icon: "../images/Rain Cloud.png" },
  95: { text: "Thunderstorm", icon: "../images/Stormy Weather.png" },
};

return weatherMapping
    }
}