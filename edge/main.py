import time

# WiFi settings
import network
WIFI_SSID = "Rumah Bagus"
WIFI_PASSWORD = "ibusayang5"
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect(WIFI_SSID, WIFI_PASSWORD)
while not sta_if.isconnected():
    time.sleep(1)
print("Wifi Connected!")

#MQTT Library, just run this 1x
#import upip
#upip.install("umqtt.simple")

# MQTT settings
import machine
import ubinascii
from umqtt.simple import MQTTClient

MQTT_SERVER = "tcp://0.tcp.ap.ngrok.io"
MQTT_PORT = 15393
MQTT_TOPIC = "status"

# Generate a unique client ID from the ESP32 MAC address
client_id = ubinascii.hexlify(machine.unique_id()).decode()
# Connect to MQTT broker
client = MQTTClient(client_id, MQTT_SERVER, port=MQTT_PORT, keepalive=60)
client.connect()

# Set up pins
led_pin = machine.Pin(2, machine.Pin.OUT) #this will detect blue LED that embedded on esp32
button_pin = machine.Pin(0, machine.Pin.IN) #this will detect BOOT button

INITIAL_VALUE = 0
value = INITIAL_VALUE

# Publish a message every second
while True:
    print(button_pin.value())
    if (button_pin.value() == 0):	#button clicked
        value = (value+1)%2
    led_pin.value(value)

    message = str(value)
    client.publish(MQTT_TOPIC, message)
    print("Published message: ", message)

    time.sleep(1)
