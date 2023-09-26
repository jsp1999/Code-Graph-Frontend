import {Button, Modal} from "@mui/material";
import React from "react";

interface ConfirmModalProps {
    open: boolean,
    handleClose: () => void,
}

export default function ConfirmModal(props: ConfirmModalProps) {

    const handleFinish = () => {
        // Api call to delete project here
    }

    function setClosed() {
        props.handleClose();
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={setClosed}
            >
                <div className="w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10vh] grid-cols-1 text-center">
                <p>Do you want to delete this project?</p>
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
    )
}