export async function GET() {
  try {
    const response = await fetch('http://localhost:5100/api/publishers');
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching publishers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch publishers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}