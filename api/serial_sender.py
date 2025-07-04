import serial
import requests
import json
import time

SERIAL_PORT = 'COM4' 
BAUD_RATE = 9600
API_ENDPOINT = 'http://localhost:5000/api/guardar'

def enviar_a_api(data_dict):
    try:
        response = requests.post(API_ENDPOINT, json=data_dict)
        if response.status_code == 201:
            print("Dato guardado")
        else:
            print(f"Error al guardar: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")

def escuchar_serial():
    while True:
        try:
            with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2) as ser:
                print(f"🔌 Escuchando en {SERIAL_PORT}...")
                while True:
                    try:
                        datos_raw = ser.readline()
                        if not datos_raw:
                            continue
                            
                        try:
                            linea = datos_raw.decode('utf-8').strip()
                        except UnicodeDecodeError:
                            try:
                                linea = datos_raw.decode('latin-1').strip()
                            except Exception as e:
                                print(f"Error de decodificación: {e}")
                                continue
                                
                        if linea:
                            try:
                                data = json.loads(linea)
                                print("Recibido:", data)
                                enviar_a_api(data)
                            except json.JSONDecodeError as e:
                                print(f"JSON mal formado: {linea}")
                                print(f"Error: {e}")
                                
                    except serial.SerialException as e:
                        print(f"Error de lectura serial: {e}")
                        break
                        
        except serial.SerialException as e:
            print(f"Error de conexión serial: {e}")
            print("Reintentando conexión en 5 segundos...")
            time.sleep(5)

if __name__ == '__main__':
    while True:
        escuchar_serial()
        time.sleep(5)  # Reintento si hay fallo
