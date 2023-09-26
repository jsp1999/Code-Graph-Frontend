import axios from 'axios';

// Define the base URL of your FastAPI server
const baseURL = 'http://localhost:8000';
const datasetName = "few_nerd";

// Projects

export const getProjects = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/projects/`)
    return axios.get<any>(`${baseURL}/projects/`);
}

export const getProject = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/`);
}

export const deleteProject = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/`)
    return axios.delete(`${baseURL}/projects/${project_id}/`);
}

export const updateProject = (project_id: number, projectName: string): Promise<any> => {
    const body = {
        project_name: projectName
    };

    console.log(`${baseURL}/projects/${project_id}/`, body)
    return axios.put<any>(`${baseURL}/projects/${project_id}/`, body);
}

export const postProject = (projectName: string): Promise<any> => {

    console.log(`${baseURL}/projects/?project_name=${projectName}` )
    return axios.post(`${baseURL}/projects/?project_name=${projectName}`);
}


// Datasets

export const uploadTestDataset = (): Promise<any> => {
    console.log(`${baseURL}/data/${datasetName}/codes/roots`)
    return axios.get<any>(`${baseURL}/projects/%7Bproject_id%7D/plots/test/`);
}


export const uploadDataset = (projectId: number, datasetName: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${baseURL}/projects/${projectId}/datasets/upload?dataset_name=${datasetName}&split=%5Ct&sentence_split=%5Cn%5Cn&word_idx=0&label_idx=1&label_split=-&type=plain`,
        formData,
        {
        headers: {
            'Content-Type': 'multipart/form-data',
        },});
}

export const uploadAdvancedDataset = (projectId: number, datasetName: string, file: File, split: string, sentence_split: string, word_idx: number, label_idx: number, label_split: string, type: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${baseURL}/projects/${projectId}/datasets/upload?dataset_name=${datasetName}&split=${split}&sentence_split${sentence_split}&word_idx=${word_idx}&label_idx=${label_idx}&label_split=${label_split}&type=${type}`,
        formData,
        {
        headers: {
            'Content-Type': 'multipart/form-data',
        },});
}


// Codes


export const extractCodes = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/extract`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/extract`);
}

export const getCodesRoutes = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/`);
}

export const getCodeRoots = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/roots`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/roots`);
}

export const getCodeLeaves = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/leaves`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/leaves`);
}

export const getCodeTree = (project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/tree`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/tree`);
}

export const getCodeRoute = (id: number, project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/${id}`)
    return axios.get<any>(`${baseURL}/projects/${project_id}/codes/${id}`);
}

export const updateCodeRoute = (id: number, codeName: string, topLevelCodeId: number, project_id: number): Promise<any> => {
    const body = {
        code: codeName,
        top_level_code_id: topLevelCodeId
    };

    console.log(`${baseURL}/projects/${project_id}/codes/${id}`, body)
    return axios.put<any>(`${baseURL}/projects/${project_id}/codes/${id}`, body);
}

export const deleteCodeRoute = (id: number, project_id: number): Promise<any> => {
    console.log(`${baseURL}/projects/${project_id}/codes/${id}`)
    return axios.delete(`${baseURL}/projects/${project_id}/codes/${id}`);
}

export const insertCodeRoute = (codeName: string, project_id: number): Promise<any> => {

    console.log(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}`)
    return axios.post(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}`);
}

export const insertCodeRouteWithParent = (codeName: string, project_id: number, topLevelCodeId: number): Promise<any> => {

    console.log(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}&parent_id=${topLevelCodeId}`)
    return axios.post(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}&parent_id=${topLevelCodeId}`);
}
