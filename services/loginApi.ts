import BASE_URL from "../constants/config";

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json(); // Assuming backend sends token and user data
    return data; // { token, user }
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
