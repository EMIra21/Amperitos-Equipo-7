import * as echarts from 'echarts';

document.addEventListener('DOMContentLoaded', function() {
    const myChart = echarts.init(document.getElementById('sensorChart'));

    // Obtener datos de la tabla
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

    const option = {
        title: {
            text: 'Datos de Sensores',
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
            data: ['Temperatura', 'Humedad', 'Presión', 'Gas', 'CO', 'H2', 'CH4', 'NH3', 'EtOH'],
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
                        { offset: 0, color: 'rgba(255, 0, 0, 0.8)' },
                        { offset: 1, color: 'rgba(255, 0, 0, 0.1)' }
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
                        { offset: 0, color: 'rgba(0, 0, 255, 0.8)' },
                        { offset: 1, color: 'rgba(0, 0, 255, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.humedad
            },
            {
                name: 'Presión',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 255, 0, 0.8)' },
                        { offset: 1, color: 'rgba(0, 255, 0, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.presion
            },
            {
                name: 'Gas',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 165, 0, 0.8)' },
                        { offset: 1, color: 'rgba(255, 165, 0, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.gas
            },
            {
                name: 'CO',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(128, 0, 128, 0.8)' },
                        { offset: 1, color: 'rgba(128, 0, 128, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.co
            },
            {
                name: 'H2',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(165, 42, 42, 0.8)' },
                        { offset: 1, color: 'rgba(165, 42, 42, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.h2
            },
            {
                name: 'CH4',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 128, 128, 0.8)' },
                        { offset: 1, color: 'rgba(0, 128, 128, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.ch4
            },
            {
                name: 'NH3',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 192, 203, 0.8)' },
                        { offset: 1, color: 'rgba(255, 192, 203, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.nh3
            },
            {
                name: 'EtOH',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 255, 255, 0.8)' },
                        { offset: 1, color: 'rgba(0, 255, 255, 0.1)' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: series.etoh
            }
        ]
    };

    myChart.setOption(option);

    // Responsive chart
    window.addEventListener('resize', function() {
        myChart.resize();
    });
});