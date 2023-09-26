import React, { useState, useEffect } from "react";
import { getProjects } from "@/pages/api/api";
import Header from "@/components/Header";
import {Button,ButtonGroup} from "@mui/material";

type Project = {
  project_name: string;
  project_id: number;
  config_id: number;
};



export default function WelcomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProjects();
        let projectData: Project[] = result.data.data;
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="content-center">
      <Header title="Code View" />
      <h1 className="w-fit mx-auto my-20 text-2xl">Welcome to CodeGraph!</h1>
      <div>
        <h2>List of Projects:</h2>
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Project ID</th>
              <th>Config ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id}>
                <td>{project.project_name}</td>
                <td>{project.project_id}</td>
                <td>{project.config_id}</td>
                <td><Button>Dummy Button</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}
