import {Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField} from "@mui/material";
import React, {useEffect} from "react";
import {getCodesRoutes, insertCodeRoute} from "@/pages/api/api";

interface CategoryModalProps {
    open: boolean,
    handleClose: () => void,
    selectedCode: string,
}

export default function CategoryModal(props: CategoryModalProps) {
    const noneIndex = -1;
    const [checked, setChecked] = React.useState(noneIndex);
    const [disabled, setDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");
    const [codeList, setCodeList] = React.useState<any[]>([]);

    useEffect(() => {
        getCodesRoutes()
            .then(response => {
                setCodeList(response.data.codes);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
        if (checked == noneIndex){
            try {
                insertCodeRoute(inputValue);
            } catch (e) {
                console.error('Error adding code:', e);
            }
        }
        setClosed();
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
                            {codeList.map((code) =>
                                    <FormControlLabel
                                        value={code.id}
                                        control={<Radio />}
                                        label={code.code}
                                        key={code.id}
                                        checked={checked === code.id}
                                        onChange={() => handleCheckboxChange(code.id)}
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