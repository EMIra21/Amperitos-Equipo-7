import serial
import requests
import json
import time

SERIAL_PORT = 'COM4'  # Cambiar al puerto que corresponda
BAUD_RATE = 9600
API_ENDPOINT = 'http://localhost:5000/api/guardar'

def enviar_a_api(data_dict):
    try:
        response = requests.post(API_ENDPOINT, json=data_dict)
        if response.status_code == 201:
            print("Dato guardado")
        else:
            print(f"Error al guardar en la API: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión con la API: {e}")

def escuchar_serial():
    buffer = ""
    while True:
        try:
            with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2) as ser:
                print(f"Escuchando en {SERIAL_PORT}...")
                while True:
                    #time.sleep(1)
                    try:
                        #time.sleep(1)
                        datos_raw = ser.readline()
                        if not datos_raw:
                            print("...")
                            continue

                        try:
                            linea = datos_raw.decode('utf-8').strip()
                        except UnicodeDecodeError:
                            try:
                                linea = datos_raw.decode('latin-1').strip()
                            except Exception as e:
                                print(f"Error de decodificación: {e}")
                                continue

                        buffer += linea
                        # Verificar si tenemos un JSON completo
                        if buffer.startswith("{") and buffer.endswith("}"):
                            try:
                                data = json.loads(buffer)
                                print("Recibido:", data)
                                enviar_a_api(data)
                            except json.JSONDecodeError as e:
                                print(f"JSON mal formado: {buffer}")
                                print(f"Error: {e}")
                            buffer = ""  # Limpiar buffer

                        # Limpiar si el buffer se vuelve demasiado grande sin cerrar
                        elif len(buffer) > 100:
                            print("Buffer desbordado. Reiniciando.")
                            buffer = ""

                    except serial.SerialException as e:
                        print(f"Error de lectura serial: {e}")
                        break

        except serial.SerialException as e:
            print(f"Error de conexión serial: {e}")
            print("Reintentando en 5 segundos...")
            time.sleep(5)

if __name__ == '__main__':
    while True:
        escuchar_serial()
        time.sleep(1)
