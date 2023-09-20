import * as d3 from "d3";
import * as React from "react";
import data from "../src/data.json";
import new_data from "../src/plot_data.json";
import annotation_hierachy_mapping from "../src/annotations_hierachy.json";
import Header from "@/components/Header";
import Link from "next/link";

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Button, Box, Paper } from "@mui/material";


//Defimed components
import {CollideForceScrubber, CenterForceScrubber, AttractionForceScrubber, LimitScruber} from "@/components/clusterview/Scrubber"
import { ClusterGraph } from "@/components/clusterview/ClusterGraph";
import {NodeInfo} from "@/components/clusterview/NodeInfo"
import { Legend } from "@/components/clusterview/Legend";
import {useRouter} from "next/router";
import {useState} from "react";




//DATA


const nodes_limit = 10000;


var node_data = Object.entries(new_data).map(([id, entry]) => (
  {
  id: id,
  segment: entry?.segment,
  sentence: entry?.sentence,
  x: entry?.embedding?.[0],
  y: entry?.embedding?.[1],
  annotation: entry?.annotation,
  cluster: entry?.cluster
}))


// .map( data => ({
//     id: data.segment,
//     info: data.sentence,
//     x: parseFloat(data.embedding[0]),
//     y: parseFloat(data.embedding[1]),
//     topic_index: data.annotation
//   }))
//     .slice(0, nodes_limit)

// var old_node_data = Object.entries(data).map(([id, entry]) => ({
//   id: parseInt(id),
//   info: entry.daten,
//   x: parseFloat(entry.position[0]),
//   y: parseFloat(entry.position[1]),
//   topic_index: entry.topic_index
// }))
//   .slice(0, nodes_limit)
const higherCategoryNameDict: { [key: string]: string } = Object.entries(annotation_hierachy_mapping).reduce((dict, [key, value]) => {
  dict[key] = value.higherCategoryName;
  return dict;
}, {});

console.log(higherCategoryNameDict)
const unique_topic_index = Array.from(new Set(node_data.map((d: { annotation: any; }) => higherCategoryNameDict[d.annotation])));
const cluster_color = d3.scaleOrdinal(unique_topic_index, d3.schemeCategory10);

//HYPER PARAMETER
const height = 800
const width = 800
const radius = 3
const size_info = [height, width, radius]

const defaultTheme = createTheme();

//MAIN PAGE
const Page: React.FC = () => {
  //COLIDE
  const [collideValue, setCollideValue] = React.useState<number>(0);
  const handleScrubberChange = (value: number) => {
    setCollideValue(value);
  };
  //LIMIT
  const [limitValue, setLimitValue] = React.useState<number>(100);
  const handleLimitScrubberChange = (value: number) => {
    setLimitValue(value);
  };
  //Attraction
  const [attractionValue, setAttractionValue] = React.useState<number>(0);
  const handleAttractionChange = (value: number) => {
    setAttractionValue(value);
  };
  //Center
  const [centerForceValue, setCenterForceValue] = React.useState<number>(0);
  const handleCenterForceChange = (value: number) => {
    setCenterForceValue(value);
  };

  const [selectedNodeData, setSelectedNodeData] = React.useState<any>(null);
  const handleSelectedNodeChange = (value: any) => {
    setSelectedNodeData(value);
  };

  const router = useRouter();
  const {project_id} = router.query;
  const [projectId, setProjectId] = useState(typeof project_id === 'string' ? parseInt(project_id, 10) : 1);


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container spacing={2}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}>
        <Grid item xs={12}>
          <Header title="Cluster View" />
        </Grid>
        <Grid item xs={3}>
          {/* Left column with adjustment buttons */}
          <Paper>Adjustment Buttons</Paper>
          <LimitScruber scrubberValue={limitValue}
            onScrubberChange={handleLimitScrubberChange}></LimitScruber>

          <CollideForceScrubber
            scrubberValue={collideValue}
            onScrubberChange={handleScrubberChange}></CollideForceScrubber>

          <AttractionForceScrubber scrubberValue={attractionValue}
            onScrubberChange={handleAttractionChange}></AttractionForceScrubber>

          <CenterForceScrubber scrubberValue={centerForceValue}
            onScrubberChange={handleCenterForceChange}></CenterForceScrubber>
        </Grid>
        <Grid item xs={6}
          component="main"
        >
          {/* Main box to display the graph */}
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: 600

            }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ClusterGraph
                node_data = {node_data}
                size_info = {size_info}
                cluster_color = {cluster_color}
                selectedNode={selectedNodeData}
                handleSelectedNodeChange={handleSelectedNodeChange}
                collideValue={collideValue}
                limitValue={limitValue}
                attractionValue={attractionValue}
                centerForceValue={centerForceValue}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          {/* Right column to display additional information */}
          <Paper>
            <Legend cluster_color={cluster_color} ></Legend>
            <NodeInfo nodeData={selectedNodeData} />
          </Paper>
        </Grid>
        <div className="absolute right-5 bottom-5 bg-blue-900 rounded">
          <Button variant="contained" className="" onClick={() => router.push(`/codeView?project_id=${projectId}`)}>
            Change View
          </Button>
        </div>
      </Grid>


    </ThemeProvider>)
};

export default Page;

