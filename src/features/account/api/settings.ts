import { api } from "@/src/lib/api";
import type {
  SettingsResponse,
  UpdateSettingsSchema,
} from "../schemas/settings-schema";

export async function getSettings(): Promise<SettingsResponse> {
  try {
    const response = await api<SettingsResponse>("/me/settings", {
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to fetch settings", error);
    throw error;
  }
}

export async function updateSettings(
  data: UpdateSettingsSchema,
): Promise<SettingsResponse> {
  try {
    const response = await api<SettingsResponse>("/me/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to update settings", error);
    throw error;
  }
}
