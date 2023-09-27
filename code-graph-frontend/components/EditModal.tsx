import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

type Project = {
  project_name: string;
  project_id: number;
  config_id: number;
};

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  project: Project;
  onEdit: (project: Project) => Promise<any>;
}

export default function EditModal(props: EditModalProps) {
  const initialFormData: Project = {
    project_name: props?.project?.project_name,
    project_id: props?.project?.project_id,
    config_id: props?.project?.config_id,
  };

  const [formData, setFormData] = useState<Project>(initialFormData);

  const handleFinish = async () => {
    try {
      await props.onEdit(formData);

      setFormData({
        project_name: "",
        project_id: 0,
        config_id: 0,
      });

      // Handle successful deletion
    } catch (error) {
      // Handle error
    }
  };

  function setClosed() {
    // clean form data

    setFormData({
      project_name: "",
      project_id: 0,
      config_id: 0,
    });

    props.handleClose();
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleInputChange");
    const { name, value } = event.target;
    setFormData({ ...props.project, [name]: value });
  };

  return (
    <Modal open={props.open} onClose={setClosed}>
      <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
        <p>Edit Project Data</p>
        <p>Project ID: {props?.project?.project_id}</p>
        <div className="w-fit mx-auto">
          <TextField
            name="project_name"
            label="Project Name"
            value={formData?.project_name || props?.project?.project_name}
            onChange={handleInputChange}
            variant="outlined"
            className="mb-2"
            fullWidth
          />
          <TextField
            name="project_id"
            label="Project ID"
            value={props?.project?.project_id}
            variant="outlined"
            className="mb-2"
            fullWidth
          />
          <TextField
            name="config_id"
            label="Config ID"
            value={props?.project?.config_id}
            variant="outlined"
            className="mb-2"
            fullWidth
          />
          <Button className="mx-2" variant="outlined" onClick={setClosed}>
            Cancel
          </Button>
          <Button className="mx-2" variant="contained" onClick={handleFinish}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
