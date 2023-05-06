import React, { useRef, useState } from "react";
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
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { openAI } from "../../../utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
  

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const [result, setResult] = useState<string | undefined>('');
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
    const labels = ['Male', 'Female'];
  
    const chartData = {
      labels: labels,
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
        maintainAspectRatio: false,
        responsive: true,
    };

    const onClick = async(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        // Get value of bar
        const chartData = getElementAtEvent(chartRef.current, event)
        const element = chartData[0].element;
        const index = chartData[0].index;
        let value = 0;

        if('$context' in element) {
            const { $context } = element;
            const context = $context as any;
            if('raw' in context) {
                value = context.raw;
            }
        }

        // Make request to OpenAI
        const jsonData = JSON.stringify(data);
        const prompt =  `Se desea crear un negocio orientado al rubro de la moda. Para ello, se desea conocer el perfil de los clientes potenciales. Por esta razón, se realizó una encuesta a 10 personas, de las cuales se obtuvieron los siguientes datos en formato JSON: ${jsonData}. Con base en estos datos, al comparar los ingresos promedio de hombres y mujeres, ¿podrías darme una recomendación sabiendo que el ingreso promedio de los hombres es de ${maleIncomeAvg} y el de las mujeres es de ${femaleIncomeAvg}? Tu rol desde el que debes dar tu recomendacion es de ${labels[index]}, cuyo valor en la grafica es de ${value}.`;
        
        const response = await openAI.createCompletion({
          n: 1,
          model: "text-davinci-003", //"text-davinci-003",
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 200,
        });
        
        setResult(response.data.choices[0].text);
    }

  return (
    <>
        <div className="chart-container" style={{position: 'relative',  width:'800px'}}>
            <Bar data={chartData} options={options} ref={chartRef} onClick={onClick}  />
        </div>
        <div>{result}</div>
    </>
  );
};

export default BarChart;