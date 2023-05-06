import React, { useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { ChartJSOptions, DoughnoutChartProps } from "./types";
import { openAI } from "../../../utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<DoughnoutChartProps> = ({ data }) => {
  const [result, setResult] = useState<string | undefined>('');
  const chartRef = useRef<any>(null);

  const singleCount = data.filter((item) => item.marital_status === "single").length;
  const marriedCount = data.filter((item) => item.marital_status === "married").length;
  const widowCount = data.filter((item) => item.marital_status === "widow").length;

  const labels = ["Solteros", "Casados", "Viudos"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: [singleCount, marriedCount, widowCount],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartJSOptions = {
    title: {
      display: true,
      text: "Income Distribution by Marital Status",
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const handleClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
  
    const prompt =  `Se desea crear un negocio orientado al rubro de la moda. Para ello, se desea recibir recomendaciones para saber qué tipo de negocio de moda abrir. Por esta razón, se realizó una encuesta a 10 personas, de las cuales se obtuvieron los siguientes datos en formato JSON: ${jsonData}. Con base en estos datos, al comparar la cantidad de personas por su estado civil, ¿podrías darme una recomendación sabiendo que tu rol desde el que debes dar tu recomendacion es de ${labels[index]}, cuyo valor en la grafica es de ${value}.`;
  
    const response = await openAI.createCompletion({
      n: 1,
      model: "text-davinci-003", //"text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 200,
    });
    
    setResult(response.data.choices[0].text);

  
  };

  return (
    <>
      <div className="chart-container" style={{position: 'relative',  width:'800px'}}>
        <Doughnut data={chartData} options={chartOptions} onClick={handleClick} ref={chartRef} />
      </div>
      <div>{result}</div>
    </>
  );
};

export default DoughnutChart;