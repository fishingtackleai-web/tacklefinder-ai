// api/recommend.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('xAI error:', err);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

export const config = {
  maxDuration: 90   // important — allows up to 90 s on Hobby plan
};
