// DotPlotComp.tsx
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";
import { Button } from "@mui/material";
import ItemList from '@/components/ItemList';
import itemList from "@/components/ItemList";
function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function findCodePath(tree, code_id, currentPath = "") {
  for (const key in tree) {
    const node = tree[key];
    const newPath = currentPath ? `${currentPath}-${node.name}` : node.name;

    if (node.id === code_id) {
      return newPath;
    }

    const subcategories = node.subcategories;
    const result = findCodePath(subcategories, code_id, newPath);
    if (result) return result;
  }
  return null;
}

const idToColorMap = {};

function assignColors(
  codes,
  hueOffset = 0,
  saturation = 100,
  value = 100,
  depth = 0,
  hueStep = 20,
  satStep = 5,
  valStep = 10,
) {
  let hue = hueOffset;
  let sat = saturation;
  let val = value;

  // Larger hue step for root categories
  if (depth === 0) {
    hueStep = 360 / Object.keys(codes).length;
  }

  for (const id in codes) {
    const category = codes[id];

    // Set the hue, making sure it's cycled within the 0-359 range
    const newHue = hue % 360;
    sat = sat % 100; // Keep saturation within 0-100 range
    sat = Math.max(60, sat);

    const color = hsvToRgb(hue / 380, sat / 100, val / 100);

    category.color = color;
    idToColorMap[id] = color;

    if (Object.keys(category.subcategories).length > 0) {
      // Increment hue and saturation for the next level, but reduce the step to keep colors close
      assignColors(category.subcategories, hue + hueStep, sat + satStep, value, depth + 1, hueStep, satStep, valStep);
    }

    // Increment hue and saturation for each category to make them distinct
    hue += hueStep;
    sat += satStep;
    val += valStep;

    val = (val % 60) + 20; // Keep value within 0-100 range

    // Cycle saturation back to 30 if it reaches 100, to ensure variety while avoiding very low saturation
    if (sat >= 100) {
      sat = 60;
    }
    if (sat <= 60) {
      sat = 100;
    }
  }
}

function arrayRemove(arr, value) {
  return arr.filter(function (geeks) {
    return geeks != value;
  });
}

function newColorScale(code_id) {
  return idToColorMap[code_id] || "#808080"; // Fallback to gray
}

class TrainSlide {
  constructor(plot) {
    console.log("Creating train slide...");
    this.plot = plot;
    this.plot.train_slide = this;
    //this.interval = setInterval(() => this.update(), 10 * 1000);
    //this.setupTrainLinesButton();
  }
  setupTrainLinesButton() {
    const button = document.getElementById("trainLinesButton");
    button.addEventListener("click", () => this.trainLines());
  }

  trainLines() {
    // Transform lines data into the desired format
    const formattedData = this.plot.lines.map((line) => {
      return {
        id: line.dot.dotId,
        pos: [line.end_x, line.end_y],
      };
    });

    const jsonData = JSON.stringify(formattedData); // Convert the formatted data to JSON
    fetch(this.plot.source + "projects/" + this.plot.projectId + "/dynamic/correction?epochs=10", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify that we're sending JSON data
      },
      body: jsonData, // Attach the JSON data to the request body
    })
      .then((response) => response.json())
      .then((data) => {
        this.plot.update();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  update() {
    d3.select("#lineList").html("");
    const existingLinesData = this.plot.lines;
    existingLinesData.forEach((lineData) => {
      const listItem = d3
        .select("#lineList")
        .append("div")
        .attr("class", "list-item")
        .style("background-color", d3.color(lineData.dot.color).copy({ opacity: 0.5 }))
        .append("span")
        .append("div")
        .text(`Segment: \"${lineData.dot.segment}\"`)
        .append("div")
        .text(`Code: \"${findCodePath(lineData.dot.plot.tree, lineData.dot.code)}\"`)
        .append("div")
        .append("button")
        .text("Delete")
        .on("click", () => {
          lineData.remove();
          this.update();
        });
    });
  }
}

class ConfigSlide {
  constructor(plot) {
    this.plot = plot;
  }
}
class Dot {
  constructor(dotId, x, y, segment, sentence, code, plot) {
    this.dotId = dotId;
    this.x = x;
    this.y = y;
    this.segment = segment;
    this.sentence = sentence;
    this.code = code;
    this.line = null;
    this.tooltip = null; // for tooltip
    this.circle = null; // for the circle representation
    this.plot = plot;
    if (!this.plot.color_mapper) {
      this.plot.color_mapper = newColorScale;
    }
    this.color = plot.color_mapper(this.code);
    this.plot.data.push(this);
  }

  draw(plotter) {
    console.log("drawing dot...");
    this.circle = plotter.container
      .append("circle")
      .attr("class", "dot")
      .attr("cx", this.x)
      .attr("cy", this.y)
      .attr("r", this.plot.point_r)
      .attr("fill", this.color) // Add fill color
      .on("mouseover", (event) => {
        this.showTooltip(plotter.svg);
      })
      .on("mouseout", (event) => {
        this.hideTooltip();
      });
    if(this.plot.is_dynamic){
      this.setDragBehavior(plotter);
    }
  }

  move() {
    if (this.circle) {
      this.circle
        .transition()
        .duration(10 * 300)
        .attr("cx", this.x)
        .attr("cy", this.y);
    }
    if (this.line) {
      this.line.updateStart(this.x, this.y);
    }
  }

  showTooltip(svg) {
    const absolutePosition = this.circle.node().getBoundingClientRect();

    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("left", absolutePosition.left + 10 + "px")
      .style("top", absolutePosition.top - 10 + "px")
      .style("display", "block")
      .style("background-color", d3.color(this.color).copy({ opacity: 0.5 }));
    this.tooltip
      .append("div")
      .text("Segment: " + this.segment)
      .append("div")
      .text("Sentence: " + this.sentence)
      .append("div")
      .text("Code: " + findCodePath(this.plot.tree, this.code));
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
  setDragBehavior(plotter) {
    const drag = d3
      .drag()
      .on("start", (event) => this.dragStart(plotter, event))
      .on("drag", (event) => this.dragMove(event))
      .on("end", (event) => this.dragEnd(event));

    this.circle.call(drag);
  }

  dragStart(plotter, event) {
    if (this.line) {
      this.line.remove();
    }
    this.line = new Line(this);
    this.line.draw(plotter);
  }

  dragMove(event) {
    if (this.line) {
      this.line.updateEnd(event.x, event.y);
    }
  }

  dragEnd(event) {
    if (this.line) {
      // Any logic you want after the drag ends
    }
  }
}

class Line {
  constructor(dot) {
    this.element = null;
    this.start = dot;
    this.end_x = dot.x;
    this.end_y = dot.y;
    this.hitbox = null;
    this.dot = dot;
    dot.line = this;
    dot.plot.lines.push(this);
  }
  updateStart(x, y) {
    this.start.x = x;
    this.start.y = y;
    if (this.element) {
      this.element
        .transition()
        .duration(10 * 300) // Match the dot's transition duration
        .attr("x1", x)
        .attr("y1", y);
    }
  }
  remove() {
    console.log("remove line...");
    if (this.dot.line == this) {
      this.dot.line = null;
    }
    if (this.dot.plot.lines.includes(this)) {
      this.dot.plot.lines = arrayRemove(this.dot.plot.lines, this);
    }
    if (this.element) {
      this.element.remove();
    }
  }
  draw(plotter) {
    const creationZoomScale = d3.zoomTransform(this.dot.plot.svg.node()).k;
    this.element = plotter.container
      .append("line")
      .attr("x1", this.start.x)
      .attr("y1", this.start.y)
      .attr("x2", this.end_x)
      .attr("y2", this.end_y)
      .attr("stroke", this.dot.color) // or whatever style you want
      .attr("stroke-width", this.dot.plot.point_r / creationZoomScale)
      .attr("marker-end", "url(#arrowhead)");

    this.hitbox = plotter.container
      .append("circle")
      .attr("cx", this.end_x)
      .attr("cy", this.end_y)
      .attr("r", this.dot.plot.point_r / creationZoomScale) // Adjust the radius for your preference
      .style("fill", "transparent")
      .style("cursor", "pointer");

    this.enableDrag(plotter);
    if (this.dot.plot.train_slide) {
      this.dot.plot.train_slide.update();
    }
  }

  updateEnd(x, y) {
    this.end_x = x;
    this.end_y = y;
    this.element.attr("x2", x).attr("y2", y);
    if (this.hitbox) {
      this.hitbox.attr("cx", x).attr("cy", y);
    }
  }

  enableDrag(plotter) {
    const lineDrag = d3.drag().on("drag", (event) => this.dragLineEnd(event));

    this.hitbox.call(lineDrag); // Attach the drag behavior to the hitbox
  }

  dragLineEnd(event) {
    this.updateEnd(event.x, event.y);
  }
}

class DotPlot {
  constructor(containerId, projectId, source, svg, container, train_button, is_dynamic=false) {
    this.containerId = containerId;
    this.is_dynamic = is_dynamic;
    this.train_button = train_button;
    this.source = source;
    this.projectId = projectId;
    this.data = [];
    this.lines = [];
    this.selected = [];
    this.svg = svg;
    console.log(this.svg);
    this.container = container;
    console.log(this.container);
    this.point_r = 2.5;
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    this.zoom = d3
      .zoom()
      .scaleExtent([0.01, 1000]) // Adjust as per your requirements
      .on("zoom", (event) => {
        this.container.attr("transform", event.transform);
        const scale = event.transform.k;
        const dots = this.container.selectAll(".dot");
        const lines = this.container.selectAll("line");
        const hitbox = this.container.selectAll("circle");
        lines.attr("stroke-width", this.point_r / scale);
        hitbox.attr("r", this.point_r / scale);
        if (scale > 1.5) {
          dots.attr("r", this.point_r / scale); // If original radius is this.point_r
        } else {
          dots.attr("r", this.point_r);
        }
      });
    this.setupTrainButton();
    this.svg.call(this.zoom);
  }

  setupTrainButton() {
    const trainButton = this.train_button.current;
    if (!trainButton) return;
    trainButton.addEventListener("click", () => {
      if (trainButton.textContent === "Train") {
        this.toggleTrainButtonState();
        this.trainForEpochs(10);
      } else {
        this.stopTraining = true;
      }
    });
  }

  toggleTrainButtonState() {
    const trainButton = this.train_button.current;
    if (!trainButton) return;
    if (trainButton.textContent === "Train") {
      trainButton.textContent = "Stop";
      this.stopTraining = false;
    } else {
      trainButton.textContent = "Train";
      this.stopTraining = true;
    }
  }
  setFilter(filterFunc) {
    this.filter = filterFunc;
    this.update();
  }
  homeView() {
    console.log("home view...");
    const xExtent = d3.extent(this.data, (d) => d.x);
    const yExtent = d3.extent(this.data, (d) => d.y);

    // Calculate width and height of the bounding box
    const dataWidth = xExtent[1] - xExtent[0];
    const dataHeight = yExtent[1] - yExtent[0];

    // Calculate the viewport's width and height
    const svgElem = this.svg.node(); // Assuming svg is a D3 selection. If it's a raw DOM element, you don't need .node().
    const { width, height } = svgElem.getBoundingClientRect();
    //const width = 400;
    //const height = 400;
    //const width = +this.svg.attr("width");
    //const height = +this.svg.attr("height");
    console.log(width);
    console.log(height);
    // Calculate the scaling factor
    const kx = width / dataWidth;
    const ky = height / dataHeight;
    const k = 0.95 * Math.min(kx, ky); // 0.95 is for a little padding

    // Calculate the translation to center the bounding box in the viewport
    const tx = (width - k * (xExtent[1] + xExtent[0])) / 2;
    const ty = (height - k * (yExtent[1] + yExtent[0])) / 2;

    // Apply the zoom transform
    this.svg.transition().call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  }

  fetchData() {
    console.log("fetching data...");
    const endpoint = this.source + "projects/" + this.projectId + "/plots/?all=true";
    return fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        return data["data"];
      })
      .catch((error) => {
        console.error("Error fetching plot data:", error);
        throw error;
      });
  }

  generateColors() {
    console.log("generating colors...");
    const endpoint = this.source + "projects/" + this.projectId + "/codes/tree";
    return fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        this.tree = data.codes;
        assignColors(data.codes);
        this.color_mapper = newColorScale;
      })
      .catch((error) => {
        console.error("Error fetching plot data:", error);
        throw error;
      });
  }

  update() {
    return this.fetchData().then((newData) => {
      this.render(newData);
    });
  }

  applyCodeFilter(codes) {
    function createCodeFilter(codes) {
      return function (dot) {
        return codes.includes(dot.code);
      };
    }
    const filterFunc = createCodeFilter(codes);
    this.setFilter(filterFunc);
    this.update().then(() => this.homeView());
  }

  trainForEpochs(epochsRemaining) {
    if (this.stopTraining || epochsRemaining <= 0) {
      this.toggleTrainButtonState();
      return;
    }

    fetch(this.source + "projects/" + this.projectId + "/dynamic/cluster?epochs=3", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        this.update().then(() => this.trainForEpochs(epochsRemaining - 1));
      })
      .catch((error) => {
        console.error("Error:", error);
        this.toggleTrainButtonState(); // Ensure the button state is reset if there's an error
      });
  }

  render(newData) {
    // Existing Dots
    //this.container.selectAll(".dot").remove();
    console.log("rendering...");
    if (this.filter) {
      console.log("filtering...");
      newData = newData.filter((dot) => this.filter(dot));
    }
    else {
      newData = [];
    }

    newData.forEach((dotData) => {
      //console.log(dotData);
      let existingDot = this.data.find((d) => d.dotId === dotData.id);
      //console.log(existingDot);
      if (existingDot) {
        // Update existing dot
        existingDot.x = dotData.reduced_embedding.x;
        existingDot.y = dotData.reduced_embedding.y;
        existingDot.move(); // Animate transition
      } else {
        // Create new dot
        let newDot = new Dot(
          dotData.id,
          dotData.reduced_embedding.x,
          dotData.reduced_embedding.y,
          dotData.segment,
          dotData.sentence,
          dotData.code,
          this,
        );
        newDot.draw(this);
      }
    });
    // Optional: remove dots that don't exist in newData
    this.data = this.data.filter((dot) => {
      let shouldKeep = newData.find((d) => d.id === dot.dotId);
      if (!shouldKeep && dot.circle) {
        dot.circle.remove();
      }

      return shouldKeep;
    });
    console.log(this.container.selectAll(".dot"))
  }
}
interface DotPlotProps {
    projectId: number;
    source: string;
    is_dynamic?: boolean; // Assuming this prop can be optional
}

// This is the interface for the functions you're exposing.
export interface DotPlotCompHandles {
    setPlotFilter: (filterValue: any) => void;
}

const DotPlotComp = forwardRef<DotPlotCompHandles, DotPlotProps>((props, ref) => {
    const { projectId, source, is_dynamic } = props;

    const canvasRef = useRef<SVGSVGElement>(null);
    const trainButtonRef = useRef<HTMLButtonElement>(null);
    const [items, setItems] = useState<Item[]>([]);

    const [plot, setPlot] = useState<any>();
    const [train, setTrain] = useState<any>();

    useImperativeHandle(ref, () => ({
        setPlotFilter: (filterValue: any) => {
            if (plot) {
                plot.applyCodeFilter(filterValue);
            }
        }
    }));

    useEffect(() => {
        if (canvasRef.current && (!is_dynamic || trainButtonRef.current)) {
            const svg_ = d3.select(canvasRef.current);
            const container_ = d3.select("#container");
            const newPlot = new DotPlot("container", projectId, source, svg_, container_, trainButtonRef, is_dynamic);
            const newTrain = new TrainSlide(newPlot);
            setPlot(newPlot);
            setTrain(newTrain);
            newPlot.generateColors().then(() => newPlot.update()).then(() => newPlot.homeView());
        }
    }, [projectId, source, is_dynamic]);  // Added is_dynamic to dependency array



  const handleDeleteItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
      <div className="flex">
        <div className="dynamicSvgContainer">
            {/* Here's the ItemList above the button */}


            <svg id="canvas" ref={canvasRef} width="100%" height="100%">
                <g id="container"></g>
            </svg>

            {is_dynamic && (
                <Button
                    variant="contained"
                    style={{ right: "20px", bottom: "20px" }}
                    className="bg-blue-900 rounded absolute right-5 bottom-5"
                    ref={trainButtonRef}
                >
                    Train
                </Button>
            )}
        </div>
                <div className="itemListContainer">
            <ItemList items={items} onDelete={handleDeleteItem} onTrain={() => { /* your training function here */ }} />
        </div>
    </div>
);
});

export default DotPlotComp;