import {Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField} from "@mui/material";
import React from "react";
import {Code, DataPoint} from "@/components/CodeList";

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
    categoryList: DataPoint[],
    selectedCode: string,
    addCategory: (data: DataPoint) => void
}

export default function CategoryModal(props: CategoryModalProps) {
    const noneIndex = -1;
    const [checked, setChecked] = React.useState(noneIndex);
    const [disabled, setDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");

    function handleCheckboxChange(selectedLabel: number) {
        if(checked === selectedLabel) {
            setChecked(noneIndex);
        } else {
            setChecked(selectedLabel);
        }
        setDisabled(false);
    }

    function setClosed() {
        props.handleClose();
        setDisabled(true);
        setChecked(noneIndex);
        setInputValue("");
    }

    function pressAddButton() {
        const randomInt = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
        setClosed();
        if (inputValue !== ""){
            const newCategory: DataPoint = {
                id: randomInt,
                col1: inputValue,
            };
            props.addCategory(newCategory);
        }

    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setDisabled(false);
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
                            label="New Code"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-5">
                        <FormControl component="fieldset" >
                            <FormLabel component="legend">Add to Code</FormLabel>
                            <div className="overflow-auto h-[25vw] w-[15vw]">
                            <RadioGroup aria-label="Add to Code" name="add" value={"Add to Category"} >
                                <FormControlLabel
                                    value={noneIndex}
                                    control={<Radio />}
                                    label={"none"}
                                    key={noneIndex}
                                    checked={checked === noneIndex}
                                    onChange={() => handleCheckboxChange(noneIndex)}
                                />
                                {props.categoryList.map((value,index) =>
                                    <FormControlLabel
                                        value={value.id}
                                        control={<Radio />}
                                        label={value.col1}
                                        key={index}
                                        checked={checked === value.id}
                                        onChange={() => handleCheckboxChange(value.id)}
                                    />
                                )}
                            </RadioGroup>
                            </div>
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