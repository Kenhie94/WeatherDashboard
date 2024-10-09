import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  tempF: string;
  iconDescription: string;
  icon: string;
  date: string;
  windSpeed: string;
  humidity: string;

  constructor(city: string, iconDescription: string, tempF: string, icon: string, date: string, windSpeed: string, humidity: string) {
    (this.city = city), (this.tempF = tempF), (this.iconDescription = iconDescription), (this.icon = icon), (this.date = date), (this.windSpeed = windSpeed), (this.humidity = humidity);
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // TODO: Create fetchLocationData method
  // Fetch data using OpenWeatherMap's API_BASE_URL and API_KEY to store the response.json in data and returning lat and lon
  private async fetchLocationData(query: string) {
    try {
      console.log("Fetching location data from URL:", query);
      const response = await fetch(this.buildGeocodeQuery());
      console.log("Response status:", response.status); // Log the status
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Location data received:", data); // Log the data
      if (data.length === 0) {
        throw new Error(`Unable to find location for city: ${this.cityName}`);
      }
      return { lat: data.coord.lat, lon: data.coord.lon };
    } catch (err) {
      console.error("Error fetching location data:", err);
      throw err;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    if (lat === undefined || lon === undefined) {
      throw new Error("Invalid location data: Latitude and Longitude are undefined");
    }
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    if (!locationData) {
      throw new Error(`Failed to retrieve location data for city: ${this.cityName}`);
    }

    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const data = response.list[0];
    return new Weather(data.name, data.weather[0].main, data.weather[0].description, data.weather[0].icon, data.date, data.windSpeed, data.main.humidity); // Returns the data as in object
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] { // Creates the object and then pushing it into an array
    const forecastArray: Weather[] = [];
    const uniqueDays = new Set<string>();
    let todayAdded = false;

    weatherData.forEach((data: any) => {
      const dateText = data.dt_txt;
      const date = new Date(dateText).toDateString();

      const utcDateString = date.toString().split(" ").slice(0, 4).join(" ");

      if (data.dt_txt.includes("12:00:00") || (!todayAdded && new Date().toUTCString().split(" ").slice(0, 4).join(" ") === utcDateString)) {
        if (uniqueDays.size < 6 && !uniqueDays.has(date)) {
          const forecastEntry: Weather = {
            city: this.cityName,
            date: date,
            tempF: data.main.temp,
            iconDescription: data.weather[0].description,
            icon: data.weather[0].icon,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity,
          };

          if (new Date().toUTCString().split(" ").slice(0, 4).join(" ") === utcDateString) {
            todayAdded = true;
          }

          uniqueDays.add(date);
          forecastArray.push(forecastEntry);
        }
      }
    });

    if (!todayAdded && weatherData.length > 0) {
      const firstEntry = weatherData[0];
      const todayEntry: Weather = {
        city: this.cityName,
        date: new Date().toDateString(),
        tempF: firstEntry.main.temp,
        iconDescription: firstEntry.weather[0].description,
        icon: firstEntry.weather[0].icon,
        windSpeed: firstEntry.wind.speed,
        humidity: firstEntry.main.humidity,
      };

      forecastArray.unshift(todayEntry);
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list || []);
    return forecast;
  }
}

export default new WeatherService();
