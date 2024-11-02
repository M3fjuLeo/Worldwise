import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "GET") {
    // Wczytaj dane z pliku JSON
    const data = JSON.parse(
      readFileSync(path.join(process.cwd(), "data", "cities.json"), "utf-8")
    );
    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
