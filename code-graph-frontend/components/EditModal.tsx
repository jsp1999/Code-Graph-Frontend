import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  projectId: number;
  projectName: string;
  configId: number;
  onEdit: (project_id: number, project_name: string) => Promise<any>;
}

export default function EditModal(props: EditModalProps) {
  const [formData, setFormData] = useState({
    project_name: props.projectName || "",
    project_id: props.projectId || "",
    config_id: props.configId || "",
  });

  const handleFinish = async () => {
    try {
      await props.onEdit(props.projectId, formData.project_name);
      // Handle successful deletion
    } catch (error) {
      // Handle error
    }
  };

  function setClosed() {
    props.handleClose();
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Modal open={props.open} onClose={setClosed}>
      <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
        <p>Edit Project Data</p>
        <p>Project ID: {props.projectId}</p>
        <div className="w-fit mx-auto">
          <TextField
            name="project_name"
            label="Project Name"
            value={formData.project_name || props.projectName}
            onChange={handleInputChange}
            variant="outlined"
            className="mb-2"
            fullWidth
          />
          <TextField
            name="project_id"
            label="Project ID"
            value={formData.project_id || props.projectId}
            onChange={handleInputChange}
            variant="outlined"
            className="mb-2"
            fullWidth
          />
          <TextField
            name="config_id"
            label="Config ID"
            value={formData.config_id || props.configId}
            onChange={handleInputChange}
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
