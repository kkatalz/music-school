import axios, { type AxiosResponse } from "axios";
import type { LoginCredentials } from "./auth.types";
import type { AuthResponse } from "./auth.types";

export const loginUser = async(credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axios.post(
        "/api/auth/login",
        credentials
    )
    return response.data;
}