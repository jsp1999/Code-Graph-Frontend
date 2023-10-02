import DotPlotComponent from "@/pages/plotNeu";

class CodeDot {
    private dotId: number;
    private x: number;
    private y: number;
    private code: string;
    private circle: null | d3.Selection<SVGCircleElement, any, any, any>;
    private plot: any;
    private color: any;
    private label: null | d3.Selection<SVGTextElement, any, any, any>;
    constructor(dotId: number, x: number, y: number, code: string, plot: any) {
        this.dotId = dotId;
        this.x = x;
        this.y = y;
        this.code = code;
        this.circle = null;
        this.label = null;
        this.plot = plot;
        this.color = "black";
        this.plot.data.push(this);

        if (this.x === 0 && this.y === 0) {
            this.x = Math.random() * 100;
            this.y = Math.random() * 100;
        }
    }
    draw(plotter: any) {
        this.circle = plotter.container
            .append("circle")
            .attr("class", "dot")
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.plot.point_r)
            .attr("fill", this.color);
        
        this.label = plotter.container
            .append("text")
            .attr("class", "dot-label")
            .attr("font-size", "0.015px")
            .attr("x", this.x) // Adjust the x-coordinate for label placement
            .attr("y", this.y - 0.01) // Adjust the y-coordinate for label placement
            .text(this.code); // Use this.code as the label text

    }



    remove() {
        if (this.circle) {
            this.circle.remove();
        }
        if (this.label) {
            this.label.remove();
        }
    }

};
export default CodeDot;