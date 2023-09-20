import {Button, Modal, TextField} from "@mui/material";
import React, {useState} from "react";
import {getProjects, postProject, uploadDataset, uploadTestDataset} from "@/pages/api/api";
import {useRouter} from "next/router";

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
}

export default function UploadModal(props: CategoryModalProps) {
    const [disabled, setDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setDisabled(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            // Here, you can store the selectedFile in your project or send it to an API.
            console.log('Selected File:', selectedFile);
            // You can use fetch or an API library to send the file to your backend API.
        }
    };

    const handleFinish = () => {
        postProject(inputValue)
            .then(() =>
                getProjects().then((response) => {
                        if(response.data.length > 0) {
                            const project = response.data.find((project: any) => project.project_name === inputValue);
                            uploadDataset(project.project_id, inputValue, selectedFile!).then((response) =>
                                router.push(`/codeView?project_id=${project.project_id}`)
                            )
                        }
                })
            )
    }

    function setClosed() {
        props.handleClose();
        setDisabled(true);
        setInputValue("");
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={setClosed}
            >
                <div className="relative w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[20vh] grid-cols-1 text-center">
                    <div className="my-5">
                        <TextField
                        className="w-[25rem]"
                        id="standard-basic"
                        label="Project Name"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div className="mt-10 mb-20 w-fit mx-auto">
                        <form onSubmit={handleSubmit}>
                            <Button variant="contained" component="label">
                                Upload
                                <input hidden accept=".txt" type="file" onChange={handleFileChange}/>
                            </Button>
                        </form>
                        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                    </div>
                    <div className="absolute bottom-3 right-3 w-fit mx-auto">
                        <Button className="mx-2" variant="outlined" onClick={setClosed}>
                            Cancel
                        </Button>
                        <Button className="mx-2" variant="contained" component="label" onClick={handleFinish} disabled={!(inputValue != "" && selectedFile != null)}>
                            Submit
                        </Button>
                    </div>

                </div>
            </Modal>
        </>
    )
}