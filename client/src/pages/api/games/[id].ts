export async function GET(context: any) {
  try {
    const { id } = context.params;
    
    const response = await fetch(`http://localhost:5100/api/games/${id}`);
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch game' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}