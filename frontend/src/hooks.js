import { useEffect, useState } from "react";

/** Load from the API; keep fallback data if the backend is offline. */
export function useApi(fetcher, fallback) {
  const [data, setData] = useState(fallback);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let off = false;
    fetcher().then((d) => { if (!off) { setData(d); setLive(true); } }).catch(() => {});
    return () => { off = true; };
    // eslint-disable-next-line
  }, []);
  return [data, live];
}
