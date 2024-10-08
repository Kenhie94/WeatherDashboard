import { Router, type Request, type Response } from "express";
const router = Router();

// import HistoryService from '../../service/historyService.js';
import historyService from "../../service/historyService.js";
// import WeatherService from '../../service/weatherService.js';
import weatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const city = req.body.cityName;
    console.log(req.body.cityName)

    if (!city || typeof city !== "string") {
      return res.status(400).json({ error: "City name is required and must be a string" });
    }

    // TODO: save city to search history
    const weatherData = await weatherService.getWeatherForCity(city);

    await historyService.addCity(city);
    return res.status(200).json(weatherData);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    return res.status(500).json({ err: "Failed to retrieve weather data" });
  }
});

// TODO: GET search history
router.get("/history", async (_req: Request, res: Response) => {
  try {
    const historyData = await historyService.getCities();

    res.status(200).json(historyData);
  } catch (err) {
    console.error("Error fetching search history:", err);
    res.status(500).json({ err: "Failed to retrieve search history" });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required.' });
    }

    const citiesBeforeDeletion = await historyService.getCities();
    await historyService.removeCity(id);
    const citiesAfterDeletion = await historyService.getCities();

    if (citiesBeforeDeletion.length === citiesAfterDeletion.length) {
      return res.status(404).json({ error: `City with ID ${id} not found.` });
    }

    return res.status(200).json({ message: `City with ID ${id} has been removed.` });
  } catch (error) {
    console.error("Error deleting city from search history:", error);
    return res.status(500).json({ error: "Failed to delete city from search history." });
  }
});

export default router;
