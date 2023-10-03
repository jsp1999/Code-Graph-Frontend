import { Button, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    getCodeRoute, renameCode,
    updateCodeRoute
} from "@/pages/api/api";

interface RenameModalProps {
    open: boolean;
    handleClose: () => void;
    projectId: number;
    codeId: number;
    codeName: string;
    codeParentId: number | null;
}

export default function RenameModal(props: RenameModalProps) {
    const [codeName, setCodeName] = useState(props.codeName);

    function setClosed() {
        props.handleClose();
        setCodeName("");
    }

    function pressRenameButton() {
            try {
                renameCode(props.codeId, codeName, props.projectId, props.codeParentId).then(() => {
                    setClosed();
                    props.handleClose();
                    window.location.reload(); // Reload the page
                })
            } catch (e) {
                console.error("Error adding code:", e);
            }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCodeName(event.target.value);
    };

    return (
        <>
            <Modal open={props.open} onClose={setClosed}>
                <div className="relative w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10rem]">
                    <p>{`Rename Code "${props.codeName}"`}</p>
                    <div>
                        <TextField
                            className="w-[25rem]"
                            id="standard-basic"
                            label="New Code Name"
                            value={codeName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="block h-20" />
                    <div className="absolute bottom-2 right-2">
                        <Button className="mx-2" variant="outlined" onClick={setClosed}>
                            Cancel
                        </Button>
                        <Button className="mx-2 bg-blue-900" variant="contained" onClick={pressRenameButton}>
                            Rename
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
