#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
using namespace std;

RF24 radio(9, 10); // CE, CSN
const byte direccion[6] = "00001";

struct DatosSensor {
  float temperatura;
  float humedad;
  
};



void setup() {
  Serial.begin(9600);

  radio.begin();
  radio.openReadingPipe(0, direccion);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening(); // Modo receptor
}

void loop() {
  if (radio.available()) {
    DatosSensor datos;
    radio.read(&datos, sizeof(datos));

    Serial.print("Recibido -> Temp: ");
    Serial.print(datos.temperatura);
    Serial.print(" °C, Hum: ");
    Serial.print(datos.humedad);
    Serial.println(" %");
  }
}
