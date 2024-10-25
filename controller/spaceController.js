import dotenv from "dotenv";
import axios from "axios";
import { Space } from "../models/index.js";



dotenv.config();

const getClickUpSpaces = async () => {
  try {    
    const TEAM_ID = process.env.CLICKUP_TEAM_ID;
    const BASE_URL = process.env.CLICKUP_BASE_URL;
    const response = await axios.get(
      `${BASE_URL}/api/v2/team/${TEAM_ID}/space?archived=false`,
      {
        headers: {
          Authorization: process.env.CLICKUP_AUTH_TOKEN, // Pass the API token from .env.local
        },
      }
    );
    return response.data.spaces;
  } catch (error) {
    throw new Error(
      `Error fetching spaces: ${
        error.response ? error.response.data.err : error.message
      }`
    );
  }
};

// Function to handle creating a new space in your application
export const createSpace = async (req, res) => {
  try {
    const spaces = await getClickUpSpaces(); // Fetch spaces from ClickUp
    const savedSpaces = await Promise.all(
        spaces.map(async (spaceData) => {
            const existingSpace = await Space.findOne({json_data: spaceData});
            console.log(spaceData.id)
            if (existingSpace) {
              console.log("Skipping existing space: " + spaceData.name);
              return existingSpace; // Return existing space if found
            } else {
              const space = new Space({
                space_id: spaceData.id,
                space_name: spaceData.name,
                json_data: spaceData
              });
              return await space.save(); // Save new space if not found
            }
        })
    );
    res.status(200).json({ message: "Spaces retrieved successfully", spaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpace = async (req, res) => {
  try {
    const spaces = await Space.find(); // Fetch all spaces from the database
    res.status(200).json({ message: "Spaces retrieved successfully", spaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
