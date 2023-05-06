import React, { useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, getElementAtEvent } from 'react-chartjs-2';
import { ChartJSOptions, LineChartProps } from './types';
import { openAI } from '../../../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const [result, setResult] = useState<string | undefined>('');
    const chartRef = useRef<any>(null);

  // Creamos dos arreglos, uno con las edades y otro con los ingresos, para usarlos como datos en el gráfico
  const ages = data.map(item => item.age);
  const incomes = data.map(item => item.income);

  // Configuramos los datos para el gráfico
  const chartData = {
    labels: ages,
    datasets: [
      {
        label: 'Ingresos',
        data: incomes,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Configuramos las opciones del gráfico
  const chartOptions: ChartJSOptions = {
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
    
    const prompt =  `Se desea crear un negocio orientado al rubro de la moda. Para ello, se desea recibir recomendaciones para saber qué tipo de negocio de moda abrir. Por esta razón, se realizó una encuesta a 10 personas, de las cuales se obtuvieron los siguientes datos en formato JSON: ${jsonData}. Con base en estos datos, se hizo un gráfico lineal sobre la relación entre la edad de las personas y sus ingresos. ¿Podrías darme una recomendación sabiendo que tu rol desde el que debes dar tu recomendacion es de ${ages[index]}, cuyo valor en la grafica es de ${value}.`;
    
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
            <Line data={chartData} options={chartOptions} onClick={handleClick} ref={chartRef} />
        </div>
        <div>{result}</div>
    </>
  );
};

export default LineChart;
