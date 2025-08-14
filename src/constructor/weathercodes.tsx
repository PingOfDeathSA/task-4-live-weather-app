export class WeatherCodes {
    constructor(){
        console.log("WeatherCodes");
    }
  static getWetherCode() {
      const weatherMapping: Record<number, { text: string; icon: string }> = {
        0: { text: "Clear", icon: `${process.env.PUBLIC_URL}/images/Sun.png` },
        1: { text: "Mainly clear", icon: `${process.env.PUBLIC_URL}/images/Clear Sky.png` },
        2: { text: "Partly cloudy", icon: `${process.env.PUBLIC_URL}/images/Partly Cloudy.png` },
        3: { text: "Overcast", icon: `${process.env.PUBLIC_URL}/images/Rain Cloud.png` },
        61: { text: "Rain", icon: `${process.env.PUBLIC_URL}/images/Rain.png` },
        63: { text: "Rain showers", icon: `${process.env.PUBLIC_URL}/images/Rain.png` },
        80: { text: "Showers", icon: `${process.env.PUBLIC_URL}/images/Rain Cloud.png` },
        95: { text: "Thunderstorm", icon: `${process.env.PUBLIC_URL}/images/Stormy Weather.png` },
      };

      return weatherMapping;
  }

}



