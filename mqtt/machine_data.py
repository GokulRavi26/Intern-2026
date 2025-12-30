import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt

# MQTT Configuration
BROKER = "localhost"
PORT = 1883

# Connect to broker
client = mqtt.Client(client_id="test_publisher_python")
client.connect(BROKER, PORT)

machine_ids = [
    'PMC-01', 'PMC-02', 'PMC-03', 'PMC-04', 'PMC-05',
    'PMC-06', 'PMC-07', 'PMC-08', 'PMC-09', 'PMC-10',
    'PMC-11', 'PMC-12', 'PMC-13', 'PMC-14', 'PMC-15'
]

def publish_machine_data():
    while True:
        for machine_id in machine_ids:
            status = random.choice(['Running', 'Idle', 'Stopped'])
            
            message = {
                'status': status,
                'count': random.randint(0, 500),
                'productCount': random.randint(0, 500),
                'oee': random.randint(70, 100),
                'oeeActual': random.randint(70, 100),
                # 'speed': random.randint(800, 1200) if status == 'Running' else 0,
                'temperature': random.randint(60, 80),
                'vibration': round(random.uniform(1, 4), 2),
                # 'timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            
            topic = f"factory/machine/{machine_id}"
            client.publish(topic, json.dumps(message))
            print(f"📤 Published to {topic}: {message}")
            time.sleep(0.1)
        
        time.sleep(0.1)
try:
    publish_machine_data()
except KeyboardInterrupt:
    print("Stopping publisher...")
    client.disconnect()
