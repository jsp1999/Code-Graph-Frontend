import {Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField} from "@mui/material";
import React from "react";
import {getCategoryPoints} from "@/components/CategoryList";
import {Code, DataPoint} from "@/components/CodeList";

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
    categories: {
        [key: string]: Code;
    },
    selectedCode: string,
    addCategory: (data: DataPoint) => void
}

export default function CategoryModal(props: CategoryModalProps) {
    const [checked, setChecked] = React.useState("");
    const categoryList = getCategoryPoints(props.categories);
    const [disabled, setDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");

    function handleCheckboxChange(selectedLabel: string) {
        setChecked(selectedLabel);
        setDisabled(false);
        setInputValue("");
    }

    function setClosed() {
        props.handleClose();
        setDisabled(true);
        setChecked("");
        setInputValue("");
    }

    function pressAddButton() {
        const randomInt = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
        setClosed();
        const item = Object.values(props.categories).find(item => item.name === props.selectedCode);
            const newCategory: DataPoint = {
                id: randomInt,
                col1: inputValue,
            };
            props.addCategory(newCategory);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setDisabled(false);
        setChecked("");
    };

    return (
        <>
            <Modal
                open={props.open}
                onClose={setClosed}
            >
                <div className="relative w-[30%] bg-white p-5 rounded-lg shadow mx-auto mt-[10rem] ">
                    <div >
                        <TextField
                            className="w-[25rem]"
                            id="standard-basic"
                            label="New Category"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
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
                                        checked={checked === value.col1 && !disabled}
                                        onChange={() => handleCheckboxChange(value.col1)}
                                    />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="absolute bottom-2 right-2" >
                        <Button className="mx-2" variant="outlined" onClick={setClosed}>
                            Cancel
                        </Button>
                        <Button disabled={disabled} className="mx-2 bg-blue-900" variant="contained" onClick={pressAddButton}>
                            Add
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}