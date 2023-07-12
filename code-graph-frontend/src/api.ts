import axios, { AxiosResponse } from 'axios';

// Define the base URL of your FastAPI server
const baseURL = 'http://localhost:8000';

// Define your API service methods
export const getCodes = (datasetName : string): Promise<any> => {
    console.log(`${baseURL}/annotations/${datasetName}`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/annotations-keys`);
}
