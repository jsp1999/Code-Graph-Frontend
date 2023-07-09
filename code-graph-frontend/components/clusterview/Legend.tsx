import React from "react";
import { createCanva, drawLegend } from "./cluster_chart";

interface LegendProps {
    cluster_color: any
  }
  
export const Legend: React.FC<LegendProps> = ({cluster_color: cluster_color}) => {
    var svgLegend = createCanva(300, 200, 10, 10);
  
    React.useEffect(() => { 
      const legends = drawLegend(svgLegend, cluster_color)
    })
    
    return ([<div id="legend">
      <svg ref={svgLegend} />
    </div>])
  }