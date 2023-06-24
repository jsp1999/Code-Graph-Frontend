import * as d3 from "d3";
import * as React from "react";
import data from "../src/data.json";
import { AnyNode } from "postcss";

//DATA

var positions = Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  x: parseFloat(entry.position[0]),
  y: parseFloat(entry.position[1]),
  topic_index: entry.topic_index
}));

var arrows =  Object.entries(data).map(([id, entry]) => ({
  id: parseInt(id),
  topic_index: entry.topic_index
}));

const unique_topic_index = Array.from(new Set(arrows.map(d => d.topic_index)))

//HYPER PARAMETER
const height = 1000
const width = 1000

const min_x_position = d3.min(positions, d => d.x) as number;
const max_x_position = d3.max(positions, d => d.x) as number;
const min_y_position = d3.min(positions, d => d.y) as number;
const max_y_position = d3.max(positions, d => d.y) as number;

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
function drawChart(svgRef: React.RefObject<SVGSVGElement>, height: number, width: number, positions: any, arrows: any) {
  const svg = d3.select(svgRef.current);
  svg.selectAll("circle")
    .data(positions)
    .enter()
    .append("circle")
    .attr("cx", (d: any)  => xScale(d.x))
    .attr("cy", (d: any)  => yScale(d.y))
    .attr("r", 2)
    .attr("fill", (d: any) => cluster_color(d.topic_index))
  return svg.node();
}


//COMPONENT THAT CALLS CANVA AND DRAW
const ClusterGraph: React.FunctionComponent = () => {
  var svg = createCanva(height, width);
  React.useEffect(() => {
    drawChart(svg, height, width, positions, arrows);
  }, [svg]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};


///SCRUBER

interface SimScrubberProps {
  scrubberValue: number;
  onScrubberChange: (value: number) => void;
}

const SimScrubber: React.FC<SimScrubberProps> = ({
  scrubberValue,
  onScrubberChange,
}) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onScrubberChange(value);
  };

  return (
    <div id="scrubber">
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


const Page : React.FC = () => {
  const [scrubberValue, setScrubberValue] = React.useState<number>(0);
  const handleScrubberChange = (value: number) => {
    setScrubberValue(value);
  };

  return (
    <div>
      <SimScrubber scrubberValue={scrubberValue}
        onScrubberChange={handleScrubberChange}></SimScrubber>
      <ClusterGraph></ClusterGraph>
    </div>
  )
}

export default Page;

