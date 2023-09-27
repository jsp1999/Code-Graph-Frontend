import { Button, Modal } from "@mui/material";
import React from "react";

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function EditModal(props: EditModalProps) {
  const handleFinish = () => {
    // Api call to edit project here
  };

  function setClosed() {
    props.handleClose();
  }

  return (
    <>
      <Modal open={props.open} onClose={setClosed}>
        <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
          <p>Edit your stuff here</p>
          <div className="w-fit mx-auto">
            <Button className="mx-2" variant="outlined" onClick={setClosed}>
              Cancel
            </Button>
            <Button className="mx-2" variant="contained" component="label" onClick={handleFinish}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
