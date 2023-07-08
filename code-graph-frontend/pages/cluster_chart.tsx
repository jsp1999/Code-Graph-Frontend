
import * as d3 from "d3";

//CREATE CANVA
function createCanva(height: number, width: number, w_border: number, h_border: number) {
    const svgRef = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
      if (svgRef.current) {
        // Access the SVG element using svgRef.current and modify its attributes
        svgRef.current.setAttribute('width', (width + w_border).toString());
        svgRef.current.setAttribute('height', (height + h_border).toString());
        svgRef.current.style.backgroundColor = 'rgb(255, 255, 255)';
  
      }
    }, [])
    return svgRef
  }
  
  //DRAW ON CANVA
export function drawChart(svgRef: React.RefObject<SVGSVGElement>,
     height: number, 
     width: number, 
     nodes: any, 
     arrows: any,
     radius: number
     ) {

      
    const unique_topic_index = Array.from(new Set(arrows.map((d: { topic_index: any; }) => d.topic_index)))
    const cluster_color = d3.scaleOrdinal(unique_topic_index, d3.schemeCategory10)
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
        .attr("x", data.x * 1)
        .attr("y", data.y - height * 0.04)
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