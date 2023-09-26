import React, { useState, useEffect } from "react";
import { getProjects, postProject, uploadAdvancedDataset, uploadDataset, uploadTestDataset } from "@/pages/api/api";
import Header from "@/components/Header";

export default function WelcomePage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProjects();
        let projectData = result.data.data;
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="content-center">
      <Header title="Code View"/>

      <h1 className="w-fit mx-auto my-20 text-2xl">Welcome to CodeGraph!</h1>
      <div>
        <h2>List of Projects:</h2>
        <ul>
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.project_id}>
                <ul>
                  {Object.entries(project).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li>No projects to display.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
