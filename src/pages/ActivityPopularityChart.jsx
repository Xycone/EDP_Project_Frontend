import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ActivityPopularityChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && data) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Popularity',
                        data: data.values,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)', // Orange color with 20% opacity
                        borderColor: 'rgba(255, 159, 64, 1)', // Orange color with full opacity
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [data]);

    return <canvas ref={chartRef} />;
}

export default ActivityPopularityChart;
