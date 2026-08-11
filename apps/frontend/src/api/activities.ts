import { apiClient } from "./client";
import type { Activity } from "../types/activity";

export const getActivities = async (theme?: string, ageGroup?: string): Promise<Activity[]> => {
    const { data } = await apiClient.get('/activities', {
        params: { theme, ageGroup }
    });
    return data;
};

export const createActivity = async (activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> => {
    const { data } = await apiClient.post('/activities', activity);
    return data;
};
