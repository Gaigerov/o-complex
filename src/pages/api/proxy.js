export default async function handler(req, res) {
  const { page, page_size } = req.query;
  const apiUrl = `http://o-complex.com:1337/products?page=${page}&page_size=${page_size || 6}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
