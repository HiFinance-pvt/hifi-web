import type { Axios } from "axios";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
}

export class Profile {
  constructor(private readonly axios: Axios) {}

  async getProfile(): Promise<UserProfile> {
    const response = await this.axios.get<UserProfile>("/profile");
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await this.axios.put<UserProfile>("/profile", data);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    
    const response = await this.axios.post<{ url: string }>("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
} 