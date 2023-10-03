import { Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import {getCodesRoutes, insertCodeRoute, insertCodeRouteWithParent, mergeCodes} from "@/pages/api/api";

interface MergeModalProps {
    open: boolean;
    handleClose: () => void;
    projectId: number;
    setLoading: () => void;
}

export default function MergeModal(props: MergeModalProps) {
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [disabled, setDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");
    const [codeList, setCodeList] = React.useState<any[]>([]);

    useEffect(() => {
        getCodesRoutes(props.projectId)
            .then((response) => {
                setCodeList(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    function handleCheckboxChange(selectedLabel: number) {
        const updatedSelectedIds = [...selectedIds];
        const index = updatedSelectedIds.indexOf(selectedLabel);

        if (index === -1) {
            updatedSelectedIds.push(selectedLabel);
        } else {
            updatedSelectedIds.splice(index, 1);
        }

        setSelectedIds(updatedSelectedIds);
        setDisabled(updatedSelectedIds.length < 2 || inputValue === "");
    }

    function setClosed() {
        props.handleClose();
        setDisabled(true);
        setSelectedIds([]);
        setInputValue("");
    }

    function pressMergeButton() {
        if (selectedIds.length < 2) {
            console.error("Select at least two codes to merge.");
            return;
        }

        try {
            props.setLoading();
            mergeCodes(props.projectId, selectedIds, inputValue).then(() => {
                    setClosed();
                    props.handleClose();
                    props.setLoading();
                }
            )
        } catch (e) {
            console.error("Error adding code:", e);
        }
    }

    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredCodeList = codeList.filter((code) =>
        code.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setDisabled(selectedIds.length < 2 || inputValue === "");
    };

    useEffect(() => {
        if (!props.open) {
            setSearchQuery('');
        }
    }, [props.open]);

    return (
        <>
            <Modal open={props.open} onClose={setClosed}>
                <div className="relative w-fit bg-white p-5 rounded-lg shadow mx-auto mt-[10rem]">
                    <div>
                        <TextField
                            className="w-[25rem]"
                            id="standard-basic"
                            label="New Code"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-5 w-fit mx-auto">
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Merge Codes</FormLabel>
                            <div className="overflow-auto h-[25vw]">
                                <TextField
                                    className="w-[25rem]"
                                    id="search"
                                    label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                                <RadioGroup aria-label="Merge Codes" name="add" value={"Merge"}>
                                    {filteredCodeList != null &&
                                        filteredCodeList.map((code) => (
                                            <FormControlLabel
                                                value={code.code_id}
                                                control={<Radio />}
                                                label={code.text}
                                                key={code.code_id}
                                                checked={selectedIds.includes(code.code_id)}
                                                onChange={() => handleCheckboxChange(code.code_id)}
                                            />
                                        ))}
                                </RadioGroup>
                            </div>
                        </FormControl>
                    </div>
                    <div className="block h-20" />
                    <div className="absolute bottom-2 right-2">
                        <Button className="mx-2" variant="outlined" onClick={setClosed}>
                            Cancel
                        </Button>
                        <Button disabled={disabled} className="mx-2 bg-blue-900" variant="contained" onClick={pressMergeButton}>
                            Merge
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
