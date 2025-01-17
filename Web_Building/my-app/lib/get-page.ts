// lib/get-page.ts
import { Data } from "@measured/puck";
import fs from "fs";
import path from "path";

export const getPage = (pagePath: string) => {
  try {
    const dbPath = path.join(process.cwd(), 'database.json');
    const allData: Record<string, Data> | null = fs.existsSync(dbPath)
      ? JSON.parse(fs.readFileSync(dbPath, "utf-8"))
      : null;

    return allData ? allData[pagePath] : null;
  } catch (error) {
    console.error('Error reading page data:', error);
    return null;
  }
};