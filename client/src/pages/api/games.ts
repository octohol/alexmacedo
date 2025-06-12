export async function GET(context: any) {
  try {
    const url = new URL(context.request.url);
    const params = url.searchParams;
    
    // Build the backend URL with query parameters
    const backendUrl = new URL('http://localhost:5100/api/games');
    if (params.has('category')) {
      backendUrl.searchParams.set('category', params.get('category')!);
    }
    if (params.has('publisher')) {
      backendUrl.searchParams.set('publisher', params.get('publisher')!);
    }
    
    const response = await fetch(backendUrl.toString());
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch games' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}