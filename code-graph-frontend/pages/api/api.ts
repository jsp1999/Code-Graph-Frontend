import axios from "axios";

// Define the base URL of your FastAPI server
const baseURL = "http://localhost:8000";
const datasetName = "few_nerd";

// Projects

export const getProjects = (): Promise<any> => {
  console.log(`${baseURL}/data/${datasetName}/projects/`);
  return axios.get<any>(`${baseURL}/projects/`);
};

export const getProject = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/`);
};

export const deleteProject = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/`);
  return axios.delete(`${baseURL}/projects/${project_id}/`);
};

export const updateProjectName = (project_id: number, projectName: string): Promise<any> => {
  console.log(projectName, "projectName");
  console.log(project_id, "project_id");
  return axios.put(`${baseURL}/projects/${project_id}/?project_name=${projectName}`);
};

export const updateProjectConfig = (project_id: number, config: number): Promise<any> => {
  return axios.put(`${baseURL}/projects/${project_id}/config=${config}`);
};

export const postProject = (projectName: string): Promise<any> => {
  console.log(`${baseURL}/projects/?project_name=${projectName}`);
  return axios.post(`${baseURL}/projects/?project_name=${projectName}`);
};

// Datasets
export const getDatasets = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/datasets/`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/datasets/`);
};

export const updateDataset = (project_id: number, dataset_id: number, datasetName: string): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/datasets/${dataset_id}/?dataset_name=${datasetName}`);
  return axios.put(`${baseURL}/projects/${project_id}/datasets/${dataset_id}/?dataset_name=${datasetName}`);
};

export const deleteDataset = (project_id: number, dataset_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/datasets/${dataset_id}`);
  return axios.delete(`${baseURL}/projects/${project_id}/datasets/${dataset_id}`);
};

export const uploadTestDataset = (): Promise<any> => {
  console.log(`${baseURL}/data/${datasetName}/codes/roots`);
  return axios.get<any>(`${baseURL}/projects/%7Bproject_id%7D/plots/test/`);
};

export const uploadDataset = (projectId: number, datasetName: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    `${baseURL}/projects/${projectId}/datasets/upload?dataset_name=${datasetName}&split=%5Ct&sentence_split=%5Cn%5Cn&word_idx=0&label_idx=1&label_split=-&type=plain`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const uploadAdvancedDataset = (
  projectId: number,
  datasetName: string,
  file: File,
  split: string,
  sentence_split: string,
  word_idx: number,
  label_idx: number,
  label_split: string,
  type: string,
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    `${baseURL}/projects/${projectId}/datasets/upload?dataset_name=${datasetName}&split=${split}&sentence_split${sentence_split}&word_idx=${word_idx}&label_idx=${label_idx}&label_split=${label_split}&type=${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// Codes

export const extractCodes = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/extract`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/extract`);
};

export const getCodesRoutes = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/`);
};

export const getCodeRoots = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/roots`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/roots`);
};

export const getCodeLeaves = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/leaves`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/leaves`);
};

export const getCodeTree = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/tree`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/tree`);
};

export const getCodeRoute = (id: number, project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/${id}`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/codes/${id}`);
};

export const updateCodeRoute = (
  id: number,
  codeName: string,
  topLevelCodeId: number,
  project_id: number,
): Promise<any> => {
  const body = {
    code: codeName,
    top_level_code_id: topLevelCodeId,
  };

  console.log(`${baseURL}/projects/${project_id}/codes/${id}`, body);
  return axios.put<any>(`${baseURL}/projects/${project_id}/codes/${id}`, body);
};

export const deleteCodeRoute = (id: number, project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/${id}`);
  return axios.delete(`${baseURL}/projects/${project_id}/codes/${id}`);
};

export const insertCodeRoute = (codeName: string, project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}`);
  return axios.post(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}`);
};

export const insertCodeRouteWithParent = (
  codeName: string,
  project_id: number,
  topLevelCodeId: number,
): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}&parent_id=${topLevelCodeId}`);
  return axios.post(`${baseURL}/projects/${project_id}/codes/?code_name=${codeName}&parent_id=${topLevelCodeId}`);
};

// Databases
export const initTables = (): Promise<any> => {
  console.log(`${baseURL}/databases/tables/init`);
  return axios.get<any>(`${baseURL}/databases/tables/init`);
};

export const getDatabaseInfos = (): Promise<any> => {
  console.log(`${baseURL}/databases/tables/infos`);
  return axios.get<any>(`${baseURL}/databases/tables/infos`);
};

export const deleteDatabaseTables = (): Promise<any> => {
  console.log(`${baseURL}/databases/tables`);
  return axios.delete(`${baseURL}/databases/tables`);
};

export const deleteDatabaseTable = (tableName: string): Promise<any> => {
  console.log(`${baseURL}/databases/${tableName}`);
  return axios.delete(`${baseURL}/databases/${tableName}`);
};

export const listFiles = (): Promise<any> => {
  console.log(`${baseURL}/databases/list-files`);
  return axios.get<any>(`${baseURL}/databases/list-files`);
};

export const downloadFile = (filePath: string) => {
  let filename: string = filePath.split("/").pop() || "";
  console.log(`${baseURL}/databases/download/${filePath}`);
  fetch(`${baseURL}/databases/download/${filePath}`, {
    method: "GET",
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
};

// Embeddings
export const getEmbeddings = (
  project_id: number,
  all: boolean,
  page: number,
  page_size: number,
  reduce_length: number,
): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/embeddings/?all=${all}&page=${page}&page_size=${page_size}`);
  return axios.get<any>(
    `${baseURL}/projects/${project_id}/embeddings/?all=${all}&page=${page}&page_size=${page_size}&reduce_length=${reduce_length}`,
  );
};

export const extractEmbeddings = (project_id: number): Promise<any> => {
  console.log(`${baseURL}/projects/${project_id}/embeddings/extract`);
  return axios.get<any>(`${baseURL}/projects/${project_id}/embeddings/extract`);
};
