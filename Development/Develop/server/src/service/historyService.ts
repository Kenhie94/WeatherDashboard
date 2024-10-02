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
    return (
      await fs.readFile("db/db.json"),
      {
        flag: "a+",
        encoding: "utf8",
      }
    );
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file: Done
  private async write(cities: City[]) {
    return await fs.writeFile("db/db.json", JSON.stringify(cities, null, "\t"));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    let parsedCities: City[];

    try {
      parsedCities = [].concat(JSON.parse(cities));
    } catch (err) {
      parsedCities = [];
    }

    return parsedCities;
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file: Done
  async addCity(city: string) {
    if (!city) {
      throw new Error("city cannot be blank");
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    if (id) {
      let parsedCities: City[] = [];

      try {
        parsedCities = await this.getCities();

        const cityIndex = parsedCities.findIndex((city) => city.id == id);

        if (cityIndex !== -1) {
          parsedCities.splice(cityIndex, 1);

          console.log(`City with id ${id} has been removed`);
          await this.write(parsedCities);
        } else {
          console.log(`City with id ${id} not found.`);
        }
      } catch (err) {
        console.error(`Error while removing the city:`, err);
      }
    } else {
      console.error("No id provided.");
    }
  }
}

export default new HistoryService();
