import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
// TODO: Define a City class with name and id properties: Done
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class: Done
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file: Done
  private async read() {
    return await fs.readFile("db/db.json", {
      flag: "a+",
      encoding: "utf8",
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file: Done
  // Takes that new City object and writes it into db.json and saves it. Also formating it to look like normal JSON format.
  private async write(cities: City[]) {
    return await fs.writeFile("db/db.json", JSON.stringify(cities, null, "\t"));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects: Done
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the db.json file: Done
  // Creates a new City object with name and id.
  async addCity(city: string) {
    if (!city) {
      throw new Error("city cannot be blank");
    }

    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((existingCity) => existingCity.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCity) => this.write(updatedCity))
      .then(() => newCity);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the db.json file: Done
  // Filter out a city w/ the unique city.id
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
