import React from "react";
import { createCanva, drawLegend } from "./cluster_chart";
import { Paper } from "@mui/material";

interface LegendProps {
    cluster_color: any
  }
  
export const Legend: React.FC<LegendProps> = ({cluster_color: cluster_color}) => {
    var svgLegend = createCanva(300, 200, 10, 10);
  
    React.useEffect(() => { 
      const legends = drawLegend(svgLegend, cluster_color)
    })
    
    return ([<div id="legend">
      <Paper>LEGEND</Paper>
      <svg ref={svgLegend} />
    </div>])
  }