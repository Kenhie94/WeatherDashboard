import { Router, type Request, type Response } from "express";
const router = Router();

// import HistoryService from '../../service/historyService.js';
import historyService from "../../service/historyService";
// import WeatherService from '../../service/weatherService.js';
import weatherService from "../../service/weatherService";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const { city } = req.body;

    if (!city || typeof city !== "string") {
      return res.status(400).json({ error: "City name is required and must be a string" });
    }

    // TODO: save city to search history
    const weatherData = await weatherService.getWeatherForCity(city);

    await historyService.addCity(city);
    res.status(200).json(weatherData);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    res.status(500).json({ err: "Failed to retrieve weather data" });
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
router.delete("/history/:id", async (req: Request, res: Response) => {});

export default router;
