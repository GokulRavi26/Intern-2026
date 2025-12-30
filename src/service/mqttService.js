import mqtt from 'mqtt';

class MQTTService {
  constructor() {
    this.client = null;
    this.subscribers = new Map();
    this.isConnected = false;
  }

  connect(brokerUrl = 'ws://localhost:9001', options = {}) {
    if (this.client) {
      console.warn('MQTT client already connected');
      return;
    }

    const defaultOptions = {
      clientId: `factory_client_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      ...options
    };

    try {
      this.client = mqtt.connect(brokerUrl, defaultOptions);

      this.client.on('connect', () => {
        console.log('✅ MQTT Connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('❌ MQTT Connection error:', err);
        this.isConnected = false;
      });

      this.client.on('offline', () => {
        console.warn('⚠️ MQTT Client offline');
        this.isConnected = false;
      });

      this.client.on('reconnect', () => {
        console.log('🔄 MQTT Reconnecting...');
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });

    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
    }
  }

  handleMessage(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      
      // Notify all subscribers for this topic
      if (this.subscribers.has(topic)) {
        this.subscribers.get(topic).forEach(callback => {
          callback(data);
        });
      }
    } catch (error) {
      console.error(`Error parsing message from topic ${topic}:`, error);
    }
  }

  subscribe(topic, callback) {
    if (!this.client) {
      console.error('MQTT client not connected');
      return null;
    }

    // Add callback to subscribers map
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
      
      // Subscribe to the topic
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to: ${topic}`);
        }
      });
    }

    this.subscribers.get(topic).add(callback);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(topic, callback);
    };
  }

  unsubscribe(topic, callback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(callback);

      // If no more subscribers for this topic, unsubscribe from MQTT
      if (this.subscribers.get(topic).size === 0) {
        this.subscribers.delete(topic);
        
        if (this.client) {
          this.client.unsubscribe(topic, (err) => {
            if (err) {
              console.error(`Failed to unsubscribe from ${topic}:`, err);
            } else {
              console.log(`📴 Unsubscribed from: ${topic}`);
            }
          });
        }
      }
    }
  }

  publish(topic, message) {
    if (!this.client || !this.isConnected) {
      console.error('MQTT client not connected');
      return;
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    
    this.client.publish(topic, payload, (err) => {
      if (err) {
        console.error(`Failed to publish to ${topic}:`, err);
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.subscribers.clear();
      this.isConnected = false;
      console.log('🔌 MQTT Disconnected');
    }
  }
}

// Create a singleton instance
const mqttService = new MQTTService();

export default mqttService;