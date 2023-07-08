import {Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup} from "@mui/material";
import React from "react";

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
}

export default function CategoryModal(props: CategoryModalProps) {
    const [checked, setChecked] = React.useState("");

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
            >
                <div className="relative w-[50%] bg-white p-5 rounded-lg shadow mx-auto mt-[15rem]">
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Add to Category</FormLabel>
                        <RadioGroup aria-label="Add to Category" name="add" value={"Add to Category"} >
                            <FormControlLabel value="female" control={<Radio />} label="Female" checked={checked === "female"} onChange={() => setChecked("female")}/>
                            <FormControlLabel value="male" control={<Radio />} label="Male" checked={checked === "male"} onChange={() => setChecked("male")}/>
                            <FormControlLabel value="other" control={<Radio />} label="Other" checked={checked === "other"} onChange={() => setChecked("other")}/>
                        </RadioGroup>
                    </FormControl>
                    <Button className="absolute bottom-2 right-2" variant="outlined" onClick={props.handleClose}>Close</Button>
                </div>
            </Modal>
        </>
    )
}