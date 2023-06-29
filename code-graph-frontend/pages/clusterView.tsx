import * as d3 from "d3";
import * as React from "react";
import data from "../src/data.json";
import { AnyNode } from "postcss";
import Header from "@/components/Header";
import {Button} from "@mui/material";
import Link from "next/link";

//DATA

const nodes_limit = 3000;

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

const unique_topic_index = Array.from(new Set(arrows.map(d => d.topic_index)))

//HYPER PARAMETER
const height = 700
const width = 700
const radius = 3
const w_border = width * 0.1;
const h_border = height * 0.1

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

const cluster_color = d3.scaleOrdinal(unique_topic_index, d3.schemeCategory10)


//DRAWING


//CREATE CANVA
function createCanva(height: number, width: number) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (svgRef.current) {
      // Access the SVG element using svgRef.current and modify its attributes
      svgRef.current.setAttribute('width', (width + w_border).toString());
      svgRef.current.setAttribute('height', (height + h_border).toString());
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
    .classed("node", true)
    .attr("cx", (d: any) => d.x)
    .attr("cy", (d: any) => d.y)
    .attr("r", radius)
    .attr("fill", (d: any) => cluster_color(d.topic_index))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  function mouseover(this: any, mouse_event: any, data: any) {
    // this.parentElement.appendChild(this)
     d3.select(this).attr("r", radius * 5);
  
    
    d3.select(this.parentNode)
      .append("text")
      .attr("class", "node-label")
      .attr("x", data.x*1)
      .attr("y", data.y - height*0.04)
      .text(data.info)
      .style("font-size", (radius + 10).toString())
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("pointer-events", "none");
  }

  function mouseout(this: any) {
    svg.selectAll(".node-label").remove();
    d3.select(this).attr("r", radius)
  };


  return circles;;
}

interface ClusterProps {
  collideValue: number;
  limitValue: number;
  attractionValue: number;
  centerForceValue: number;
}

//COMPONENT THAT CALLS CANVA AND DRAW
const ClusterGraph: React.FC<ClusterProps> = ({
  collideValue: collide_force,
  limitValue: limit,
  attractionValue: attraction_force,
  centerForceValue: center_force }) => {

  var svgRef = createCanva(height, width);
  const all_nodes = node_data.map(d => Object.create(d)).map(({ id, info, x, y, topic_index }) => {
    const scaledX = xScale(x) + w_border / 2;
    const scaledY = yScale(y) + h_border / 2;
    return { id: id, info: info, x: scaledX, y: scaledY, topic_index: topic_index };
  })




  // NODE LIMIT
  React.useEffect(() => {
    const nodes = all_nodes.slice(0, limit);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    return () => {
    };
  }, [limit]);

  //FORCE
  React.useEffect(() => {
    const nodes = all_nodes.slice(0, limit);
    const svg = d3.select(svgRef.current);
    var simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(width / 2).strength(center_force / 10000))
      .force('y', d3.forceY(height / 2).strength(center_force / 10000))
      .force('collide', d3.forceCollide(radius * (collide_force)))
      .force("charge", d3.forceManyBody().strength(attraction_force/100))
      .on('tick', ticked)
      .stop()

    const circles = drawChart(svgRef, height, width, nodes, arrows);

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



  // ZOOM
  // React.useEffect(() => {
  //   // Get the DOM element associated with the ref
  //   const svgElement = d3.select(svgRef.current);
  //   // Create a zoom behavior
  //   const zoom = d3.zoom().scaleExtent([1, 3]).on('zoom', zoomed);
  //   // Attach the zoom behavior to the SVG element
  //   svgElement.call(zoom);
  //   // Define the zoom event handler
  //   function zoomed(event: any) {
  //     // Get the current zoom transformation
  //     const { transform } = event;
  //     // Apply the zoom transformation to the SVG elements
  //     svgElement.attr('transform', transform);
  //     // Apply constraints to prevent overflowing
  //     const { x, y, k } = transform;
  //     svgElement
  //       .attr('width', width * k)
  //       .attr('height', height * k)
  //       .attr('x', Math.min(0, x))
  //       .attr('y', Math.min(0, y));
  //   }
  
  //   // Save the original width and height of the SVG element
  //   const width = svgElement.attr('width');
  //   const height = svgElement.attr('height');
  
  //   // Cleanup function
  //   return () => {
  //     // Remove the zoom behavior
  //     svgElement.on('.zoom', null);
  //   };
  // }, []);

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([0.5, 5]).on('zoom', zoomed);
    svg.call(zoom);
  
    function zoomed(event) {
      const { transform } = event;
      svg.attr('transform', transform)
      .append("g");
      // svg.attr('style', `clip-path: inset(0px ${-transform.x}px ${-transform.y}px 0px)`);
    }
  }, []);
  
  
  // DRAG QUEEN, DOES NOT WORK
  // React.useEffect(() => {
  //   // Get the DOM element associated with the ref
  //   const svg = d3.select(svgRef.current);
  
  //   // Drag event handlers
  //   function dragStarted(this: any, event: any, d: any) {
  //     d3.select(this).raise().classed('active', true);
  //   }
  
  //   function dragged(this: any, event: any, d: any) {
  //     d3.select(this)
  //       .attr('cx', (event.x + 10).toString())
  //       .attr('cy', (event.y + 10).toString());
  //   }
    
  
  //   function dragEnded(this: any, event: any, d: any) {
  //     d3.select(this).classed('active', false);
  //   }
  
  //   // Define the drag behavior
  //   const dragHandler = d3.drag()
  //     .on('start', dragStarted)
  //     .on('drag', dragged)
  //     .on('end', dragEnded);
  
  //   // Create and render the nodes
  //   svg.call(dragHandler);
  
  //   // Cleanup function
  //   return () => {
  //     // Remove the drag behavior
  //     svg.on('.drag', null);
  //   };
  // }, []);

  return (
    <div id="chart">
      <svg ref={svgRef} />
    </div>
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
        min="-10"
        max="10"
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
        min="-100"
        max="100"
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
        min="-100"
        max="100"
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
        max="5000"
        value={scrubberValue}
        onChange={handleScrubberChange}
      />

    </div>
  );
};

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


  return (
    
    <div>
      <Header title="Cluster View"/>
      <LimitScruber scrubberValue={limitValue}
        onScrubberChange={handleLimitScrubberChange}></LimitScruber>

      <CollideForceScrubber
        scrubberValue={collideValue}
        onScrubberChange={handleScrubberChange}></CollideForceScrubber>

      <AttractionForceScrubber scrubberValue={attractionValue}
        onScrubberChange={handleAttractionChange}></AttractionForceScrubber>

      <CenterForceScrubber scrubberValue={centerForceValue}
        onScrubberChange={handleCenterForceChange}></CenterForceScrubber>

  <div style={{ 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',  // Fix the position
    top: '50%',        // Example: vertically centered
    left: '50%',       // Example: horizontally centered
    transform: 'translate(-50%, -50%)',  // Center horizontally and vertically
    height: height.toString(),   // Set a specific height
    width: width.toString(),    // Set a specific width
    overflow: 'hidden'
  }}>
  <ClusterGraph
    collideValue={collideValue}
    limitValue={limitValue}
    attractionValue={attractionValue}
    centerForceValue={centerForceValue}
  />
</div>

    <div className="absolute right-5 bottom-5 bg-blue-900 rounded">
                    <Button variant="contained" className="">
                        <Link href="/">Change View</Link>
                    </Button>
                </div>
    </div>
  )
}



export default Page;

