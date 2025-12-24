import { useEffect, useState } from "react";

export function useRandomMachineData(machineId) {
  const [data, setData] = useState({
    status: "Idle",
    count: 0,
    oee: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["Running", "Stopped"];

      setData({
        status: statuses[Math.floor(Math.random() * statuses.length)],
        count: Math.floor(Math.random() * 500),
        oee: Math.floor(70 + Math.random() * 30) // 70–100%
      });
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [machineId]);

  return data;
}
