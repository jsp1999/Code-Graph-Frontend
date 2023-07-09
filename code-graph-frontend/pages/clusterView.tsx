import * as d3 from "d3";
import * as React from "react";
import data from "../src/data.json";
import { AnyNode } from "postcss";
import Header from "@/components/Header";
import { Button } from "@mui/material";
import Link from "next/link";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { drawChart, createCanva, drawLegend } from "./cluster_chart";
import { Grid } from "@mui/material";
import { FormControl, InputLabel, NativeSelect, ListItemButton, ListItemText, ListItem, List } from '@mui/material';

//DATA

const nodes_limit = 10000;

var node_data = Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  info: entry.daten,
  x: parseFloat(entry.position[0]),
  y: parseFloat(entry.position[1]),
  topic_index: entry.topic_index
}))
  .slice(0, nodes_limit)


var arrows = Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  topic_index: entry.topic_index
}))
  .slice(0, nodes_limit)

const unique_topic_index = Array.from(new Set(arrows.map((d: { topic_index: any; }) => d.topic_index)));
const cluster_color = d3.scaleOrdinal(unique_topic_index, d3.schemeCategory10);

//HYPER PARAMETER
const height = 800
const width = 800
const radius = 3
const w_border = width * 0.4;
const h_border = height * 0.4;

const min_x_position = d3.min(node_data, d => d.x) as number;
const max_x_position = d3.max(node_data, d => d.x) as number;
const min_y_position = d3.min(node_data, d => d.y) as number;
const max_y_position = d3.max(node_data, d => d.y) as number;

//SCALING
const xScale = d3.scaleLinear()
  .domain([min_x_position, max_x_position]) // Assuming x coordinates are non-negative
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([min_y_position, max_y_position]) // Assuming x coordinates are non-negative
  .range([0, height]);

//DRAWING

const Legend: React.FC = () => {
  var svgLegend = createCanva(300, 200, 10, 10);

  React.useEffect(() => { 
    const legends = drawLegend(svgLegend, cluster_color, unique_topic_index)
  })
  
  return ([<div id="legend">
    <svg ref={svgLegend} />
  </div>])
}

///////////////////////
///////////////////////
/////////////////////

interface NodeInfoProps {
  nodeData: any;
}

const NodeInfo: React.FC<NodeInfoProps> = ({ nodeData }) => {
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



///////////////////////
///////////////////////
/////////////////////

interface ClusterProps {
  selectedNode: any;
  onSelectedNodeChange: (d: any) => void;
  collideValue: number;
  limitValue: number;
  attractionValue: number;
  centerForceValue: number;
}

//COMPONENT THAT CALLS CANVA AND DRAW
const ClusterGraph: React.FC<ClusterProps> = ({
  selectedNode: selectedNode,
  onSelectedNodeChange: onSelectedNodeChange,
  collideValue: collide_force,
  limitValue: limit,
  attractionValue: attraction_force,
  centerForceValue: center_force }) => {

  var svgChart = createCanva(height, width, w_border, h_border);

  const all_nodes = node_data.map(d => Object.create(d)).map(({ id, info, x, y, topic_index }) => {
    const scaledX = xScale(x) + w_border / 2;
    const scaledY = yScale(y) + h_border / 2;
    return { id: id, info: info, x: scaledX, y: scaledY, topic_index: topic_index };
  })

  // NODE LIMIT
  React.useEffect(() => {
    const nodes = all_nodes.slice(0, limit);
    const svg = d3.select(svgChart.current);
    svg.selectAll("*").remove();
    return () => {
    };
  }, [limit]);


  //FORCE
  React.useEffect(() => {
    const nodes = all_nodes.slice(0, limit);

    const svg = d3.select(svgChart.current);
    var simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(width / 2).strength(center_force / 10000))
      .force('y', d3.forceY(height / 2).strength(center_force / 10000))
      .force('collide', d3.forceCollide(radius * (collide_force)))
      .force("charge", d3.forceManyBody().strength(attraction_force / 100))
      .on('tick', ticked)
      .stop()

    const circles = drawChart(svgChart, height, width, nodes, arrows, radius, cluster_color, onSelectedNodeChange);

    function ticked() {
      svg.selectAll('circle')
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    }

    //TIME OUT 
    const stopSimulation = () => {
      simulation.stop();
    };
    // Set the duration in milliseconds
    const duration = 2000; // 1 seconds
    // Start the simulation
    simulation.restart();
    // Set a timeout to stop the simulation after the specified duration
    const timeout = setTimeout(stopSimulation, duration);
    // Clean up the timeout when the component unmounts or the duration changes
    return () => clearTimeout(timeout);
  }, [center_force, collide_force, attraction_force, limit]);


  React.useEffect(() => {
    const svg = d3.select(svgChart.current);
    const zoom = d3.zoom().scaleExtent([0.5, 3]).on('zoom', zoomed);
    svg.call(zoom);

    function zoomed(event) {
      const { transform } = event;
      svg.attr('transform', transform)
        .append('g');
      // svg.attr('style', `clip-path: inset(0px ${-transform.x}px ${-transform.y}px 0px)`);
    }

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  //selected Node
  // const circles = svg.selectAll("circle")



  return ([<div id="chart">
    <svg ref={svgChart} />
  </div>]

  );
};
//


///SCRUBER FOR ZOOMING

interface ScrubberProps {
  scrubberValue: number;
  onScrubberChange: (value: number) => void;
}

const CollideForceScrubber: React.FC<ScrubberProps> = ({
  scrubberValue,
  onScrubberChange, }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="collid_force">
      <div>Collide force Value: {scrubberValue}</div>
      <input
        type="range"
        min="-1"
        max="2"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />

    </div>
  );
};

const CenterForceScrubber: React.FC<ScrubberProps> = ({
  scrubberValue,
  onScrubberChange, }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="center_force">
      <div>Center force Value: {scrubberValue}</div>
      <input
        type="range"
        min="-5"
        max="5"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />
    </div>
  );
};

const AttractionForceScrubber: React.FC<ScrubberProps> = ({
  scrubberValue,
  onScrubberChange, }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="attraction_force">
      <div>Attraction force Value: {scrubberValue}</div>
      <input
        type="range"
        min="-5"
        max="5"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />

    </div>
  );
};



const LimitScruber: React.FC<ScrubberProps> = ({
  scrubberValue,
  onScrubberChange, }) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="limit">
      <div>Node Limit: {scrubberValue}</div>
      <input
        type="range"
        min="0"
        max="10000"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />

    </div>
  );
};

const defaultTheme = createTheme();

///////////////
//////////////
////////////////
///////////////
///////////

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
                selectedNode={selectedNodeData}
                onSelectedNodeChange={handleSelectedNodeChange}
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
            Legend
            <Legend></Legend>
            <NodeInfo nodeData={selectedNodeData} />
          </Paper>
        </Grid>
        <div className="absolute right-5 bottom-5 bg-blue-900 rounded">
          <Button variant="contained" className="">
            <Link href="/">Change View</Link>
          </Button>
        </div>
      </Grid>


    </ThemeProvider>)
};

export default Page;

