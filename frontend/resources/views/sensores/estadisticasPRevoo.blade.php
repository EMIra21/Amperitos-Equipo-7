@extends('layouts.app')

@section('content')
    <div class="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-violet-500 glow-effect">

        {{-- Título estilo jToolBar --}}
        <div class="nasa-gradient px-4 py-5 sm:px-6 border-b border-violet-700">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-purple-300 space-font flex items-center">
                    <i class="fas fa-chart-bar text-violet-200 mr-3"></i>
                    Estadísticas de Sensores
                </h2>
                <div class="text-purple-400 space-font text-sm">
                    <i class="fas fa-satellite-dish mr-2"></i>
                    <span>Control de Misión</span>
                </div>
            </div>
        </div>

        {{-- Botones como pestañas --}}
        <div class="flex space-x-4 p-4 bg-gray-900 border-b border-violet-700">
            <button onclick="cargarVista('promedio')" class="tab-btn text-purple-300 hover:text-white">📊 Promedios</button>
            <button onclick="cargarVista('rangoHoras')" class="tab-btn text-purple-300 hover:text-white">📈 Gráfica</button>
            <button onclick="cargarVista('otro')" class="tab-btn text-purple-300 hover:text-white">🧪 Otro</button>
        </div>

        {{-- Contenedor donde se cargará la vista --}}
        <div id="contenedorContenido" class="p-4 bg-gray-900">

            {!! $contenido !!}

        </div>

    </div>
    @endsection
    
    @push('scripts')
    <script>
        // Función para cargar vistas
        function cargarVista(vista) {
            fetch(`/sensores/cargar-vista/${vista}`)
                .then(res => res.text())
                .then(html => {
                    document.getElementById('contenedorContenido').innerHTML = html;
                });
        }

        // Cargar vista por defecto al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar si el contenedor está vacío (para no cargar duplicados)
            if (document.getElementById('contenedorContenido').innerHTML.trim() === '') {
                cargarVista('promedio');
            }
        });
    </script>


    <script>
        document.addEventListener('submit', function(event) {
            if (event.target.matches('#formFiltros')) {
                event.preventDefault();
                const form = event.target;
                const url = form.action + '?' + new URLSearchParams(new FormData(form)).toString();

                fetch(url)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return res.text();
                    })
                    .then(html => {
                        document.getElementById('contenedorContenido').innerHTML = html;
                    })
                    .catch(err => {
                        console.error('Error al enviar formulario:', err);
                        // Puedes mostrar un mensaje de error al usuario si lo deseas
                    });
            }
        });
    </script>
    @endpush

