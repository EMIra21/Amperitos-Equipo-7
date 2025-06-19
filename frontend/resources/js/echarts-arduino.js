import * as echarts from 'echarts';

document.addEventListener('DOMContentLoaded', async function () {
    const myChart = echarts.init(document.getElementById('sensorChart'));

    try {
        const response = await fetch('http://localhost:5000/api/datos');
        const json = await response.json();
        const datos = json.datos.reverse(); // Para que vayan del más antiguo al más reciente

        const timestamps = [];
        const series = {
            temperatura: [],
            humedad: []
        };

        datos.forEach(dato => {
            timestamps.push(new Date(dato.timestamp).toLocaleString());
            series.temperatura.push(dato.temperatura);
            series.humedad.push(dato.humedad);
        });

        const option = {
            title: {
                text: 'Temperatura y Humedad',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['Temperatura', 'Humedad'],
                top: '30px'
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timestamps
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Temperatura',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(249, 137, 25, 0.83)' },
                            { offset: 1, color: 'rgba(255, 128, 0, 0.14)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: series.temperatura
                },
                {
                    name: 'Humedad',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(220, 52, 235, 0.8)' },
                            { offset: 1, color: 'rgba(187, 0, 255, 0.1)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: series.humedad
                }
            ]
        };

        myChart.setOption(option);

        // Responsivo
        window.addEventListener('resize', function () {
            myChart.resize();
        });

    } catch (error) {
        console.error('Error al cargar los datos desde la API:', error);
    }
});