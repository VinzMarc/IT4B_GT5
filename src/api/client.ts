import type { Claim, Item, User } from "../types";
import { useAuthStore } from "../store/authStore";

const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

const mockUsers: User[] = [
  { id: 1, name: "Jane Doe", email: "jane@example.com", role: "student" },
  { id: 2, name: "Sam Reyes", email: "sam@example.com", role: "student" },
  { id: 3, name: "Campus Security", email: "security@campus.edu", role: "staff" },
];

const mockItems: Item[] = [
  {
    id: 1,
    title: "Black backpack",
    description: "Found near the library entrance",
    location: "Library",
    type: "lost",
    reportedBy: "Jane Doe",
    reportedAt: "2026-10-20",
    isClaimed: false,
  },
  {
    id: 2,
    title: "Silver keychain",
    description: "Recovered in the engineering building",
    location: "Engineering building",
    type: "found",
    reportedBy: "Campus Security",
    reportedAt: "2026-10-21",
    isClaimed: false,
  },
];

const mockClaims: Claim[] = [];

function addMockItem(item: NewItem & { isClaimed?: boolean }): Item {
  const createdItem: Item = {
    ...item,
    id: Date.now(),
    reportedAt: new Date().toISOString().slice(0, 10),
    isClaimed: Boolean(item.isClaimed),
  };

  mockItems.unshift(createdItem);
  return createdItem;
}

function updateMockItem(itemId: number, updates: Partial<Item>): Item | undefined {
  const index = mockItems.findIndex((item) => item.id === itemId);
  if (index === -1) return undefined;

  const updatedItem = { ...mockItems[index], ...updates };
  mockItems[index] = updatedItem;
  return updatedItem;
}

function addMockClaim(claim: NewClaim & { requestedAt?: string; status?: Claim["status"] }): Claim {
  const createdClaim: Claim = {
    ...claim,
    id: Date.now(),
    requestedAt: claim.requestedAt ?? new Date().toISOString().slice(0, 10),
    status: claim.status ?? "pending",
  };

  mockClaims.unshift(createdClaim);
  return createdClaim;
}

export type NewItem = Omit<Item, "id" | "reportedAt" | "isClaimed">;
export type NewClaim = Omit<Claim, "id" | "requestedAt">;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      if (contentType.includes("application/json")) {
        const errorBody: unknown = await response.json();
        if (
          typeof errorBody === "object" &&
          errorBody !== null &&
          "message" in errorBody &&
          typeof errorBody.message === "string"
        ) {
          errorMessage = errorBody.message;
        }
      } else {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    if (!contentType.includes("application/json")) {
      const errorText = await response.text();
      throw new Error(errorText || `API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (path === "/items" || path.startsWith("/items/")) {
      const method = (options?.method ?? "GET").toUpperCase();

      if (method === "POST") {
        const payload = JSON.parse((options?.body as string) ?? "{}");
        return addMockItem(payload) as T;
      }

      if (method === "PATCH") {
        const payload = JSON.parse((options?.body as string) ?? "{}");
        const itemId = Number(path.split("/").filter(Boolean).at(-1));
        const updated = updateMockItem(itemId, payload);
        if (updated) return updated as T;
      }

      return mockItems as T;
    }
    if (path === "/claims" || path.startsWith("/claims/")) {
      const method = (options?.method ?? "GET").toUpperCase();

      if (method === "POST") {
        const payload = JSON.parse((options?.body as string) ?? "{}");
        return addMockClaim(payload) as T;
      }

      return mockClaims as T;
    }
    if (path === "/users") return mockUsers as T;
    throw error;
  }
}

export function loginUser(payload: { email: string; password: string }) {
  return request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: { name: string; email: string; password: string }) {
  return request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getItems(): Promise<Item[]> {
  return request<Item[]>("/items");
}

export function getItem(id: number): Promise<Item> {
  return request<Item>(`/items/${id}`);
}

export function getClaims(): Promise<Claim[]> {
  return request<Claim[]>("/claims");
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export function createItem(item: NewItem): Promise<Item> {
  const payload = {
    ...item,
    isClaimed: false,
  };

  return request<Item>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createClaim(claim: NewClaim): Promise<Claim> {
  return request<Claim>("/claims", {
    method: "POST",
    body: JSON.stringify(claim),
  });
}

export function markItemClaimed(item: Item): Promise<Item> {
  return request<Item>(`/items/${item.id}`, {
    method: "PATCH",
    body: JSON.stringify({ isClaimed: true }),
  });
}
