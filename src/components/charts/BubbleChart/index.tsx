import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble, getElementAtEvent } from 'react-chartjs-2';
import { BubbleChartProps, ChartJSOptions } from './types';
import { openAI } from '../../../utils';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
    const [result, setResult] = useState<string | undefined>('');
    const chartRef = useRef<any>(null);

  const chartData = {
    datasets: [
      {
        label: 'Clientes',
        data: data.map((d) => ({
          x: d.income,
          y: d.monthly_expense,
          r: d.age / 2
        })),
        backgroundColor: '#69b2f8'
      }
    ]
  };

  const options: ChartJSOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Ingreso Anual (en USD)'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Gasto Mensual (en USD)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataPoint = data[context.dataIndex];
            return `${dataPoint.gender} - ${dataPoint.marital_status}`;
          }
        }
      }
    }
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

    const prompt =  `Se desea crear un negocio orientado al rubro de la moda. Para ello, se desea recibir recomendaciones para saber qué tipo de negocio de moda abrir. Por esta razón, se realizó una encuesta a 10 personas, de las cuales se obtuvieron los siguientes datos en formato JSON: ${jsonData}. Con base en estos datos, se hizo un bubble chart donde el eje X pertenece al ingreso anual en USD, el eje Y son los gastos mensuales en USD y el radio de cada burbuja pertenece a la edad, ¿podrías darme una recomendación sabiendo que tu rol desde el que debes dar tu recomendacion es el punto con tiene los siguientes valores ${JSON.stringify(value)}?`;

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
        <Bubble data={chartData} options={options} onClick={handleClick} ref={chartRef} />
      </div>
      <div>{result}</div>
    </>
    )
};

export default BubbleChart;