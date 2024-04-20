import { API } from "@/constant/api";

export const GET_ALL_APPS = async () => {
    try {
        const response = await fetch(API.GET_ALL_APPS);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const GET_ALL_EXPERTS = async () => {
    try {
        const response = await fetch(API.GET_ALL_EXPERTS);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const SIGN_IN = async (payload: any) => {
    try {
        const response = await fetch(API.SIGN_IN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const CREATE_EXPERT = async (payload: any) => {
    try {
        const response = await fetch(API.CREATE_EXPERT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log(data);
        
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};