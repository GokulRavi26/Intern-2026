// src/service/rabbitmqService.js
import mqtt from 'mqtt';

class RabbitMQService {
  constructor() {
    this.client = null;
    this.subscribers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect(options = {}) {
    if (this.client && this.isConnected) {
      console.warn('RabbitMQ client already connected');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const defaultOptions = {
        host: options.host || 'localhost',
        port: options.port || 15675, // RabbitMQ MQTT WebSocket port (default: 15675)
        protocol: 'ws',
        username: options.username || 'guest',
        password: options.password || 'guest',
        clientId: `mqtt_client_${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        keepalive: 60,
      };

      const brokerUrl = `${defaultOptions.protocol}://${defaultOptions.host}:${defaultOptions.port}/ws`;
      
      console.log(`Connecting to RabbitMQ MQTT at ${brokerUrl}...`);

      try {
        this.client = mqtt.connect(brokerUrl, {
          username: defaultOptions.username,
          password: defaultOptions.password,
          clientId: defaultOptions.clientId,
          clean: defaultOptions.clean,
          reconnectPeriod: defaultOptions.reconnectPeriod,
          connectTimeout: defaultOptions.connectTimeout,
          keepalive: defaultOptions.keepalive,
        });

        this.client.on('connect', () => {
          this.onConnect();
          resolve();
        });
        
        this.client.on('error', (error) => {
          this.onError(error);
          if (!this.isConnected) {
            reject(error);
          }
        });
        
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('close', this.onClose.bind(this));
        this.client.on('reconnect', this.onReconnect.bind(this));

      } catch (error) {
        console.error('Failed to connect to RabbitMQ broker:', error);
        reject(error);
      }
    });
  }

  onConnect() {
    console.log('✅ RabbitMQ Connected via MQTT');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Resubscribe to all topics after reconnection
    this.subscribers.forEach((callbacks, topic) => {
      this.client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Failed to resubscribe to ${topic}:`, err);
        } else {
          console.log(`📡 Resubscribed to: ${topic}`);
        }
      });
    });
  }

  onError(error) {
    console.error('❌ RabbitMQ Connection error:', error);
    this.isConnected = false;
  }

  onClose() {
    console.log('🔌 RabbitMQ Connection closed');
    this.isConnected = false;
  }

  onReconnect() {
    this.reconnectAttempts++;
    console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts})`);
  }

  onMessage(topic, message) {
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
      console.error('Raw message:', message.toString());
    }
  }

  subscribe(topic, callback) {
    if (!this.client) {
      console.error('RabbitMQ client not initialized');
      return null;
    }

    // Keep topic format as is: factory.machine.{id}
    const mqttTopic = topic;

    // Add callback to subscribers map
    if (!this.subscribers.has(mqttTopic)) {
      this.subscribers.set(mqttTopic, new Set());
      
      // Subscribe to the topic if connected
      if (this.isConnected) {
        this.client.subscribe(mqttTopic, { qos: 1 }, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${mqttTopic}:`, err);
          } else {
            console.log(`📡 Subscribed to: ${mqttTopic}`);
          }
        });
      }
    }

    this.subscribers.get(mqttTopic).add(callback);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(mqttTopic, callback);
    };
  }

  unsubscribe(topic, callback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(callback);

      // If no more subscribers for this topic, unsubscribe from RabbitMQ
      if (this.subscribers.get(topic).size === 0) {
        this.subscribers.delete(topic);
        
        if (this.client && this.isConnected) {
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
      console.error('RabbitMQ client not connected');
      return;
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    
    this.client.publish(topic, payload, { qos: 1, retain: false }, (err) => {
      if (err) {
        console.error(`Failed to publish to ${topic}:`, err);
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end(false, () => {
        console.log('🔌 RabbitMQ Disconnected');
      });
      this.client = null;
      this.subscribers.clear();
      this.isConnected = false;
    }
  }

  // Helper method to check connection status
  isClientConnected() {
    return this.isConnected && this.client && this.client.connected;
  }
}

// Create a singleton instance
const rabbitmqService = new RabbitMQService();

export default rabbitmqService;