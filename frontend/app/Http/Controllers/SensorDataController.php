<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SensorDataController extends Controller
{
    private $apiUrl = 'http://localhost:5000/api';

    public function index(Request $request)
    {
        try {
            $pagina = $request->input('page', 1); // Obtener el número de página actual

            // Agrega 'page' como parámetro en la petición GET
            $response = Http::get($this->apiUrl . '/datos', [
                'page' => $pagina
            ]);

            if (!$response || !$response->successful()) {
                throw new \Exception("Error al conectar con la API");
            }

            $apiData = $response->json();

            if (is_null($apiData)) {
                throw new \Exception("La API devolvió un formato inválido");
            }

            return view('sensores.index', [
                'datos' => [
                    'datos' => $apiData['datos'] ?? [],
                    'total_paginas' => $apiData['total_paginas'] ?? 1,
                    'pagina_actual' => $apiData['pagina_actual'] ?? $pagina
                ]
            ]);
        } catch (\Exception $e) {
            return view('sensores.index', [
                'datos' => [
                    'datos' => [],
                    'total_paginas' => 1,
                    'pagina_actual' => 1
                ],
                'error' => $e->getMessage()
            ]);
        }
    }
    public function estadisticasPromedio(Request $request)
    {
        try {
            $query = [];
            if ($request->inicio && $request->fin) {
                $query = [
                    'inicio' => $request->inicio,
                    'fin' => $request->fin
                ];
            }

            $response = Http::get($this->apiUrl . '/estadisticas', $query);
            $estadisticas = $response->json();
            return $estadisticas;
        } catch (\Exception $e) {
            return back()->with('error', 'Error al obtener las estadísticas: ' . $e->getMessage());
        }
    }
    /* 
    public function estadisticas(Request $request)
    {
        // Obtener los datos para la vista por defecto (promedio en este caso)
        $estadisticas = $this->obtenerEstadisticas($request);

        // Renderizar el partial por defecto
        $contenido = view('sensores.partials.estadisticas._promedio', compact('estadisticas'))->render();

        return view('sensores.estadisticas', compact('contenido'));
    } */
    public function obtenerEstadisticas(Request $request)
    {
        try {
            $query = [];

            if ($request->inicio && $request->fin) {
                $query = [
                    'inicio' => $request->inicio,
                    'fin' => $request->fin
                ];
            }

            $response = Http::get($this->apiUrl . '/estadisticas', $query);
            return $response->json(); // Retorna los datos en crudo
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }


    /*public function datosRango(Request $request)
    {
        try {
            $horas = $request->horas ?? 24;
            $response = Http::get($this->apiUrl . '/datos/rango', [
                'horas' => $horas
            ]);
            $datos = $response->json();
            return view('sensores.rango', compact('datos', 'horas'));
        } catch (\Exception $e) {
            return back()->with('error', 'Error al obtener los datos por rango: ' . $e->getMessage());
        }
    }*/

    public function obtenerDatosRango(Request $request)
    {
        try {
            $horas = $request->horas ?? 24;
            $response = Http::get($this->apiUrl . '/datos/rango', [
                'horas' => $horas
            ]);

            return [
                'datos' => $response->json(),
                'horas' => $horas
            ];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }


    public function estadisticas(Request $request)
    {
        // Cargar datos iniciales para la vista por defecto (promedio)
        $estadisticas = $this->obtenerEstadisticas($request);

        // Si hay error, redirigir con mensaje
        if (isset($estadisticas['error'])) {
            return back()->with('error', $estadisticas['error']);
        }

        // Renderizar el partial inicial
        $contenido = view('sensores.partials.estadisticas._promedio', compact('estadisticas'))->render();

        return view('sensores.estadisticas', compact('contenido'));
    }

    public function vistaEstadisticas(Request $request, $vista)
    {
        try {
            switch ($vista) {
                case 'promedio':
                    $estadisticas = $this->obtenerEstadisticas($request);
                    return view('sensores.partials.estadisticas._promedio', compact('estadisticas'));

                case 'rangoHoras':
                    $resultados = $this->obtenerDatosRango($request);
                    return view('sensores.partials.estadisticas._rangoHoras', [
                        'datos' => $resultados['datos'],
                        'horas' => $resultados['horas']
                    ]);

                case 'otro':
                    return view('sensores.partials.estadisticas._otro');

                default:
                    abort(404, 'Vista no encontrada');
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function misionControl(Request $request)
    {
        
         
            return view('sensores.control');
         
    }
}
