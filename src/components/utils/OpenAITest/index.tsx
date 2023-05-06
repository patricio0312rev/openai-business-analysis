import { useState } from 'react';
import { openAI } from '../../../utils';

const OpenAITest = () => {
  const [result, setResult] = useState<string | undefined>('');

  const request = async () => {
    const prompt = 'Hello, world!';
    const response = await openAI.createCompletion({
      
      n: 1,
      model: "text-davinci-003", //"text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 200,
    });
    
    console.log("response", response.data.choices[0].text);
    setResult(response.data.choices[0].text);
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      request();
    } catch (e) {
      //console.log(e);
      setResult("Something is going wrong, Please try again.");
    }
  };

  return (
    <>
      <button onClick={(e) => handleSubmit(e)}>Generate</button>
      <div>{result}</div>
    </>
  );
};

export default OpenAITest;