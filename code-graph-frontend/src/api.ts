import axios, { AxiosResponse } from 'axios';

// Define the base URL of your FastAPI server
const baseURL = 'http://localhost:8000';

// Define your API service methods
export const getCodes = (datasetName : string): Promise<any> => {
    console.log(`${baseURL}/annotations/${datasetName}`)
    return axios.get<any>(`${baseURL}/annotations/${datasetName}`);
    
};

export const getUser = (userId: number): Promise<AxiosResponse<User>> => {
    return axios.get<User>(`${baseURL}/users/${userId}`);
};

export const createUser = (user: User): Promise<AxiosResponse<User>> => {
    return axios.post<User>(`${baseURL}/users`, user);
};

// Define your User type or interface
interface User {
    id: number;
    name: string;
    email: string;
    // ... add more properties as needed
}