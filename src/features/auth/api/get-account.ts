// import { api } from "@/src/lib/api";

// export type Account = {
//   id: string;
//   email: string;
//   role?: string;
//   name: string;
//   imageUrl?: string | null; // ✅avatar field
// };

// type MeResponse = {
//   id: string;
//   email: string;
//   role?: string;
//   name: string;
//   avatar?: string | null;
// };

// export async function fetchMe(): Promise<Account | null> {
//   try {
//     const response = await api<MeResponse>("/auth/me");
//     return {
//       id: response.id,
//       email: response.email,
//       role: response.role,
//       name: response.name,
//       imageUrl: response.avatar ?? null,
//     };
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

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
