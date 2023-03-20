# Imports
import time
import network
import machine
import ubinascii
from umqtt.simple import MQTTClient

# MQTT Library, just run this 1x
# import upip
# upip.install("umqtt.simple")

# Global Variable
INITIAL_VALUE = 0
value = INITIAL_VALUE

# WiFi settings
WIFI_SSID = "Rumah Bagus"
WIFI_PASSWORD = "ibusayang5"
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect(WIFI_SSID, WIFI_PASSWORD)
while not sta_if.isconnected():
    time.sleep(1)
print("Wifi Connected!")

# MQTT settings
MQTT_SERVER = "tcp://0.tcp.ap.ngrok.io"
MQTT_PORT = 13800
MQTT_TOPIC = "status"

client_id = ubinascii.hexlify(machine.unique_id()).decode()
client = MQTTClient(client_id, MQTT_SERVER, port=MQTT_PORT, keepalive=60)
client.connect()

def callbackChange(byteTopic, byteMsg):
    global value
    
    topic = byteTopic.decode()
    msg = byteMsg.decode()
    if (topic == "change"):
        value = int(msg)

client.set_callback(callbackChange)
client.subscribe("change")

# Set up pins
led_pin = machine.Pin(2, machine.Pin.OUT) #this will detect blue LED that embedded on esp32

# Publish a message every second
while True:
    client.check_msg()
    
    led_pin.value(value)
    
    message = str(value)
    client.publish(MQTT_TOPIC, message)
    print("Published message: ", message)

    time.sleep(1)
