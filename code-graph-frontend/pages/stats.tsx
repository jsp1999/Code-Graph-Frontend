import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Bubble, Pie } from "react-chartjs-2";
import { getCodeStats, getClusterStats, getProjectStats, getProjects } from "@/pages/api/api";
import { CodeSegmentsResponse, ProjectStatsResponse, ClusterStatsResponse } from "@/pages/api/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function StatsPage() {
  const [projectData, setProjectData] = useState<any>(null);

  const fetchAndUpdateStats = async () => {
    try {
      const projectsResponse: any = await getProjects();
      let projects = projectsResponse.data.data;
      let project_ids = projects.map((project: any) => project.project_id);
      let all_project_data = [];
      for (let i = 0; i < project_ids.length; i++) {
        const projectStatsResponse: ProjectStatsResponse = await getProjectStats(project_ids[i]);
        const clusterStatsResponse: ClusterStatsResponse = await getClusterStats(project_ids[i]);
        const codeStatsResponse: CodeSegmentsResponse = await getCodeStats(project_ids[i]);
        // merge project with stats
        let project_data = {
          project: projects[i],
          projectStats: projectStatsResponse,
          clusterStats: clusterStatsResponse,
          codeStats: codeStatsResponse,
        };
        all_project_data.push(project_data);
      }
      setProjectData(all_project_data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  useEffect(() => {
    fetchAndUpdateStats();
  }, []);

  const renderProjectBarCharts = () => {
    if (!projectData) return null;

    const barOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    const projectBarStats = {
      labels: projectData?.map((project: any) => `${project.project.project_id}: ${project.project.project_name}`),
      datasets: [
        {
          label: "Segment Count",
          data: projectData?.map((project: any) => project.projectStats.segment_count),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Dataset Count",
          data: projectData?.map((project: any) => project.projectStats.dataset_count),
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
          label: "Code Count",
          data: projectData?.map((project: any) => project.projectStats.code_count),
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Model Count",
          data: projectData?.map((project: any) => project.projectStats.model_count),
          backgroundColor: "rgb(255, 205, 86)",
        },
        {
          label: "Sentence Count",
          data: projectData?.map((project: any) => project.projectStats.sentence_count),
          backgroundColor: "rgb(201, 203, 207)",
        },
        {
          label: "Embedding Count",
          data: projectData?.map((project: any) => project.projectStats.embedding_count),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    };

    return (
      <div id="barChartContainer">
        <Bar options={barOptions} data={projectBarStats} />
      </div>
    );
  };

  const renderBubbleCharts = () => {
    if (!projectData) return null;

    return projectData.map((project: any, index: number) => {
      const labels = project.codeStats.code_segments_count.codes.map((code: any) => code.text);
      let data: any[] = [];
      for (let i = 0; i < project.codeStats.code_segments_count.codes.length; i++) {
        let code = project.codeStats.code_segments_count.codes[i];
        let codeData = {
          label: code.text,
          data: [
            {
              x: code.average_position.x,
              y: code.average_position.y,
              r: code.segment_count,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        };
        data.push(codeData);
      }

      const bubbleData = {
        labels: labels,
        datasets: data,
      };

      const bubbleOptions = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      return (
        <div key={index} className="bubble-chart">
          <Bubble options={bubbleOptions} data={bubbleData} />
        </div>
      );
    });
  };

  const renderPieCodeCharts = () => {
    if (!projectData) return null;

    return projectData.map((project: any, index: number) => {
      const labels = project.codeStats.code_segments_count.codes.map((code: any) => code.text);
      const data = project.codeStats.code_segments_count.codes.map((code: any) => code.segment_count);

      const pieData = {
        labels: labels,
        datasets: [
          {
            label: "Code Segment Count",
            data: data,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(201, 203, 207)",
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
            ],
          },
        ],
      };

      const pieOptions = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      return (
        <div key={index} className="pie-chart">
          <Pie options={pieOptions} data={pieData} />
        </div>
      );
    });
  };

  const renderPieClusterCharts = () => {
    if (!projectData) return null;

    return projectData.map((project: any, index: number) => {
      const labels = project.clusterStats.cluster_info.map((cluster: any) => cluster.cluster_value);
      const data = project.clusterStats.cluster_info.map((cluster: any) => cluster.segment_count);

      const pieData = {
        labels: labels,
        datasets: [
          {
            label: "Cluster Segment Count",
            data: data,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(201, 203, 207)",
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
            ],
          },
        ],
      };

      const pieOptions = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

      return (
        <div key={index} className="pie-chart">
          <Pie options={pieOptions} data={pieData} />
        </div>
      );
    });
  };

  return (
    <header>
      <Header title="Project stats" />
      <div className="bar-container">{renderProjectBarCharts()}</div>
      <div className="pie-container">{renderPieCodeCharts()}</div>
      <div className="bubble-container">{renderBubbleCharts()}</div>
      <div className="pie-container">{renderPieClusterCharts()}</div>
    </header>
  );
}
