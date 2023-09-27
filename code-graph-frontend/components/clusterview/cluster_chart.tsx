import * as d3 from "d3";
import React from "react";

import annotation_hierachy_mapping from "../../src/annotations_hierachy.json";

const higherCategoryNameDict: { [key: string]: string } = Object.entries(annotation_hierachy_mapping).reduce(
  (dict, [key, value]) => {
    dict[key] = value.higherCategoryName;
    return dict;
  },
  {},
);

//CREATE CANVA
export function createCanva(height: number, width: number, w_border: number, h_border: number) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    if (svgRef.current) {
      // Access the SVG element using svgRef.current and modify its attributes
      svgRef.current.setAttribute("width", (width + w_border).toString());
      svgRef.current.setAttribute("height", (height + h_border).toString());
      svgRef.current.style.backgroundColor = "rgb(255, 255, 255)";
    }
  }, []);
  return svgRef;
}

//DRAW ON CANVA
export function drawChart(
  svgRef: React.RefObject<SVGSVGElement>,
  height: number,
  width: number,
  nodes: any,
  arrows: any,
  radius: number,
  cluster_color: any,
  onSelectedNodeChange: (data: any) => void,
) {
  const svg = d3.select(svgRef.current);
  const circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .classed("node", true)
    .attr("cx", (d: any) => d.x)
    .attr("cy", (d: any) => d.y)
    .attr("r", radius)
    .attr("fill", (d: any) => cluster_color(higherCategoryNameDict[d.annotation]))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", mouseclick);

  function mouseover(this: any, mouse_event: any, data: any) {
    // this.parentElement.appendChild(this)
    d3.select(this).attr("r", radius * 5);

    d3.select(this.parentNode)
      .append("text")
      .attr("class", "node-label")
      .attr("x", data.x * 1)
      .attr("y", data.y - height * 0.04)
      .text(data.segment)
      .style("font-size", (radius + 10).toString())
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("pointer-events", "none");
  }

  function mouseout(this: any) {
    svg.selectAll(".node-label").remove();
    d3.select(this).attr("r", radius);
  }

  function mouseclick(this: any, mouse_event: any, data: any) {
    // console.log(data)
    onSelectedNodeChange(data);
  }

  return circles;
}

export function drawLegend(svgRef: React.RefObject<SVGSVGElement>, cluster_color: any) {
  const svg = d3.select(svgRef.current);
  const legend = svg
    .selectAll(".legend")
    .data(cluster_color.domain().sort())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect").attr("x", 0).attr("y", 0).attr("width", 18).attr("height", 18).style("fill", cluster_color);

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text((d: any) => d);

  legend.style("font-size", "12px").style("font-family", "Arial");

  return svg;
}
