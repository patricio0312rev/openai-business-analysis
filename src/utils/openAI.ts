import { Configuration, OpenAIApi } from 'openai';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openAI = new OpenAIApi(configuration);

export default openAI;
