import { useEffect, useState } from 'react';

const useServerStatus = () => {
  const [serverReady, setServerReady] = useState(false);

  // Get base URL from env variable or default to production URL
const baseUrl = process.env.REACT_APP_API_URL || 'https://pokemon-card-game-pbfr.onrender.com';

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/healthcheck`);
        if (res.ok) {
          setServerReady(true);
        }
      } catch (err) {
        console.log('Server not ready yet...');
      }
    };

    checkServer();

    const interval = setInterval(() => {
      if (!serverReady) checkServer();
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [serverReady, baseUrl]);

  return serverReady;
};

export default useServerStatus;
