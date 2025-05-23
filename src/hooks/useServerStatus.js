import { useEffect, useState } from 'react';

const useServerStatus = () => {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('https://pokemon-card-game-pbfr.onrender.com/api/healthcheck');
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
  }, [serverReady]);

  return serverReady;
};

export default useServerStatus;
