import { FormControl, InputLabel, NativeSelect, ListItemButton, ListItemText, ListItem, List } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from "react";

interface NodeInfoProps {
    nodeData: any;
}

export const NodeInfo: React.FC<NodeInfoProps> = ({ nodeData }) => {
    const option_list = ['Category 1', 'Category 2', 'Category 3'];
    React.useEffect(() => {
        // This code will run every time nodeData changes
        // You can perform any side effects or additional logic here
        console.log('nodeData has changed:', nodeData);
    }, [nodeData]); // Specify the dependency as nodeData to trigger the effect whenever it changes

    if (!nodeData) {
        return null; // Render nothing if nodeData is null or empty
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
            }}>
            <List>
                <ListItem disablePadding>
                    <ListItemText primary={`ID: ${nodeData.id}`} />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemText primary={`Info: ${nodeData.info}`} />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemText primary={`Topic Index: ${nodeData.topic_index}`} />
                </ListItem>
            </List>
            <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Pick category
                </InputLabel>
                <NativeSelect defaultValue={30} inputProps={{ name: 'Category', id: 'uncontrolled-native' }}>
                    {option_list.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </NativeSelect>
            </FormControl>
        </Box>
    );
};