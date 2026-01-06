
import json
import asyncio
import random
from datetime import datetime
from typing import Dict
import paho.mqtt.client as mqtt

# ============================
# RabbitMQ MQTT Configuration
# ============================
BROKER = "localhost"
PORT = 1883
USERNAME = "guest"
PASSWORD = "guest"

PUBLISH_INTERVAL = 0.1  # 🔥 FAST updates

machine_ids = [
    'PMC-01', 'PMC-02', 'PMC-03', 'PMC-04', 'PMC-05',
    'PMC-06', 'PMC-07', 'PMC-08', 'PMC-09', 'PMC-10',
    'PMC-11', 'PMC-12', 'PMC-13', 'PMC-14', 'PMC-15'
]


class MachinePublisher:
    def __init__(self, machine_id: str):
        self.machine_id = machine_id
        self.topic = f"factory.machine.{machine_id}"

        self.client = mqtt.Client(
            client_id=f"machine_{machine_id}",
            protocol=mqtt.MQTTv311,
            clean_session=True
        )

        self.client.username_pw_set(USERNAME, PASSWORD)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect

        self.connected = False
        self.ready_event = asyncio.Event()

        # Machine state
        self.current_status = "Idle"
        self.product_count = 0
        self.cycle_count = 0
        self.reliability = random.uniform(0.9, 0.98)

    # ======================
    # MQTT Callbacks
    # ======================
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            self.ready_event.set()
            print(f"[{self.machine_id}] ✅ Connected")
        else:
            print(f"[{self.machine_id}] ❌ Connection failed ({rc})")

    def on_disconnect(self, client, userdata, rc):
        self.connected = False
        print(f"[{self.machine_id}] 🔌 Disconnected")

    # ======================
    # Connection
    # ======================
    async def connect(self):
        self.client.connect(BROKER, PORT, keepalive=60)
        self.client.loop_start()
        await asyncio.wait_for(self.ready_event.wait(), timeout=10)

    # ======================
    # Simulation Logic
    # ======================
    def _update_state(self):
        if self.current_status == "Running":
            if random.random() > self.reliability:
                self.current_status = random.choice(["Idle", "Stopped"])
            self.product_count += random.randint(1, 3)
            self.cycle_count += 1

        elif self.current_status == "Idle":
            if random.random() > 0.7:
                self.current_status = "Running"
            elif random.random() < 0.1:
                self.current_status = "Stopped"

        elif self.current_status == "Stopped":
            if random.random() > 0.8:
                self.current_status = "Idle"

    def _generate_data(self) -> Dict:
        self._update_state()

        if self.current_status == "Running":
            temperature = random.randint(70, 80)
            vibration = round(random.uniform(2.0, 4.0), 2)
            oee = random.randint(85, 100)
        elif self.current_status == "Idle":
            temperature = random.randint(60, 70)
            vibration = round(random.uniform(1.0, 2.5), 2)
            oee = random.randint(70, 85)
        else:
            temperature = random.randint(55, 65)
            vibration = round(random.uniform(0.5, 1.5), 2)
            oee = random.randint(60, 70)

        return {
            "machineId": self.machine_id,
            "status": self.current_status,
            "count": self.cycle_count,
            "productCount": self.product_count,
            "temperature": temperature,
            "vibration": vibration,
            "oee": oee,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    # ======================
    # Publish Loop
    # ======================
    async def publish_loop(self):
        print(f"[{self.machine_id}] 🚀 Publishing on {self.topic}")
        while self.connected:
            self.client.publish(
                self.topic,
                json.dumps(self._generate_data()),
                qos=0,
                retain=False
            )
            await asyncio.sleep(PUBLISH_INTERVAL)

    async def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()


# ======================
# MAIN
# ======================
async def main():
    publishers = [MachinePublisher(mid) for mid in machine_ids]

    try:
        # Connect all machines
        await asyncio.gather(*(p.connect() for p in publishers))
        print("\n✅ All machines connected\n")

        # Start publishing
        await asyncio.gather(*(p.publish_loop() for p in publishers))

    except asyncio.CancelledError:
        print("🛑 Tasks cancelled")

    finally:
        print("🔻 Disconnecting machines...")
        await asyncio.gather(*(p.disconnect() for p in publishers))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Publisher stopped by user")
