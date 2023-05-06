import './App.css';
import { OpenAITest } from './components/utils';
import { BarChart, BubbleChart, DoughnutChart, LineChart } from './components/charts';
import data from './data/people.json'

function App() {
  return (
    <div className="App">
      <OpenAITest />
      <BarChart data={data} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <DoughnutChart data={data} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <LineChart data={data} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <BubbleChart data={data} />
    </div>
  );
}

export default App;
