import { createCanva, drawChart } from "./cluster_chart";
import * as d3 from "d3";
import * as React from "react";


interface ClusterProps {
    node_data: Array<any>,
    size_info: any,
    selectedNode: any,
    cluster_color: any,
    handleSelectedNodeChange: (d: any) => void;
    collideValue: number;
    limitValue: number;
    attractionValue: number;
    centerForceValue: number;
    filterCriteria: number[]
}

//COMPONENT THAT CALLS CANVA AND DRAW
export const ClusterGraph: React.FC<ClusterProps> = ({
    node_data: node_data,
    size_info: size_info,
    cluster_color: cluster_color,
    selectedNode: selectedNode,
    handleSelectedNodeChange: HandleSelectedNodeChange,
    collideValue: collide_force,
    limitValue: limit,
    attractionValue: attraction_force,
    centerForceValue: center_force,
    filterCriteria: filterCriteria}) => {

    const arrows = Object.entries(node_data).map(([id, entry]) => ({
        id: parseInt(id),
        annotation: entry.annotation
    }))
        .slice(0, limit)

    const [height, width, radius] = size_info
    const w_border = width * 1;
    const h_border = height * 1;

    const min_x_position = d3.min(node_data, d => d.x) as number;
    const max_x_position = d3.max(node_data, d => d.x) as number;
    const min_y_position = d3.min(node_data, d => d.y) as number;
    const max_y_position = d3.max(node_data, d => d.y) as number;

    var svgChart = createCanva(height, width, w_border, h_border);


    //SCALING
    const xScale = d3.scaleLinear()
        .domain([min_x_position, max_x_position]) // Assuming x coordinates are non-negative
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([min_y_position, max_y_position]) // Assuming x coordinates are non-negative
        .range([0, height]);

    const all_nodes = node_data.map(d => Object.create(d)).map(({ id, segment, sentence,  x, y, annotation, cluster }) => {
        const scaledX = xScale(x) + w_border / 2;
        const scaledY = yScale(y) + h_border / 2;
        return { id: id, segment: segment, sentence: sentence, x: scaledX, y: scaledY, annotation: annotation, cluster: cluster };
    })

    // NODE LIMIT
    React.useEffect(() => {
        const nodes = all_nodes.slice(0, limit);
        const svg = d3.select(svgChart.current);
        svg.selectAll("*").remove();
        return () => {
        };
    }, [limit]);


    //FORCE
    React.useEffect(() => {
        const nodes = all_nodes.slice(0, limit);

        const svg = d3.select(svgChart.current);
        var simulation = d3.forceSimulation(nodes)
            .force('x', d3.forceX(width / 2).strength(center_force / 10000))
            .force('y', d3.forceY(height / 2).strength(center_force / 10000))
            .force('collide', d3.forceCollide(radius * (collide_force)))
            .force("charge", d3.forceManyBody().strength(attraction_force / 100))
            .on('tick', ticked)
            .stop()

        drawChart(svgChart, height, width, nodes, arrows, radius, cluster_color, HandleSelectedNodeChange, filterCriteria);

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
        const duration = 10000; // 1 seconds
        // Start the simulation
        simulation.restart();
        // Set a timeout to stop the simulation after the specified duration
        const timeout = setTimeout(stopSimulation, duration);
        // Clean up the timeout when the component unmounts or the duration changes
        return () => clearTimeout(timeout);
    }, [center_force, collide_force, attraction_force, limit, filterCriteria]);


    React.useEffect(() => {
        const svg = d3.select(svgChart.current);
        const zoom = d3.zoom()
                .scaleExtent([0.9, 2])
                // .translateExtent([[0, 0], [width, height]])
                .on('zoom', zoomed);
        svg.call(zoom);

        function zoomed(event) {
            const { transform } = event;
            svg.attr('transform', transform)
                .append('g');
            // svg.attr('style', `clip-path: inset(0px ${-transform.x}px ${-transform.y}px 0px)`);
        }

        return () => {
            svg.on('.zoom', null);
        };
    }, []);

    return ([<div id="chart">
        <svg ref={svgChart} />
    </div>]

    );
};