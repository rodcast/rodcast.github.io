export const fetchData = async (api: string, errorMessage: string) => {
  const res = await fetch(api);
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(errorMessage);
  }
};
