import {Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField} from "@mui/material";
import React from "react";
import {getCategoryPoints} from "@/components/CategoryList";

interface Code {
    id: number;
    name: string;
    subcategories: {
        [key: string]: Code;
    };
}

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
    categories: {
        [key: string]: Code;
    },
}

export default function CategoryModal(props: CategoryModalProps) {
    const [checked, setChecked] = React.useState("");
    const categoryList = getCategoryPoints(props.categories);

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
            >
                <div className="relative w-[30%] bg-white p-5 rounded-lg shadow mx-auto mt-[10rem] ">
                    <div >
                        <TextField className="w-[25rem]" id="standard-basic" label="New Category" />
                    </div>
                    <div className="overflow-auto mt-8">
                        <FormControl component="fieldset" >
                            <FormLabel component="legend">Add to Category</FormLabel>
                            <RadioGroup aria-label="Add to Category" name="add" value={"Add to Category"} >
                                {categoryList.map((value,index) =>
                                    <FormControlLabel
                                        value={value.col1}
                                        control={<Radio />}
                                        label={value.col1}
                                        key={index}
                                        checked={checked === value.col1}
                                        onChange={() => setChecked(value.col1)}
                                    />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="absolute bottom-2 right-2" >
                        <Button className="mx-2" variant="outlined" onClick={props.handleClose}>
                            Close
                        </Button>
                        <Button className="mx-2 bg-blue-900" variant="contained" onClick={props.handleClose}>
                            Add
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}