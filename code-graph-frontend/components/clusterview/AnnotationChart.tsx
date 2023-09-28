import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const AnnotationChart = ({ jsonData }) => {
  // Assumption: jsonData is an array of objects containing the provided JSON format
  // Example: [{ "sentence": "...", "segment": "...", "annotation": 51, ... }, ...]

  // Extract x and y data from the JSON
  const xLabels = jsonData.map((entry) => entry.annotation);
  const yData = jsonData.map((entry, index) => index + 1); // Assuming y-axis represents the number of annotations

  // Chart.js data configuration
  const chartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Annotations',
        data: yData,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart.js options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Annotations',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Annotations',
        },
      },
    },
  };

  return (
    <div className="annotation-chart">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default AnnotationChart;
