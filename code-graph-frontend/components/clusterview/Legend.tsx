import React from "react";
// import { createCanva, drawLegend } from "./cluster_chart";
import { Paper } from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


interface LegendProps {
  cluster_color: any;
  annotation_info: any
}

function renderTree(data) {
  var children = Object.values(data.subcategories);


  return (
    <TreeItem key={data.id} nodeId={data.id} label={data.name}>
      {Array.isArray(children)
        ? children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );
}

export const Legend: React.FC<LegendProps> = ({ cluster_color: cluster_color, annotation_info: annotation_info }) => {
  
  console.log('legend');
  console.log(annotation_info)
  var data = Object.values(annotation_info);
  console.log(data);

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {data.map((item) => renderTree(item))}
    </TreeView>
  );
};

// export const Legend: React.FC<LegendProps> = ({ cluster_color: cluster_color }) => {
//   var svgLegend = createCanva(300, 200, 10, 10);

//   React.useEffect(() => {
//     const legends = drawLegend(svgLegend, cluster_color);
//   });

//   return [
//     <div id="legend">
//       <Paper>LEGEND</Paper>
//       <svg ref={svgLegend} />
//     </div>,
//   ];
// };