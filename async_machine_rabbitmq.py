# import json
# import asyncio
# import random
# from datetime import datetime
# from typing import Dict, Optional
# import pika
# from pika.adapters.asyncio_connection import AsyncioConnection
# from pika.exchange_type import ExchangeType

# # RabbitMQ Configuration
# BROKER = "localhost"
# PORT = 5672
# USERNAME = "guest"
# PASSWORD = "guest"
# VHOST = "/"

# machine_ids = [
#     'PMC-01', 'PMC-02', 'PMC-03', 'PMC-04', 'PMC-05',
#     'PMC-06', 'PMC-07', 'PMC-08', 'PMC-09', 'PMC-10',
#     'PMC-11', 'PMC-12', 'PMC-13', 'PMC-14', 'PMC-15'
# ]


# class MachinePublisher:
#     """Simulates individual machine with its own publishing logic and state"""
    
#     def __init__(self, machine_id: str, broker: str, port: int, username: str, password: str, vhost: str):
#         self.machine_id = machine_id
#         self.broker = broker
#         self.port = port
#         self.username = username
#         self.password = password
#         self.vhost = vhost
        
#         self.connection: Optional[AsyncioConnection] = None
#         self.channel = None
#         self.connected = False
#         self.connect_error = None
        
#         # Queue/routing key for this machine (convert slashes to dots)
#         self.routing_key = f"factory.machine.{self.machine_id}"
#         self.queue_name = self.routing_key
        
#         # Machine-specific characteristics for realistic simulation
#         self.base_cycle_time = random.uniform(0.5, 2.0)  # seconds per cycle
#         self.reliability = random.uniform(0.85, 0.98)  # uptime probability
#         self.current_status = 'Idle'
#         self.product_count = 0
#         self.cycle_count = 0
        
#         # Event for connection readiness
#         self.ready_event = asyncio.Event()
    
#     def _on_connection_open(self, connection):
#         """Callback when connection is established"""
#         print(f"[{self.machine_id}] Connection opened")
#         self.connection = connection
#         self.connection.channel(on_open_callback=self._on_channel_open)
    
#     def _on_channel_open(self, channel):
#         """Callback when channel is established"""
#         print(f"[{self.machine_id}] Channel opened")
#         self.channel = channel
        
#         # Declare queue for this machine
#         self.channel.queue_declare(
#             queue=self.queue_name,
#             durable=True,
#             callback=self._on_queue_declared
#         )
    
#     def _on_queue_declared(self, frame):
#         """Callback when queue is declared"""
#         print(f"[{self.machine_id}] Queue declared: {self.queue_name}")
#         self.connected = True
#         self.ready_event.set()
    
#     def _on_connection_error(self, connection, error):
#         """Callback for connection errors"""
#         self.connect_error = error
#         print(f"[{self.machine_id}] Connection error: {error}")
#         self.ready_event.set()
    
#     def _on_connection_closed(self, connection, reason):
#         """Callback when connection is closed"""
#         self.connected = False
#         print(f"[{self.machine_id}] Connection closed: {reason}")
    
#     async def connect(self):
#         """Connect to RabbitMQ broker asynchronously"""
#         try:
#             # Create connection parameters
#             credentials = pika.PlainCredentials(self.username, self.password)
#             parameters = pika.ConnectionParameters(
#                 host=self.broker,
#                 port=self.port,
#                 virtual_host=self.vhost,
#                 credentials=credentials,
#                 heartbeat=600,
#                 blocked_connection_timeout=300
#             )
            
#             # Create async connection
#             self.connection = AsyncioConnection(
#                 parameters,
#                 on_open_callback=self._on_connection_open,
#                 on_open_error_callback=self._on_connection_error,
#                 on_close_callback=self._on_connection_closed
#             )
            
#             # Wait for connection to be ready
#             try:
#                 await asyncio.wait_for(self.ready_event.wait(), timeout=10.0)
#             except asyncio.TimeoutError:
#                 raise TimeoutError(f"Connection timeout for {self.machine_id}")
            
#             if self.connect_error:
#                 raise self.connect_error
                
#         except Exception as e:
#             self.connect_error = e
#             print(f"[{self.machine_id}] Connection failed: {e}")
#             raise
    
#     def _update_machine_state(self):
#         """Simulate realistic machine state transitions"""
#         # Random state transitions based on reliability
#         if self.current_status == 'Running':
#             # Machine might stop or go idle
#             rand = random.random()
#             if rand > self.reliability:
#                 self.current_status = random.choice(['Idle', 'Stopped'])
#             # Increment production counters
#             self.product_count += random.randint(1, 3)
#             self.cycle_count += 1
            
#         elif self.current_status == 'Idle':
#             # Idle machine might start running or stop
#             rand = random.random()
#             if rand > 0.7:
#                 self.current_status = 'Running'
#             elif rand < 0.1:
#                 self.current_status = 'Stopped'
                
#         elif self.current_status == 'Stopped':
#             # Stopped machine might restart
#             if random.random() > 0.8:
#                 self.current_status = 'Idle'
    
#     def _generate_machine_data(self) -> Dict:
#         """Generate realistic machine data based on current state"""
#         self._update_machine_state()
        
#         # State-dependent values
#         if self.current_status == 'Running':
#             temperature = random.randint(70, 80)
#             vibration = round(random.uniform(2.0, 4.0), 2)
#             oee = random.randint(80, 100)
#             oee_actual = random.randint(75, 95)
#         elif self.current_status == 'Idle':
#             temperature = random.randint(60, 70)
#             vibration = round(random.uniform(1.0, 2.5), 2)
#             oee = random.randint(70, 85)
#             oee_actual = random.randint(65, 80)
#         else:  # Stopped
#             temperature = random.randint(60, 65)
#             vibration = round(random.uniform(1.0, 1.5), 2)
#             oee = random.randint(60, 75)
#             oee_actual = random.randint(55, 70)
        
#         return {
#             'status': self.current_status,
#             'count': self.cycle_count,
#             'productCount': self.product_count,
#             'oee': oee,
#             'oeeActual': oee_actual,
#             'temperature': temperature,
#             'vibration': vibration,
#             'timestamp': datetime.utcnow().isoformat() + 'Z'
#         }
    
#     def _publish_message(self, message: Dict):
#         """Synchronously publish message to RabbitMQ"""
#         if not self.channel or not self.connected:
#             return False
        
#         try:
#             self.channel.basic_publish(
#                 exchange='',  # Default exchange
#                 routing_key=self.queue_name,
#                 body=json.dumps(message),
#                 properties=pika.BasicProperties(
#                     delivery_mode=2,  # Make message persistent
#                     content_type='application/json'
#                 )
#             )
#             return True
#         except Exception as e:
#             print(f"[{self.machine_id}] Publish error: {e}")
#             return False
    
#     async def publish_loop(self):
#         """Main publishing loop for this machine"""
#         if not self.connected:
#             print(f"[{self.machine_id}] Skipping - not connected")
#             return
        
#         print(f"[{self.machine_id}] Starting publisher...")
        
#         while True:
#             try:
#                 message = self._generate_machine_data()
                
#                 # Publish in executor to avoid blocking
#                 loop = asyncio.get_event_loop()
#                 success = await loop.run_in_executor(
#                     None,
#                     self._publish_message,
#                     message
#                 )
                
#                 if not success:
#                     print(f"[{self.machine_id}] Publish failed")
                
#                 # Variable delay based on machine state
#                 if self.current_status == 'Running':
#                     delay = self.base_cycle_time * random.uniform(0.8, 1.2)
#                 elif self.current_status == 'Idle':
#                     delay = self.base_cycle_time * random.uniform(2.0, 4.0)
#                 else:  # Stopped
#                     delay = self.base_cycle_time * random.uniform(5.0, 10.0)
                
#                 await asyncio.sleep(delay)
                
#             except Exception as e:
#                 print(f"[{self.machine_id}] Error in publish loop: {e}")
#                 await asyncio.sleep(1)
    
#     async def disconnect(self):
#         """Disconnect from broker"""
#         if self.connection and not self.connection.is_closed:
#             try:
#                 loop = asyncio.get_event_loop()
#                 await loop.run_in_executor(None, self.connection.close)
#                 print(f"[{self.machine_id}] Disconnected")
#             except Exception as e:
#                 print(f"[{self.machine_id}] Error during disconnect: {e}")


# async def main():
#     """Main async function to orchestrate all machine publishers"""
#     publishers = []
    
#     # Create publisher for each machine
#     for machine_id in machine_ids:
#         publisher = MachinePublisher(
#             machine_id, 
#             BROKER, 
#             PORT,
#             USERNAME,
#             PASSWORD,
#             VHOST
#         )
#         publishers.append(publisher)
    
#     # Connect all publishers concurrently with proper error handling
#     print("Connecting all machines to RabbitMQ...")
#     try:
#         connect_results = await asyncio.gather(
#             *[pub.connect() for pub in publishers],
#             return_exceptions=True
#         )
        
#         # Check for connection errors
#         failed_connections = [
#             (i, result) for i, result in enumerate(connect_results)
#             if isinstance(result, Exception)
#         ]
        
#         if failed_connections:
#             print(f"\n{len(failed_connections)} machines failed to connect:")
#             for i, error in failed_connections:
#                 print(f"  - {machine_ids[i]}: {error}")
        
#         successful_publishers = [
#             pub for pub, result in zip(publishers, connect_results)
#             if not isinstance(result, Exception)
#         ]
        
#         print(f"{len(successful_publishers)}/{len(publishers)} machines connected successfully!\n")
        
#         if not successful_publishers:
#             print("No machines connected. Exiting...")
#             return
        
#         # Run publishing loops only for successfully connected machines
#         await asyncio.gather(
#             *[pub.publish_loop() for pub in successful_publishers]
#         )
        
#     except KeyboardInterrupt:
#         print("\nStopping all publishers...")
#     finally:
#         # Disconnect all publishers
#         await asyncio.gather(
#             *[pub.disconnect() for pub in publishers],
#             return_exceptions=True
#         )


# if __name__ == "__main__":
#     try:
#         asyncio.run(main())
#     except KeyboardInterrupt:
#         print("\nShutdown complete")
import json
import asyncio
import random
from datetime import datetime
from typing import Dict
import paho.mqtt.client as mqtt

# RabbitMQ MQTT Configuration
BROKER = "localhost"
PORT = 1883  # RabbitMQ MQTT port (default: 1883)
USERNAME = "guest"
PASSWORD = "guest"

machine_ids = [
    'PMC-01', 'PMC-02', 'PMC-03', 'PMC-04', 'PMC-05',
    'PMC-06', 'PMC-07', 'PMC-08', 'PMC-09', 'PMC-10',
    'PMC-11', 'PMC-12', 'PMC-13', 'PMC-14', 'PMC-15'
]


class MachinePublisher:
    """Simulates individual machine with its own publishing logic and state"""
    
    def __init__(self, machine_id: str, broker: str, port: int, username: str, password: str):
        self.machine_id = machine_id
        self.broker = broker
        self.port = port
        self.username = username
        self.password = password
        
        self.client = None
        self.connected = False
        
        # Topic for this machine (using dot notation for MQTT)
        self.topic = f"factory.machine.{self.machine_id}"
        
        # Machine-specific characteristics for realistic simulation
        self.base_cycle_time = random.uniform(0.5, 2.0)  # seconds per cycle
        self.reliability = random.uniform(0.85, 0.98)  # uptime probability
        self.current_status = 'Idle'
        self.product_count = 0
        self.cycle_count = 0
        
        # Event for connection readiness
        self.ready_event = asyncio.Event()
    
    def on_connect(self, client, userdata, flags, rc):
        """Callback when connection is established"""
        if rc == 0:
            print(f"[{self.machine_id}] Connected to MQTT broker")
            self.connected = True
            self.ready_event.set()
        else:
            print(f"[{self.machine_id}] Connection failed with code {rc}")
            self.ready_event.set()
    
    def on_disconnect(self, client, userdata, rc):
        """Callback when disconnected"""
        self.connected = False
        if rc != 0:
            print(f"[{self.machine_id}] Unexpected disconnection")
    
    def on_publish(self, client, userdata, mid):
        """Callback when message is published"""
        pass  # Silent success
    
    async def connect(self):
        """Connect to RabbitMQ MQTT broker"""
        try:
            # Create MQTT client
            self.client = mqtt.Client(
                client_id=f"machine_publisher_{self.machine_id}",
                clean_session=True,
                protocol=mqtt.MQTTv311
            )
            
            # Set username and password
            self.client.username_pw_set(self.username, self.password)
            
            # Set callbacks
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            self.client.on_publish = self.on_publish
            
            # Connect to broker
            self.client.connect(self.broker, self.port, keepalive=60)
            
            # Start network loop in background
            self.client.loop_start()
            
            # Wait for connection to be ready
            try:
                await asyncio.wait_for(self.ready_event.wait(), timeout=10.0)
            except asyncio.TimeoutError:
                raise TimeoutError(f"Connection timeout for {self.machine_id}")
            
            if not self.connected:
                raise Exception(f"Failed to connect {self.machine_id}")
                
        except Exception as e:
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
            'machineId': self.machine_id,
            'status': self.current_status,
            'count': self.cycle_count,
            'productCount': self.product_count,
            'oee': oee,
            'oeeActual': oee_actual,
            'temperature': temperature,
            'vibration': vibration,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
    
    def _publish_message(self, message: Dict):
        """Publish message to RabbitMQ via MQTT"""
        if not self.client or not self.connected:
            return False
        
        try:
            payload = json.dumps(message)
            result = self.client.publish(
                self.topic,
                payload,
                qos=1,
                retain=False
            )
            
            return result.rc == mqtt.MQTT_ERR_SUCCESS
        except Exception as e:
            print(f"[{self.machine_id}] Publish error: {e}")
            return False
    
    async def publish_loop(self):
        """Main publishing loop for this machine"""
        if not self.connected:
            print(f"[{self.machine_id}] Skipping - not connected")
            return
        
        print(f"[{self.machine_id}] Starting publisher on topic: {self.topic}")
        
        while self.connected:
            try:
                message = self._generate_machine_data()
                
                # Publish in executor to avoid blocking
                loop = asyncio.get_event_loop()
                success = await loop.run_in_executor(
                    None,
                    self._publish_message,
                    message
                )
                
                if not success:
                    print(f"[{self.machine_id}] Publish failed")
                
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
                self.client.disconnect()
                print(f"[{self.machine_id}] Disconnected")
            except Exception as e:
                print(f"[{self.machine_id}] Error during disconnect: {e}")


async def main():
    """Main async function to orchestrate all machine publishers"""
    publishers = []
    
    # Create publisher for each machine
    for machine_id in machine_ids:
        publisher = MachinePublisher(
            machine_id, 
            BROKER, 
            PORT,
            USERNAME,
            PASSWORD
        )
        publishers.append(publisher)
    
    # Connect all publishers concurrently with proper error handling
    print("Connecting all machines to RabbitMQ MQTT...")
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
        
        print(f"\n{len(successful_publishers)}/{len(publishers)} machines connected successfully!\n")
        
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