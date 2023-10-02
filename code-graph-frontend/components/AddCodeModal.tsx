import { Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCodesRoutes, insertCodeRoute, insertCodeRouteWithParent } from "@/pages/api/api";

interface AddCodeModalProps {
  open: boolean;
  handleClose: () => void;
  projectId: number;
}

export default function AddCodeModal(props: AddCodeModalProps) {
  const noneIndex = -1;
  const [checkedId, setCheckedId] = React.useState(noneIndex);
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
    if (checkedId === selectedLabel) {
      setCheckedId(noneIndex);
    } else {
      setCheckedId(selectedLabel);
    }
    setDisabled(false);
  }

  function setClosed() {
    props.handleClose();
    setDisabled(true);
    setCheckedId(noneIndex);
    setInputValue("");
  }

  function pressAddButton() {
    if (checkedId == noneIndex) {
      try {
        insertCodeRoute(inputValue, props.projectId);
      } catch (e) {
        console.error("Error adding code:", e);
      }
    } else {
      insertCodeRouteWithParent(inputValue, props.projectId, checkedId);
    }
    setClosed();
    props.handleClose();
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
    setDisabled(false);
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
              <FormLabel component="legend">Add to Code</FormLabel>
              <div className="overflow-auto h-[25vw]">
                <TextField
                    className="w-[25rem]"
                    id="search"
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <RadioGroup aria-label="Add to Code" name="add" value={"Add to Category"}>
                  <FormControlLabel
                    value={noneIndex}
                    control={<Radio />}
                    label={"none"}
                    key={noneIndex}
                    checked={checkedId === noneIndex}
                    onChange={() => handleCheckboxChange(noneIndex)}
                  />
                  {filteredCodeList != null &&
                      filteredCodeList.map((code) => (
                      <FormControlLabel
                        value={code.code_id}
                        control={<Radio />}
                        label={code.text}
                        key={code.code_id}
                        checked={checkedId === code.code_id}
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
            <Button disabled={disabled} className="mx-2 bg-blue-900" variant="contained" onClick={pressAddButton}>
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
