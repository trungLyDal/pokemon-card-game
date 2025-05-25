import { useEffect, useState } from 'react';

const useServerStatus = () => {
  const [serverReady, setServerReady] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL || 'https://pokemon-card-game-xi.vercel.app/';

  useEffect(() => {
    let attempt = 0;
    const delays = [1000, 1000, 2000, 4000, 6000, 8000]; // Fast start, slow later
    let timeoutId;

    const checkServer = async () => {
      const now = new Date().toLocaleTimeString();
      console.log(`[${now}] ⏳ Checking server (attempt ${attempt + 1})...`);

      try {
        const res = await fetch(`${baseUrl}/api/healthcheck`);
        if (res.ok) {
          console.log(`[${now}] ✅ Server is ready!`);
          setServerReady(true);
          return;
        }
      } catch {
        console.log(`[${now}] ❌ Still waking up...`);
      }

      // Schedule next check
      const delay = attempt < delays.length ? delays[attempt] : delays[delays.length - 1];
      attempt++;
      timeoutId = setTimeout(checkServer, delay);
    };

    checkServer();

    return () => clearTimeout(timeoutId);
  }, [baseUrl]);

  return serverReady;
};

export default useServerStatus;
