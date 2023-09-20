import React, {useState} from "react";
import {Button} from "@mui/material";
import UploadModal from "@/components/UploadModal";
import LoadingModal from "@/components/LoadingModal";

export default function WelcomePage() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="content-center">
            <UploadModal open={open} handleClose={() => setOpen(false)} setLoading={() => setLoading(!loading)}/>
            <LoadingModal open={loading} />
            <h1 className="w-fit mx-auto my-20 text-2xl">Welcome to CodeGraph!</h1>
            <div className="w-fit mx-auto border rounded-2xl p-10 text-center">
                <p>Please upload a project</p>
                <Button variant="contained" className="my-5" component="label" onClick={() => setOpen(true)}>
                    Upload
                </Button>
{/*                <p>or</p>
                <Button variant="contained" component="label" className="my-5" onClick={() => uploadTestDataset()}>
                    Try it out
                </Button>*/}
            </div>
        </div>
    )
}