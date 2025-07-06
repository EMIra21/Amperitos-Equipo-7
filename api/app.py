from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import pytz
from dotenv import load_dotenv
from sqlalchemy import func, and_
from flask_cors import CORS
import os

#Cargando zona horaria de mexico
mexico_tz = pytz.timezone("America/Mexico_City")

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperatura = db.Column(db.Float)
    humedad = db.Column(db.Float)
    presion = db.Column(db.Float)
    gas = db.Column(db.Float)
    co = db.Column(db.Float)
    h2 = db.Column(db.Float)
    ch4 = db.Column(db.Float)
    nh3 = db.Column(db.Float)
    etoh = db.Column(db.Float)
    ax = db.Column(db.Float)
    ay = db.Column(db.Float)
    az = db.Column(db.Float)
    gx = db.Column(db.Float)
    gy = db.Column(db.Float)
    gz = db.Column(db.Float)
    #timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    # Usar hora local de México al guardar el registro
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(mexico_tz))

    def to_dict(self):
        return {
            'id': self.id,
            'temperatura': self.temperatura,
            'humedad': self.humedad,
            'presion': self.presion,
            'gas': self.gas,
            'co': self.co,
            'h2': self.h2,
            'ch4': self.ch4,
            'nh3': self.nh3,
            'etoh': self.etoh,
            'ax': self.ax,
            'ay': self.ay,
            'az': self.az,
            'gx': self.gx,
            'gy': self.gy,
            'gz': self.gz,
            'timestamp': self.timestamp.isoformat()
        }

with app.app_context():
    db.create_all()

@app.route('/api/guardar', methods=['POST'])
def guardar_datos():
    try:
        datos = request.get_json()
        
        # Mapear los campos del JSON recibido a los campos del modelo
        campos_mapping = {
            'T': 'temperatura',
            'H': 'humedad',
            'P': 'presion',
            'G': 'gas',
            'CO': 'co',
            'H2': 'h2',
            'CH4': 'ch4',
            'NH3': 'nh3',
            'EtOH': 'etoh',
            'AX': 'ax',
            'AY': 'ay',
            'AZ': 'az',
            'GX': 'gx',
            'GY': 'gy',
            'GZ': 'gz'
        }
        
        # Crear diccionario con los datos mapeados
        datos_mapeados = {}
        for campo_json, campo_db in campos_mapping.items():
            if campo_json in datos:
                datos_mapeados[campo_db] = float(datos[campo_json])
            else:
                return jsonify({'error': f'Falta el campo {campo_json}'}), 400

        # Crear nuevo registro
        nuevo_dato = SensorData(**datos_mapeados)

        # Guardar en la base de datos
        db.session.add(nuevo_dato)
        db.session.commit()

        return jsonify(nuevo_dato.to_dict()), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/datos', methods=['GET'])
def obtener_datos():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 100, type=int)
        datos = SensorData.query.order_by(SensorData.timestamp.desc()).paginate(page=page, per_page=per_page)
        return jsonify({
            'datos': [dato.to_dict() for dato in datos.items],
            'total_paginas': datos.pages,
            'pagina_actual': datos.page,
            'total_registros': datos.total
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/estadisticas', methods=['GET'])
def obtener_estadisticas():
    try:
        inicio = request.args.get('inicio')
        fin = request.args.get('fin')
        query = SensorData.query

        if inicio and fin:
            query = query.filter(and_(
                SensorData.timestamp >= datetime.fromisoformat(inicio),
                SensorData.timestamp <= datetime.fromisoformat(fin)
            ))

        campos = ['temperatura', 'humedad', 'presion', 'gas', 'co', 'h2', 'ch4', 'nh3', 'etoh']
        estadisticas = {}

        for campo in campos:
            resultados = query.with_entities(
                func.avg(getattr(SensorData, campo)).label('promedio'),
                func.min(getattr(SensorData, campo)).label('minimo'),
                func.max(getattr(SensorData, campo)).label('maximo')
            ).first()

            estadisticas[campo] = {
                'promedio': float(resultados.promedio) if resultados.promedio else 0,
                'minimo': float(resultados.minimo) if resultados.minimo else 0,
                'maximo': float(resultados.maximo) if resultados.maximo else 0
            }

        return jsonify(estadisticas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/datos/rango', methods=['GET'])
def obtener_datos_rango():
    try:
        horas = request.args.get('horas', 24, type=int)
        tiempo_limite = datetime.utcnow() - timedelta(hours=horas)
        
        datos = SensorData.query\
            .filter(SensorData.timestamp >= tiempo_limite)\
            .order_by(SensorData.timestamp.asc())\
            .all()
            
        return jsonify([dato.to_dict() for dato in datos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)