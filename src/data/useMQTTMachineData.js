// src/data/useMQTTMachineData.js
import { useEffect, useState } from "react";
import mqttService from "../service/mqttService";

export function useMQTTMachineData(machineId) {
  const [data, setData] = useState({
    status: "Connecting...",
    count: 0,
    oee: 0,
    speed: 0,
    temperature: 0,
    vibration: 0,
    timestamp: null
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Topic format: factory/machine/{machineId}
    const topic = `factory/machine/${machineId}`;

    // Subscribe to the machine-specific topic
    const unsubscribe = mqttService.subscribe(topic, (mqttData) => {
      setData({
        status: mqttData.status || "Unknown",
        count: mqttData.count || mqttData.productCount || 0,
        oee: mqttData.oee || mqttData.oeeActual || 0,
        speed: mqttData.speed || 0,
        temperature: mqttData.temperature || 0,
        vibration: mqttData.vibration || 0,
        // timestamp: mqttData.timestamp || new Date().toISOString()
      });
      setIsConnected(true);
    });

    // Fallback: If no data received within 5 seconds, show offline status
    const timeoutId = setTimeout(() => {
      if (!isConnected) {
        setData(prev => ({
          ...prev,
          status: "Offline"
        }));
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [machineId, isConnected]);

  return { data, isConnected };
}