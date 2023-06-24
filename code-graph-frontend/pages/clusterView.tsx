import * as d3 from "d3";
import * as React from "react";
import data from "../src/data.json";
import {Scrubber} from '@mbostock/scrubber'
import { AnyNode } from "postcss";

//DATA

const nodes_limit = 1000;

var node_data = Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  info: entry.daten,
  x: parseFloat(entry.position[0]),
  y: parseFloat(entry.position[1]),
  topic_index: entry.topic_index
})).slice(0, nodes_limit);

var arrows =  Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  topic_index: entry.topic_index
})).slice(0, nodes_limit);

const unique_topic_index = Array.from(new Set(arrows.map(d => d.topic_index)))

//HYPER PARAMETER
const height = 500
const width = 500
const radius = 2

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
  .range([0, width]);

const cluster_color = d3.scaleOrdinal(unique_topic_index, d3.schemeCategory10)


//DRAWING


//CREATE CANVA
function createCanva(height: number, width: number){
  const svgRef = React.useRef<SVGSVGElement>(null);
  const border = 20;
  React.useEffect(() => {
    if (svgRef.current) {
      // Access the SVG element using svgRef.current and modify its attributes
      svgRef.current.setAttribute('width', (width+border).toString());
      svgRef.current.setAttribute('height', (height+border).toString());
      svgRef.current.style.backgroundColor = 'rgb(250, 250, 250)';
    }
  }, [])
  return svgRef
}

//DRAW ON CANVA
function drawChart(svgRef: React.RefObject<SVGSVGElement>, height: number, width: number, nodes: any, arrows: any) {
  const svg = d3.select(svgRef.current);


  const circles = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", (d: any)  => xScale(d.x))
    .attr("cy", (d: any)  => yScale(d.y))
    .attr("r", radius)
    .attr("fill", (d: any) => cluster_color(d.topic_index))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);;

  function mouseover(this: any, d: any) {
    this.parentElement.appendChild(this)
    
    d3.select(this).attr("r", radius*5);

    //TODO TEXT COULD NOT BE SHOWN
    svg.append("text")
    .attr("class", "node-label")
    .attr("x", xScale(d.x))
    .attr("y", yScale(d.y) - 30)
    .text("lets go")
    .attr("font-size", "50px")
    .attr("text-anchor", "middle")
    .attr("opacity", 1)
    .raise();
  }
  
  function mouseout(this: any) {
    svg.selectAll(".node-label").remove();
    d3.select(this).attr("r", radius)
  };
    
  // const text = svg
  //   .selectAll("text")
  //   .data(positions)
  //   .enter()
  //   .append("text")
  //   .attr("class", "node-label")
  //   .attr("x", (d: any) => xScale(d.x))
  //   .attr("y", (d: any) => yScale(d.y) - 10)
  //   .text((d: any) => d.id)
  //   .attr("font-size", "2px")
  //   .attr("text-anchor", "middle")
  //   .style("opacity",  0)
  
  // circle.on("mouseover", mouseover).on("mouseout", mouseout);

  
  
  // function mouseout(d: any) {  text.style("opacity",  0);}
  // function mouseover(d: any) { text.style("opacity", 1);}

  
  return circles;;
}

interface ClusterProps {
  collideScrubberValue: number;
}

//COMPONENT THAT CALLS CANVA AND DRAW
const ClusterGraph: React.FC<ClusterProps> = ({collideScrubberValue}) => {
  var nodes = node_data.map(d => Object.create(d))
  var svgRef = createCanva(height, width);
  const svg = d3.select(svgRef.current)

  const sim = d3.forceSimulation(nodes)
  .force("x", d3.forceX(width/2).strength(0.5))
  .force("y", d3.forceY(height/2).strength(0.5))
  .force("collide", d3.forceCollide(5))
  .on('tick', () => {
    // Update node positions
    svg.selectAll('circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);
  });


  const circles = drawChart(svgRef, height, width, nodes, arrows);

  
  

  return (
    <div id="chart">
      <svg ref={svgRef} />
    </div>
  );
};


///SCRUBER FOR ZOOMING

interface SimScrubberProps {
  scrubberValue: number;
  onScrubberChange: (value: number) => void;
}

const CollideSimScrubber: React.FC<SimScrubberProps> = ({
  scrubberValue,
  onScrubberChange,}) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="collide_scrubber">
      <input
        type="range"
        min="0"
        max="100"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />
      <div>Scrubber Value: {scrubberValue}</div>
    </div>
  );
};


//MAIN PAGE
const Page : React.FC = () => {
  const [collideScrubberValue, setScrubberValue] = React.useState<number>(0);
  const handleScrubberChange = (value: number) => {
    setScrubberValue(value);
  };

  return (
    <div>
      <CollideSimScrubber scrubberValue={collideScrubberValue}
        onScrubberChange={handleScrubberChange}></CollideSimScrubber>
      <ClusterGraph collideScrubberValue={collideScrubberValue}></ClusterGraph>
    </div>
  )
}

export default Page;

