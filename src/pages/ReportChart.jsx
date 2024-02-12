import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ReportChart({ data }) {
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
                    labels: data.labels, // Months or other categories
                    datasets: [{
                        label: 'Total Sales', // Adjust label as needed
                        data: data.values, // Total sales data for each category
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Sales' // Y-axis label
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Months' // X-axis label
                            }
                        }
                    }
                }
            });
        }
    }, [data]);

    return <canvas ref={chartRef} />;
}

export default ReportChart;
