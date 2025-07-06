import * as echarts from 'echarts';

document.addEventListener('DOMContentLoaded', function () {
    const myChart = echarts.init(document.getElementById('sensorChart'));

    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const timestamps = [];
    const series = {
        temperatura: [],
        humedad: [],
        presion: [],
        gas: [],
        co: [],
        h2: [],
        ch4: [],
        nh3: [],
        etoh: []
    };

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        timestamps.push(cells[0].textContent);
        series.temperatura.push(parseFloat(cells[1].textContent));
        series.humedad.push(parseFloat(cells[2].textContent));
        series.presion.push(parseFloat(cells[3].textContent));
        series.gas.push(parseFloat(cells[4].textContent));
        series.co.push(parseFloat(cells[5].textContent));
        series.h2.push(parseFloat(cells[6].textContent));
        series.ch4.push(parseFloat(cells[7].textContent));
        series.nh3.push(parseFloat(cells[8].textContent));
        series.etoh.push(parseFloat(cells[9].textContent));
    });

    const colores = {
        temperatura: ['rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.1)'],
        humedad: ['rgba(0, 0, 255, 0.8)', 'rgba(0, 0, 255, 0.1)'],
        presion: ['rgba(0, 255, 0, 0.8)', 'rgba(0, 255, 0, 0.1)'],
        gas: ['rgba(255, 165, 0, 0.8)', 'rgba(255, 165, 0, 0.1)'],
        co: ['rgba(128, 0, 128, 0.8)', 'rgba(128, 0, 128, 0.1)'],
        h2: ['rgba(165, 42, 42, 0.8)', 'rgba(165, 42, 42, 0.1)'],
        ch4: ['rgba(0, 128, 128, 0.8)', 'rgba(0, 128, 128, 0.1)'],
        nh3: ['rgba(255, 192, 203, 0.8)', 'rgba(255, 192, 203, 0.1)'],
        etoh: ['rgba(0, 255, 255, 0.8)', 'rgba(0, 255, 255, 0.1)']
    };

    function crearSeries(keys) {
        return keys.map(k => ({
            name: k.toUpperCase(),
            type: 'line',
            stack: 'Total',
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colores[k][0] },
                    { offset: 1, color: colores[k][1] }
                ])
            },
            emphasis: { focus: 'series' },
            data: series[k]
        }));
    }

    function actualizarGrafico(keys, titulo) {
        const option = {
            title: {
                text: titulo,
                left: 'center',
                textStyle: {
                    color: '#45556c', // Cambia este valor al color que desees (hex, rgb, o nombre)
                    fontSize: 20,     // Opcional: tamaño del texto
                    fontWeight: 'bold' // Opcional: estilo de fuente
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: { backgroundColor: '#6a7985' }
                }
            },
            legend: {
                data: keys.map(k => k.toUpperCase()),
                top: '30px'
            },
            toolbox: {
                feature: { saveAsImage: {} }
            },
            grid: {
                left: '3%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: timestamps
            }],
            yAxis: [{
                type: 'value'
            }],
            series: crearSeries(keys)
        };

        myChart.setOption(option);
    }

    const categorias = {
        ambientales: ['temperatura', 'humedad'],
        fisicas: ['presion', 'gas'],
        quimica: ['co', 'h2', 'ch4', 'nh3', 'etoh']
    };

    document.getElementById('btnAmbientales').addEventListener('click', () => {
        actualizarGrafico(categorias.ambientales, 'Condiciones Ambientales');
    });

    document.getElementById('btnFisicas').addEventListener('click', () => {
        actualizarGrafico(categorias.fisicas, 'Presión y Gases');
    });

    document.getElementById('btnQuimica').addEventListener('click', () => {
        actualizarGrafico(categorias.quimica, 'Composición Química del Aire');
    });

    // Mostrar por defecto la categoría "Condiciones Ambientales"
    actualizarGrafico(categorias.ambientales, 'Condiciones Ambientales');

    window.addEventListener('resize', () => {
        myChart.resize();
    });
});
