import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as d3fc from "d3fc";

function webgl() {
  const containerRef = useRef<HTMLDivElement>(null); // Specify the type for containerRef

  useEffect(() => {
    const width = 500,
      height = 250;
    const data = d3.range(0, 50).map((d: number) => Math.random());

    const xScale = d3.scaleLinear().domain([0, 50]).range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    console.log(xScale(1), "KK");
    console.log(yScale(1));

    // Important Note: Struggled a lot with this import but i cant import it directly from d3fc
    /* Message:
    Error: require() of ES Module .../Code-Graph-Frontend/node_modules/d3-array/src/index.js from .../Code-Graph-Frontend/node_modules/d3fc/build/d3fc.js not supported.
    Instead change the require of index.js in .../Code-Graph-Frontend/node_modules/d3fc/build/d3fc.js to a dynamic import() which is available in all CommonJS modules.
    */

    import("d3fc/build/d3fc.js")
      .then((d3fc) => {
        const canvasql = d3.select(containerRef.current).append("canvas").attr("width", width).attr("height", height);
        const gl = canvasql.node()!.getContext("webgl");

        const webglLine = d3fc
          .seriesWebglLine()
          .xScale(xScale)
          .yScale(yScale)
          .crossValue((d: number, i: number) => i)
          .mainValue((d: number) => d)
          .context(gl);

        webglLine(data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return <div ref={containerRef}></div>;
}

export default webgl;
