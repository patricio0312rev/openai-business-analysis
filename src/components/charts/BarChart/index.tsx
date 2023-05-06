import React, { useRef } from "react";
import { BarChartProps, ChartJSOptions } from "./types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, getDatasetAtEvent, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const chartRef = useRef<any>(null);
    const maleIncomeSum = data.reduce((acc, d) => {
      if (d.gender === 'male') {
        return acc + d.income;
      }
      return acc;
    }, 0);
  
    const femaleIncomeSum = data.reduce((acc, d) => {
      if (d.gender === 'female') {
        return acc + d.income;
      }
      return acc;
    }, 0);
  
    const maleIncomeAvg = maleIncomeSum / data.filter(d => d.gender === 'male').length;
    const femaleIncomeAvg = femaleIncomeSum / data.filter(d => d.gender === 'female').length;
  
    const chartData = {
      labels: ['Male', 'Female'],
      datasets: [
        {
          label: 'Income',
          data: [maleIncomeAvg, femaleIncomeAvg],
          backgroundColor: ['#66b2ff', '#ff66b2'],
        },
      ],
    };
  
    const options: ChartJSOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    },
                },
            ],
        },
    };

    const onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const data = getElementAtEvent(chartRef.current, event)
        const element = data[0].element;
        let value = 0;

        if('$context' in element) {
            const { $context } = element;
            const context = $context as any;
            if('raw' in context) {
                value = context.raw;
            }
        }

        
    }

  return (
    <div>
      <Bar data={chartData} options={options} ref={chartRef} onClick={onClick}  />
    </div>
  );
};

export default BarChart;