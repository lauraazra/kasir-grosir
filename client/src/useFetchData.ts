import { useState, useEffect } from "react";

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetchData = <T>(endpoint: string): UseFetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const cleanEndpoint = endpoint.replace(/^\/?(api\/)?/, "");
    const url = `/api/${cleanEndpoint}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data dari server");
        return res.json();
      })
      .then((data: T) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [endpoint]);

  return { data, loading, error };
};
