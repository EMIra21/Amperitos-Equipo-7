from flask import Flask, jsonify
import mysql.connector
from dotenv import load_dotenv
import os

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Configuración de la base de datos usando variables de entorno
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

@app.route('/promedios', methods=['GET'])
def obtener_promedios():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    query = """
        SELECT 
            AVG(temperatura), AVG(humedad), AVG(presion), AVG(gas),
            AVG(co), AVG(h2), AVG(ch4), AVG(nh3), AVG(etoh),
            AVG(ax), AVG(ay), AVG(az),
            AVG(gx), AVG(gy), AVG(gz)
        FROM lecturas
        WHERE timestamp >= NOW() - INTERVAL 7 DAY
    """

    cursor.execute(query)
    resultado = cursor.fetchone()
    conn.close()

    campos = [
        "temperatura", "humedad", "presion", "gas", "co", "h2", "ch4", "nh3", "etoh",
        "ax", "ay", "az", "gx", "gy", "gz"
    ]

    datos = {campo: round(valor, 2) if valor is not None else None for campo, valor in zip(campos, resultado)}

    return jsonify(datos)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
