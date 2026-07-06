export const API_URL = import.meta.env.VITE_API_URL || '';

export const fetcher = async (url: string, options?: RequestInit) => {
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  // Allow passing FormData by removing Content-Type header so browser sets it with boundary
  if (options?.body instanceof FormData) {
    const headers = new Headers(mergedOptions.headers);
    headers.delete('Content-Type');
    mergedOptions.headers = headers;
  }

  const response = await fetch(`${API_URL}${url}`, mergedOptions);
  
  // Try to parse json, fallback to empty object
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'An error occurred during fetch');
  }
  
  return data;
};
