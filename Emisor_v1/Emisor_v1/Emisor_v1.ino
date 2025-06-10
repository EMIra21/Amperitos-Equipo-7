#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11


DHT dht(DHTPIN, DHTTYPE);
RF24 radio(9, 10); // CE, CSN

const byte direccion[6] = "00001";
char mensaje = "Hola tio que tal";

struct DatosSensor {
  float temperatura;
  float humedad;
  
};

const int ledVerde = 3;
const int ledRojo = 4;

void setup() {
  Serial.begin(9600);
  dht.begin();

  pinMode(ledVerde, OUTPUT);
  pinMode(ledRojo, OUTPUT);
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledRojo, LOW);

  radio.begin();
  radio.openWritingPipe(direccion);
  radio.setPALevel(RF24_PA_LOW);
  radio.stopListening(); // Modo emisor
}

void loop() {
  delay(2000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Error al leer el DHT11");
    parpadearLedRojo(1, 3000); // Un parpadeo lento cada 3 segundos
    return;
  }

  DatosSensor datos = {t, h};
  

  bool enviado = radio.write(&datos, sizeof(datos));
  bool mensajeEnviado = radio.write(&mensaje, sizeof(mensaje));
  if (enviado) {
    Serial.print("Enviado -> Temp: ");
    Serial.print(t);
    Serial.print(" °C, Hum: ");
    Serial.print(h);
    Serial.println(" %");
    if(mensajeEnviado)
    {
      Serial.print(mensaje);
    }
    else{
      serial.println("Error al enviar el nombre");
    }
    digitalWrite(ledVerde, HIGH);
    delay(500);
    digitalWrite(ledVerde, LOW);
  } else {
    Serial.println("Error al enviar los datos");
    parpadearLedRojo(2, 200); // Dos parpadeos rápidos
  }
}

void parpadearLedRojo(int veces, int duracion) {
  for (int i = 0; i < veces; i++) {
    digitalWrite(ledRojo, HIGH);
    delay(duracion);
    digitalWrite(ledRojo, LOW);
    delay(duracion);
  }
}
