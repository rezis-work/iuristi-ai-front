import { api } from "@/src/lib/api";

export type Account = {
  id: string;
  email: string;
  role?: string;
  name: string;
};

export async function fetchMe() {
  try {
    const responce = await api<Account>("auth/me");
    return responce;
  } catch (error) {
    console.error(error);
    return null;
  }
}
