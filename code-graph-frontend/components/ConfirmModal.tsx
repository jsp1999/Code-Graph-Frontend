import { Button, Modal } from "@mui/material";
import React, {useEffect, useState} from "react";
import {deleteCodeRoute, getCodeRoute} from "@/pages/api/api";

interface ConfirmModalProps {
  open: boolean;
  handleClose: () => void;
  projectId: number;
  codeId: number;
  codeName: string
}

export default function ConfirmModal(props: ConfirmModalProps) {

  const handleFinish = () => {
    deleteCodeRoute(props.codeId, props.projectId).then(() => {
      props.handleClose();
      window.location.reload(); // Reload the page
    })
  };

  function setClosed() {
    props.handleClose();
  }

  return (
    <>
      <Modal open={props.open} onClose={setClosed}>
        <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
          <p>{`Do you want to delete Code "${props.codeName}"?`}</p>
          <div className="w-fit mx-auto mt-5">
            <Button className="mx-2" variant="outlined" onClick={setClosed}>
              No
            </Button>
            <Button className="mx-2" variant="contained" component="label" onClick={handleFinish}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
