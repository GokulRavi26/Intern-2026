import json
import asyncio
import random
from datetime import datetime
from typing import Dict, Optional
import paho.mqtt.client as mqtt
 
# MQTT Configuration
BROKER = "192.168.0.102"
PORT = 1883
 
machine_ids = [
    'PMC-01', 'PMC-02', 'PMC-03', 'PMC-04', 'PMC-05',
    'PMC-06', 'PMC-07', 'PMC-08', 'PMC-09', 'PMC-10',
    'PMC-11', 'PMC-12', 'PMC-13', 'PMC-14', 'PMC-15'
]
 
 
class MachinePublisher:
    """Simulates individual machine with its own publishing logic and state"""
   
    def __init__(self, machine_id: str, broker: str, port: int):
        self.machine_id = machine_id
        self.broker = broker
        self.port = port
        self.client: Optional[mqtt.Client] = None
        self.connected = False
        self.connect_error = None
       
        # Machine-specific characteristics for realistic simulation
        self.base_cycle_time = random.uniform(0.5, 2.0)  # seconds per cycle
        self.reliability = random.uniform(0.85, 0.98)  # uptime probability
        self.current_status = 'Idle'
        self.product_count = 0
        self.cycle_count = 0
       
    async def connect(self):
        """Connect to MQTT broker asynchronously"""
        try:
            loop = asyncio.get_event_loop()
           
            # Use CallbackAPIVersion.VERSION2 for paho-mqtt 2.0+
            self.client = mqtt.Client(
                callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
                client_id=f"publisher_{self.machine_id}"
            )
           
            # Updated callback signature for VERSION2
            def on_connect(client, userdata, flags, reason_code, properties):
                self.connected = True
                print(f"[{self.machine_id}] Connected with reason code: {reason_code}")
           
            def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
                self.connected = False
                print(f"[{self.machine_id}] Disconnected with reason code: {reason_code}")
           
            self.client.on_connect = on_connect
            self.client.on_disconnect = on_disconnect
           
            # Run connect in executor to avoid blocking
            await loop.run_in_executor(None, self.client.connect, self.broker, self.port)
            self.client.loop_start()
           
            # Wait for connection with timeout
            timeout = 10
            start_time = asyncio.get_event_loop().time()
            while not self.connected:
                if asyncio.get_event_loop().time() - start_time > timeout:
                    raise TimeoutError(f"Connection timeout for {self.machine_id}")
                await asyncio.sleep(0.1)
               
        except Exception as e:
            self.connect_error = e
            print(f"[{self.machine_id}] Connection failed: {e}")
            raise
   
    def _update_machine_state(self):
        """Simulate realistic machine state transitions"""
        # Random state transitions based on reliability
        if self.current_status == 'Running':
            # Machine might stop or go idle
            rand = random.random()
            if rand > self.reliability:
                self.current_status = random.choice(['Idle', 'Stopped'])
            # Increment production counters
            self.product_count += random.randint(1, 3)
            self.cycle_count += 1
           
        elif self.current_status == 'Idle':
            # Idle machine might start running or stop
            rand = random.random()
            if rand > 0.7:
                self.current_status = 'Running'
            elif rand < 0.1:
                self.current_status = 'Stopped'
               
        elif self.current_status == 'Stopped':
            # Stopped machine might restart
            if random.random() > 0.8:
                self.current_status = 'Idle'
   
    def _generate_machine_data(self) -> Dict:
        """Generate realistic machine data based on current state"""
        self._update_machine_state()
       
        # State-dependent values
        if self.current_status == 'Running':
            temperature = random.randint(70, 80)
            vibration = round(random.uniform(2.0, 4.0), 2)
            oee = random.randint(80, 100)
            oee_actual = random.randint(75, 95)
        elif self.current_status == 'Idle':
            temperature = random.randint(60, 70)
            vibration = round(random.uniform(1.0, 2.5), 2)
            oee = random.randint(70, 85)
            oee_actual = random.randint(65, 80)
        else:  # Stopped
            temperature = random.randint(60, 65)
            vibration = round(random.uniform(1.0, 1.5), 2)
            oee = random.randint(60, 75)
            oee_actual = random.randint(55, 70)
       
        return {
            'status': self.current_status,
            'count': self.cycle_count,
            'productCount': self.product_count,
            'oee': oee,
            'oeeActual': oee_actual,
            'temperature': temperature,
            'vibration': vibration,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
   
    async def publish_loop(self):
        """Main publishing loop for this machine"""
        if not self.connected:
            print(f"[{self.machine_id}] Skipping - not connected")
            return
           
        print(f"[{self.machine_id}] Starting publisher...")
       
        while True:
            try:
                message = self._generate_machine_data()
                topic = f"factory/machine/{self.machine_id}"
               
                # Publish in executor to avoid blocking
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None,
                    self.client.publish,
                    topic,
                    json.dumps(message),
                    1  # QoS
                )
               
                # Check if publish was successful
                if result.rc != mqtt.MQTT_ERR_SUCCESS:
                    print(f"[{self.machine_id}] Publish failed: {result.rc}")
               
                # Variable delay based on machine state
                if self.current_status == 'Running':
                    delay = self.base_cycle_time * random.uniform(0.8, 1.2)
                elif self.current_status == 'Idle':
                    delay = self.base_cycle_time * random.uniform(2.0, 4.0)
                else:  # Stopped
                    delay = self.base_cycle_time * random.uniform(5.0, 10.0)
               
                await asyncio.sleep(delay)
               
            except Exception as e:
                print(f"[{self.machine_id}] Error in publish loop: {e}")
                await asyncio.sleep(1)
   
    async def disconnect(self):
        """Disconnect from broker"""
        if self.client:
            try:
                self.client.loop_stop()
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, self.client.disconnect)
                print(f"[{self.machine_id}] Disconnected")
            except Exception as e:
                print(f"[{self.machine_id}] Error during disconnect: {e}")
 
 
async def main():
    """Main async function to orchestrate all machine publishers"""
    publishers = []
   
    # Create publisher for each machine
    for machine_id in machine_ids:
        publisher = MachinePublisher(machine_id, BROKER, PORT)
        publishers.append(publisher)
   
    # Connect all publishers concurrently with proper error handling
    print("Connecting all machines...")
    try:
        connect_results = await asyncio.gather(
            *[pub.connect() for pub in publishers],
            return_exceptions=True
        )
       
        # Check for connection errors
        failed_connections = [
            (i, result) for i, result in enumerate(connect_results)
            if isinstance(result, Exception)
        ]
       
        if failed_connections:
            print(f"\n{len(failed_connections)} machines failed to connect:")
            for i, error in failed_connections:
                print(f"  - {machine_ids[i]}: {error}")
       
        successful_publishers = [
            pub for pub, result in zip(publishers, connect_results)
            if not isinstance(result, Exception)
        ]
       
        print(f"{len(successful_publishers)}/{len(publishers)} machines connected successfully!\n")
       
        if not successful_publishers:
            print("No machines connected. Exiting...")
            return
       
        # Run publishing loops only for successfully connected machines
        await asyncio.gather(
            *[pub.publish_loop() for pub in successful_publishers]
        )
       
    except KeyboardInterrupt:
        print("\nStopping all publishers...")
    finally:
        # Disconnect all publishers
        await asyncio.gather(
            *[pub.disconnect() for pub in publishers],
            return_exceptions=True
        )
 
 
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutdown complete")