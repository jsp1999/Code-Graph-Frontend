import { FormControl, InputLabel, NativeSelect, ListItemButton, ListItemText, ListItem, List } from "@mui/material";
import { Box, Paper } from "@mui/material";
import * as React from "react";
import annotation_id_map from "../../src/anonotations_id_map.json";
import annotation_hierachy_mapping from "../../src/annotations_hierachy.json";

const CategoryNameDict: { [key: string]: string } = Object.entries(annotation_hierachy_mapping).reduce(
  (dict, [key, value]) => {
    dict[key] = value.categoryName;
    return dict;
  },
  {},
);

interface NodeInfoProps {
  nodeData: any;
}

export const NodeInfo: React.FC<NodeInfoProps> = ({ nodeData }) => {
  const option_list = Object.keys(annotation_id_map);
  React.useEffect(() => {
    // This code will run every time nodeData changes
    // You can perform any side effects or additional logic here
    console.log("nodeData has changed:", nodeData);
  }, [nodeData]); // Specify the dependency as nodeData to trigger the effect whenever it changes

  if (!nodeData) {
    return null; // Render nothing if nodeData is null or empty
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Paper>NODE INFO</Paper>
      <List>
        <ListItem disablePadding>
          <ListItemText primary={`ID: ${nodeData.id}`} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary={`Segment: ${nodeData.segment}`} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary={`Sentece: ${nodeData.sentence}`} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary={`Annotation: ${CategoryNameDict[nodeData.annotation]}`} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary={`Cluster: ${nodeData.cluster}`} />
        </ListItem>
      </List>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Pick annotation
        </InputLabel>
        <NativeSelect defaultValue={30} inputProps={{ name: "Category", id: "uncontrolled-native" }}>
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
