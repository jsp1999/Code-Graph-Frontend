import * as d3 from "d3";
import {ZoomBehavior, ZoomedElementBaseType} from "d3";
import CodeDot from "@/components/CodeDot";
import {getCodeStats} from "@/pages/api/api";

class CodeDotPlotter {
    private container: any;
    private zoom: ZoomBehavior<ZoomedElementBaseType, unknown>;
    private svg: any;
    private selected: any[];
    private data: any[];
    private point_r: number;
    private projectId: number;
    private source: any;
    private containerId: string;
    private filter: any;
    private selectedNodes: number[];
    private contextMenu: d3.Selection<any, any, any, any>;
    handleOpen: () => void;

    constructor(containerId: string, projectId: number, source: any, svg: any, container: any, selectedNodes: number[], handleOpen: () => void) {
        this.containerId = containerId;
        this.source = source;
        this.projectId = projectId;
        this.data = [];
        this.selected = [];
        this.svg = svg;
        this.container = container;
        this.point_r = 5;
        this.selectedNodes = selectedNodes;
        this.handleOpen = handleOpen;

        this.contextMenu = d3.select("body").append("div")
            .attr("class", "context-menu")
            .style("position", "absolute")
            .style("display", "none");

       // window.addEventListener('beforeunload', this.handleBeforeUnload);

        this.container.selectAll(".dot")
            .on("contextmenu", (event: any, dotData: any) => {
                event.preventDefault();
                console.log("Right-click on dot:", dotData);
                this.showContextMenu(event.pageX, event.pageY, dotData);
            });

        this.contextMenu.append("div")
            .text("Add to Category")
            .on("click", () => {
                this.addToCategory();
                this.contextMenu.style("display", "none");
            });


        this.zoom = d3
            .zoom()
            .scaleExtent([0.01, 1000])
            .on("zoom", (event) => {
                this.container.attr("transform", event.transform);
                const scale = event.transform.k;
                const dots = this.container.selectAll(".dot");
                const hitbox = this.container.selectAll("circle");
                hitbox.attr("r", this.point_r / scale);
                if (scale > 1.5) {
                    dots.attr("r", this.point_r / scale);
                } else {
                    dots.attr("r", this.point_r);
                }
            });

        this.svg.call(this.zoom);
    }

    private handleBeforeUnload = (event: Event) => {
        this.data = [];
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    };

    private showContextMenu(x: number, y: number, dotData: any) {
        console.log("showContextMenu called with x:", x, "y:", y);
        this.contextMenu.style("left", x + "px")
            .style("top", y + "px")
            .style("display", "block");

        this.selected = [dotData];
    }

    private addToCategory() {
        this.handleOpen();
    }

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

     applyCodesFilter(codes:any) {
        function createCodeFilter(codes: any) {
            return function (dot: any) {
                return codes.includes(dot.code);
            };
        }
        this.selectedNodes = codes;
        console.log("Selected codes:", this.selectedNodes)
        const filterFunc = createCodeFilter(codes);
        this.setFilter(filterFunc);
        this.update().then(() => this.homeView());
    }

    setFilter(filterFunc: any) {
        this.filter = filterFunc;
        this.update();
    }
    fetchData() {
        console.log("fetching data...");
        return getCodeStats(this.projectId)
            .then(async (codeStats) => {
                console.log("Received codeStats response:", codeStats);
                if (codeStats) {
                    console.log("Code Stats Codes:", codeStats.code_segments_count.codes);
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
    update() {
        return this.fetchData().then((newData: any) => {
            console.log("updated newData:", newData)
            this.render(newData);
        });
    }

    render(newData: any) {
        console.log("rendering...");
        console.log("newdata", newData);

        if (this.selectedNodes.length > 0) {
            console.log("Codes are selected", this.selectedNodes)
            newData = newData.filter((dot: any) => this.selectedNodes.includes(dot.code_id));
            console.log("Data after selection", newData);
        }

        this.data = this.data.filter((dot) => {
            let shouldKeep = newData.find((d: any) => d.code_id === dot.dotId);
            if (!shouldKeep && dot.circle) {
                dot.circle.remove();
                dot.label.remove();
            }
            return shouldKeep;
        });

        newData.forEach((dotData: any) => {
            let existingDot = this.data.find((d) => d.dotId === dotData.code_id);
            if (existingDot) {
                existingDot.x = dotData.average_position.x;
                existingDot.y = dotData.average_position.y;
                existingDot.code = dotData.text;
            } else {
                let newDot = new CodeDot(
                    dotData.code_id,
                    dotData.average_position.x,
                    dotData.average_position.y,
                    dotData.text,
                    this,
                );
                this.data.push(newDot);
                newDot.draw(this);
            }
        });

        console.log("Actual data:", this.data)
        console.log(this.data.length);
    }

};
export default CodeDotPlotter;