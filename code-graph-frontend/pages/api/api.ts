import axios from 'axios';

// Define the base URL of your FastAPI server
const baseURL = 'http://localhost:8000';
const datasetName = "few_nerd";

// Define your API service methods
export const extractCodes = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/extract`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/extract`);
}

export const getCodesRoutes = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/`);
}

export const getCodeRoots = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/roots`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/roots`);
}

export const getCodeLeaves = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/leaves`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/leaves`);
}

export const getCodeTree = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/tree`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/tree`);
}

export const getCodeRoute = (id: number): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/${id}`)
    return axios.get<any>(`${baseURL}/data/${datasetName}/codes/${id}`);
}

export const updateCodeRoute = (id: number, codeName: string, topLevelCodeId: number): Promise<any> => {
    const body = {
        code: codeName,
        top_level_code_id: topLevelCodeId
    };

    console.log(`${baseURL}/data/${datasetName}/codes/${id} \n` + body)
    return axios.put<any>(`${baseURL}/data/${datasetName}/codes/${id}`, body);
}

export const deleteCodeRoute = (id: number): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/${id}`)
    return axios.delete<any>(`${baseURL}/data/${datasetName}/codes/${id}`);
}

export const insertCodeRoute = (codeName: string, topLevelCodeId?: number): Promise<any> => {
    const body = {
        code: codeName,
        top_level_code_id: topLevelCodeId ?? null
    };

    console.log(`${baseURL}/data/${datasetName}/codes/ \n` + body)
    return axios.post<any>(`${baseURL}/data/${datasetName}/codes/`, body);
}
