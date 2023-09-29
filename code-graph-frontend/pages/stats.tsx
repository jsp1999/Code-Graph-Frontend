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
} from "chart.js";
import { Bar, Bubble } from "react-chartjs-2";
import { getCodeStats, getClusterStats, getProjectStats, getProjects } from "@/pages/api/api";
import { CodeSegmentsResponse, ProjectStatsResponse, ClusterStatsResponse } from "@/pages/api/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

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

  /* projectData =
  [
    {
        "project": {
            "project_name": "Test",
            "project_id": 1,
            "config_id": 1
        },
        "projectStats": {
            "project_id": 1,
            "project_name": "Test",
            "dataset_count": 1,
            "code_count": 12,
            "model_count": 3,
            "sentence_count": 8,
            "segment_count": 21,
            "embedding_count": 21
        },
        "clusterStats": {
            "project_name": "Test",
            "project_id": 1,
            "cluster_count": 21,
            "unique_cluster_count": 3,
            "cluster_info": [
                {
                    "cluster_value": -1,
                    "segment_count": 2
                },
                {
                    "cluster_value": 0,
                    "segment_count": 14
                },
                {
                    "cluster_value": 1,
                    "segment_count": 5
                }
            ]
        },
        "codeStats": {
            "code_segments_count": {
                "codes": [
                    {
                        "code_id": 1,
                        "text": "event",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 2,
                        "text": "sportsevent",
                        "segment_count": 2,
                        "average_position": {
                            "x": 9.721690654754639,
                            "y": 18.97047710418701
                        }
                    },
                    {
                        "code_id": 3,
                        "text": "organization",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 4,
                        "text": "government/governmentagency",
                        "segment_count": 3,
                        "average_position": {
                            "x": 11.164415041605631,
                            "y": 16.578193028767902
                        }
                    },
                    {
                        "code_id": 5,
                        "text": "location",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 6,
                        "text": "bodiesofwater",
                        "segment_count": 1,
                        "average_position": {
                            "x": 10.937938690185547,
                            "y": 15.971348762512207
                        }
                    },
                    {
                        "code_id": 7,
                        "text": "art",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 8,
                        "text": "music",
                        "segment_count": 2,
                        "average_position": {
                            "x": 8.695051670074463,
                            "y": 16.677120208740234
                        }
                    },
                    {
                        "code_id": 9,
                        "text": "product",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 10,
                        "text": "weapon",
                        "segment_count": 11,
                        "average_position": {
                            "x": 8.686819726770574,
                            "y": 18.021725741299715
                        }
                    },
                    {
                        "code_id": 11,
                        "text": "person",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 12,
                        "text": "athlete",
                        "segment_count": 2,
                        "average_position": {
                            "x": 10.067079544067383,
                            "y": 16.21859073638916
                        }
                    }
                ]
            }
        }
    },
    {
        "project": {
            "project_name": "Test",
            "project_id": 2,
            "config_id": 2
        },
        "projectStats": {
            "project_id": 2,
            "project_name": "Test",
            "dataset_count": 1,
            "code_count": 12,
            "model_count": 3,
            "sentence_count": 8,
            "segment_count": 21,
            "embedding_count": 21
        },
        "clusterStats": {
            "project_name": "Test",
            "project_id": 2,
            "cluster_count": 21,
            "unique_cluster_count": 3,
            "cluster_info": [
                {
                    "cluster_value": -1,
                    "segment_count": 2
                },
                {
                    "cluster_value": 0,
                    "segment_count": 14
                },
                {
                    "cluster_value": 1,
                    "segment_count": 5
                }
            ]
        },
        "codeStats": {
            "code_segments_count": {
                "codes": [
                    {
                        "code_id": 13,
                        "text": "event",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 14,
                        "text": "sportsevent",
                        "segment_count": 2,
                        "average_position": {
                            "x": 9.721690654754639,
                            "y": 18.97047710418701
                        }
                    },
                    {
                        "code_id": 15,
                        "text": "organization",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 16,
                        "text": "government/governmentagency",
                        "segment_count": 3,
                        "average_position": {
                            "x": 11.164415041605631,
                            "y": 16.578193028767902
                        }
                    },
                    {
                        "code_id": 17,
                        "text": "location",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 18,
                        "text": "bodiesofwater",
                        "segment_count": 1,
                        "average_position": {
                            "x": 10.937938690185547,
                            "y": 15.971348762512207
                        }
                    },
                    {
                        "code_id": 19,
                        "text": "art",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 20,
                        "text": "music",
                        "segment_count": 2,
                        "average_position": {
                            "x": 8.695051670074463,
                            "y": 16.677120208740234
                        }
                    },
                    {
                        "code_id": 21,
                        "text": "product",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 22,
                        "text": "weapon",
                        "segment_count": 11,
                        "average_position": {
                            "x": 8.686819726770574,
                            "y": 18.021725741299715
                        }
                    },
                    {
                        "code_id": 23,
                        "text": "person",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 24,
                        "text": "athlete",
                        "segment_count": 2,
                        "average_position": {
                            "x": 10.067079544067383,
                            "y": 16.21859073638916
                        }
                    }
                ]
            }
        }
    },
    {
        "project": {
            "project_name": "Test",
            "project_id": 3,
            "config_id": 3
        },
        "projectStats": {
            "project_id": 3,
            "project_name": "Test",
            "dataset_count": 1,
            "code_count": 12,
            "model_count": 3,
            "sentence_count": 8,
            "segment_count": 21,
            "embedding_count": 21
        },
        "clusterStats": {
            "project_name": "Test",
            "project_id": 3,
            "cluster_count": 21,
            "unique_cluster_count": 3,
            "cluster_info": [
                {
                    "cluster_value": -1,
                    "segment_count": 2
                },
                {
                    "cluster_value": 0,
                    "segment_count": 14
                },
                {
                    "cluster_value": 1,
                    "segment_count": 5
                }
            ]
        },
        "codeStats": {
            "code_segments_count": {
                "codes": [
                    {
                        "code_id": 25,
                        "text": "event",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 26,
                        "text": "sportsevent",
                        "segment_count": 2,
                        "average_position": {
                            "x": 9.721690654754639,
                            "y": 18.97047710418701
                        }
                    },
                    {
                        "code_id": 27,
                        "text": "organization",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 28,
                        "text": "government/governmentagency",
                        "segment_count": 3,
                        "average_position": {
                            "x": 11.164415041605631,
                            "y": 16.578193028767902
                        }
                    },
                    {
                        "code_id": 29,
                        "text": "location",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 30,
                        "text": "bodiesofwater",
                        "segment_count": 1,
                        "average_position": {
                            "x": 10.937938690185547,
                            "y": 15.971348762512207
                        }
                    },
                    {
                        "code_id": 31,
                        "text": "art",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 32,
                        "text": "music",
                        "segment_count": 2,
                        "average_position": {
                            "x": 8.695051670074463,
                            "y": 16.677120208740234
                        }
                    },
                    {
                        "code_id": 33,
                        "text": "product",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 34,
                        "text": "weapon",
                        "segment_count": 11,
                        "average_position": {
                            "x": 8.686819726770574,
                            "y": 18.021725741299715
                        }
                    },
                    {
                        "code_id": 35,
                        "text": "person",
                        "segment_count": 0,
                        "average_position": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    {
                        "code_id": 36,
                        "text": "athlete",
                        "segment_count": 2,
                        "average_position": {
                            "x": 10.067079544067383,
                            "y": 16.21859073638916
                        }
                    }
                ]
            }
        }
    }
]
*/

  useEffect(() => {
    fetchAndUpdateStats();
  }, []);

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

  return (
    <header>
      <Header title="Project stats" />
      <div id="barChartContainer">
        <Bar options={barOptions} data={projectBarStats} />
      </div>
      <div className="bubble-container">{renderBubbleCharts()}</div>
    </header>
  );
}
