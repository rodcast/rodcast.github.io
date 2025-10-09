export const fetchData = async (url: string, options?: RequestInit) => {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), 10000);

  const defaultOptions: RequestInit = {
    signal,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'rodcast.github.io/1.0',
    },
    cache: 'default',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout: ${url}`);
      }
      throw error;
    }
    throw new Error('Unknown error occurred while fetching data');
  }
};
