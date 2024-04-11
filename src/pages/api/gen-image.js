

import OpenAI from "openai";

const openai = new OpenAI();

const generateImageWithDallE = async ({ item, size }) =>{

  const prompt = `create simple one ${item} dashed outline image for kids to follow drawing lines`
  console.log("prompt: ", prompt)
  return openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 1,
    size: size,
    response_format: 'b64_json'
  })
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log("req.body", req.body)
      const response = await generateImageWithDallE(req.body)
      console.log("response", response);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.response?.status || 500).json({ message: error.message });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}