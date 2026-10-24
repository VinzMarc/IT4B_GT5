import { useAuthStore } from "../src/store/authStore";
const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");
export async function askAI(prompt) {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/ai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt }),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error(errorText || `AI review request failed: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (!response.ok) {
        if (typeof result === "object" &&
            result !== null &&
            "message" in result &&
            typeof result.message === "string") {
            throw new Error(result.message);
        }
        throw new Error(`AI review request failed: ${response.status} ${response.statusText}`);
    }
    return result;
}
