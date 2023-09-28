import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

type Config = {
  name: string;
  config: {
    name: string;
    embedding_config: {
      args: {
        pretrained_model_name_or_path: string;
      };
      model_name: string;
    };
    reduction_config: {
      args: {
        n_neighbors: number;
        n_components: number;
        metric: string;
        random_state: number;
        n_jobs: number;
      };
      model_name: string;
    };
    cluster_config: {
      args: {
        min_cluster_size: number;
        metric: string;
        cluster_selection_method: string;
      };
      model_name: string;
    };
    model_type: string;
  };
  config_id: number;
  project_id: number;
  project_name: string;
};

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  config: Config;
  onEdit: (project: Config) => Promise<any>;
}

export default function EditModal(props: EditModalProps) {
  const initialFormData: Config = {
    name: props?.config?.name,
    config_id: props?.config?.config_id,
    project_id: props?.config?.project_id,
    project_name: props?.config?.project_name,
    config: {
      name: props?.config?.config?.name,
      embedding_config: {
        args: {
          pretrained_model_name_or_path: props?.config?.config?.embedding_config?.args?.pretrained_model_name_or_path,
        },
        model_name: props?.config?.config?.embedding_config?.model_name,
      },
      reduction_config: {
        args: {
          n_neighbors: props?.config?.config?.reduction_config?.args?.n_neighbors,
          n_components: props?.config?.config?.reduction_config?.args?.n_components,
          metric: props?.config?.config?.reduction_config?.args?.metric,
          random_state: props?.config?.config?.reduction_config?.args?.random_state,
          n_jobs: props?.config?.config?.reduction_config?.args?.n_jobs,
        },
        model_name: props?.config?.config?.reduction_config?.model_name,
      },
      cluster_config: {
        args: {
          min_cluster_size: props?.config?.config?.cluster_config?.args?.min_cluster_size,
          metric: props?.config?.config?.cluster_config?.args?.metric,
          cluster_selection_method: props?.config?.config?.cluster_config?.args?.cluster_selection_method,
        },
        model_name: props?.config?.config?.cluster_config?.model_name,
      },
      model_type: props?.config?.config?.model_type,
    },
  };

  const [formData, setFormData] = useState<Config>(initialFormData);

  const handleFinish = async (newbody: any) => {
    try {
      await props.onEdit(newbody);

      setFormData({
        name: "",
        config_id: 0,
        project_id: 0,
        project_name: "",
        config: {
          name: "",
          embedding_config: {
            args: {
              pretrained_model_name_or_path: "",
            },
            model_name: "",
          },
          reduction_config: {
            args: {
              n_neighbors: 0,
              n_components: 0,
              metric: "",
              random_state: 0,
              n_jobs: 0,
            },
            model_name: "",
          },
          cluster_config: {
            args: {
              min_cluster_size: 0,
              metric: "",
              cluster_selection_method: "",
            },
            model_name: "",
          },
          model_type: "",
        },
      });
    } catch (error) {
      // Handle error
    }
  };

  function setClosed() {
    props.handleClose();
  }

  const handleSave = () => {
    let oldFormData = initialFormData;
    if (!formData) {
      setClosed();
    }
    if (formData.name != "") {
      oldFormData.name = formData.name;
    }
    if (formData.config.model_type != undefined && formData.config.model_type != "") {
      oldFormData.config.model_type = formData.config.model_type;
    }
    if (formData.config.embedding_config.args.pretrained_model_name_or_path != "") {
      oldFormData.config.embedding_config.args.pretrained_model_name_or_path =
        formData.config.embedding_config.args.pretrained_model_name_or_path;
    }
    setFormData(oldFormData);

    handleFinish(oldFormData);

    setClosed();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "pretrained_model_name_or_path":
        setFormData({
          ...formData,
          config: {
            ...formData.config,
            embedding_config: {
              ...formData.config.embedding_config,
              args: { pretrained_model_name_or_path: value },
            },
          },
        });

        break;
      case "model_type":
        setFormData({ ...formData, config: { ...formData.config, model_type: value } });

        break;
      default:
        setFormData({ ...formData, name: value });

        break;
    }
  };

  return (
    <Modal open={props.open} onClose={setClosed}>
      <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
        <p>Edit Config</p>
        <p>Config ID: {props?.config?.config_id}</p>
        <TextField
          name="name"
          label="Config Name"
          value={formData?.name || props?.config?.name}
          onChange={handleInputChange}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="project_name"
          label="Project Name"
          value={props?.config?.project_name}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="config_name"
          label="Config Name"
          value={props?.config?.config?.name}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="model_type"
          label="Model Type"
          value={formData?.config?.model_type || props?.config?.config?.model_type}
          onChange={handleInputChange}
          variant="outlined"
          className="mb-2"
          fullWidth
        />

        {/* all config properties */}
        <p>embedding_config</p>
        <TextField
          name="embedding_config"
          label="embedding_config"
          value={props?.config?.config?.embedding_config?.model_name}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="pretrained_model_name_or_path"
          label="pretrained_model_name_or_path"
          value={
            formData?.config?.embedding_config?.args?.pretrained_model_name_or_path ||
            props?.config?.config?.embedding_config?.args?.pretrained_model_name_or_path
          }
          onChange={handleInputChange}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <p>reduction_config</p>
        <TextField
          name="reduction_config"
          label="reduction_config"
          value={props?.config?.config?.reduction_config?.model_name}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="n_neighbors"
          label="n_neighbors"
          value={props?.config?.config?.reduction_config?.args?.n_neighbors}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="n_components"
          label="n_components"
          value={props?.config?.config?.reduction_config?.args?.n_components}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="metric"
          label="metric"
          value={props?.config?.config?.reduction_config?.args?.metric}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="random_state"
          label="random_state"
          value={props?.config?.config?.reduction_config?.args?.random_state}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="n_jobs"
          label="n_jobs"
          value={props?.config?.config?.reduction_config?.args?.n_jobs}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <p>cluster_config</p>
        <TextField
          name="cluster_config"
          label="cluster_config"
          value={props?.config?.config?.cluster_config?.model_name}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="min_cluster_size"
          label="min_cluster_size"
          value={props?.config?.config?.cluster_config?.args?.min_cluster_size}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="metric"
          label="metric"
          value={props?.config?.config?.cluster_config?.args?.metric}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="cluster_selection_method"
          label="cluster_selection_method"
          value={props?.config?.config?.cluster_config?.args?.cluster_selection_method}
          variant="outlined"
          className="mb-2"
          fullWidth
        />
        <Button variant="contained" className="my-5" component="label" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" className="my-5" component="label" onClick={setClosed}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
