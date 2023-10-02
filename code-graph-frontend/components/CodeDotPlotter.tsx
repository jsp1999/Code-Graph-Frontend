import * as d3 from "d3";
import { ZoomBehavior, ZoomedElementBaseType } from "d3";
import CodeDot from "@/components/CodeDot";
import { getCodeStats } from "@/pages/api/api";

class CodeDotPlotter {
  private container: any;
  private zoom: ZoomBehavior<ZoomedElementBaseType, unknown>;
  private svg: any;
  private selected: any[];
  private data: any[];
  private projectId: number;
  private source: any;
  private containerId: string;
  private filter: any;
  private selectedNodes: number[];
  private addToCategory: () => void;
  private fetched_data: any;
  private minRadiusOfAllCodes: number;
  private maxRadiusOfAllCodes: number;

  constructor(
    containerId: string,
    projectId: number,
    source: any,
    svg: any,
    container: any,
    selectedNodes: number[],
    addToCategory: () => void,
  ) {
    this.containerId = containerId;
    this.source = source;
    this.projectId = projectId;
    this.data = [];
    this.selected = [];
    this.svg = svg;
    this.container = container;
    this.selectedNodes = selectedNodes;
    this.addToCategory = addToCategory;
    this.fetched_data = null;
    this.minRadiusOfAllCodes = 0;
    this.maxRadiusOfAllCodes = 10;
    const allDotsInSVG = this.container.selectAll(".dot");
    allDotsInSVG.each(function () {
      console.log("removing erranious dots");
      const dot = d3.select(this);
      dot.remove();
    });

    // window.addEventListener('beforeunload', this.handleBeforeUnload);

    this.zoom = d3
      .zoom()
      .scaleExtent([0.01, 1000])
      .on("zoom", (event) => {
        this.container.attr("transform", event.transform);
      });

    this.svg.call(this.zoom);
  }

  private handleBeforeUnload = (event: Event) => {
    this.data = [];
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  };

  homeView() {
    console.log("home view...");
    const xExtent = d3.extent(this.data, (d) => d.x);
    const yExtent = d3.extent(this.data, (d) => d.y);

    // Calculate width and height of the bounding box
    const dataWidth = xExtent[1] - xExtent[0];
    const dataHeight = yExtent[1] - yExtent[0];

    // Calculate the viewport's width and height
    const width = +this.svg.attr("width");
    const height = +this.svg.attr("height");

    // Calculate the scaling factor
    const kx = width / dataWidth;
    const ky = height / dataHeight;
    const k = 0.95 * Math.min(kx, ky); // 0.95 is for a little

    // Calculate the translation to center the bounding box in the viewport
    const tx = (width - k * (xExtent[1] + xExtent[0])) / 2;
    const ty = (height - k * (yExtent[1] + yExtent[0])) / 2;

    // Apply the zoom transform
    this.svg.transition().call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  }

  applyCodesFilter(codes: any) {
    function createCodeFilter(codes: any) {
      return function (dot: any) {
        return codes.includes(dot.code_id);
      };
    }
    this.selectedNodes = codes;
    console.log("Selected codes:", this.selectedNodes);
    const filterFunc = createCodeFilter(codes);
    this.setFilter(filterFunc);
    //this.update().then(() => this.homeView());
  }

  setFilter(filterFunc: any) {
    this.filter = filterFunc;
    //this.update();
  }

  fetchData() {
    console.log("fetching data...");
    if (this.fetched_data) {
      console.log("already fetched data...");
      return Promise.resolve(this.fetched_data);
    } else {
      return getCodeStats(this.projectId)
        .then(async (codeStats) => {
          console.log("Received codeStats response:", codeStats);
          if (codeStats) {
            console.log("Code Stats Codes:", codeStats.code_segments_count.codes);
            this.fetched_data = codeStats.code_segments_count.codes;
            this.minRadiusOfAllCodes = Math.min(
              ...codeStats.code_segments_count.codes.map((code: any) => code.segment_count),
            );
            this.maxRadiusOfAllCodes = Math.max(
              ...codeStats.code_segments_count.codes.map((code: any) => code.segment_count),
            );
            return codeStats.code_segments_count.codes;
          }
        })
        .catch((error) => {
          if (error.response) {
            // The request was made, but the server responded with an error status code
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received. The request was made but no response was received.");
          } else {
            // Something happened in setting up the request that triggered an error
            console.error("Error setting up the request:", error.message);
          }
          console.error("Error fetching code stats data:", error);
          throw error; // Rethrow the error if needed
        });
    }
  }

  update() {
    return this.fetchData().then((newData: any) => {
      if (newData) {
        console.log("updated newData:", newData);
        this.render(newData);
      }
    });
  }

  render(newData: any) {
    console.log("rendering...");
    console.log("newdata", newData);
    if (this.filter) {
      console.log("filtering...");
      newData = newData.filter((dot) => this.filter(dot));
    } else {
      newData = [];
    }
    /*
        if (this.selectedNodes.length > 0) {
            console.log("Codes are selected", this.selectedNodes)
            newData = newData.filter((dot: any) => this.selectedNodes.includes(dot.code_id));
            console.log("Data after selection", newData);
        }
*/
    console.log("Actual data:", this.data);

    newData.forEach((dotData: any) => {
      let existingDot = this.data.find((d) => d.dotId === dotData.code_id);
      if (existingDot) {
        existingDot.x = dotData.average_position.x;
        existingDot.y = dotData.average_position.y;
        existingDot.code = dotData.text;
      } else {
        let radius =
          (dotData.segment_count - this.minRadiusOfAllCodes) / (this.maxRadiusOfAllCodes - this.minRadiusOfAllCodes);
        let newDot = new CodeDot(
          dotData.code_id,
          dotData.average_position.x,
          dotData.average_position.y,
          dotData.text,
          this,
          () => this.addToCategory,
          radius,
        );

        console.log("radius", radius);
        newDot.draw(this);
      }
    });
    console.log("Actual data:", this.data);
    this.data = this.data.filter((dot) => {
      let shouldKeep = newData.find((d: any) => d.code_id === dot.dotId);
      if (!shouldKeep && dot.circle) {
        dot.circle.remove();
        dot.label.remove();
      }
      return shouldKeep;
    });

    console.log("Actual data:", this.data);
    console.log(this.data.length);
  }
}
export default CodeDotPlotter;
