export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(req.body)
      })
      const data = await openaiResponse.json()

      res.status(openaiResponse.status).json(data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ message: error.message });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
}