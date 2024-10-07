import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  temperature: number;
  description: string;
  cityName: string;
  country: string;
  humidity: number;
  windSpeed: number;
  icon: string;
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
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query)
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error(`Unable to find location for city: ${this.cityName}`);
      }
      return data[0];
    } catch (err) {
      console.error("Error fetching location data:", err);
      throw err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return {lat, lon};
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/weather?`
      )
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {

  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

  }
}

export default new WeatherService();
