export const fetchData = async (url: string) => {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), 5000);

  const response = await fetch(url, { signal });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
};
