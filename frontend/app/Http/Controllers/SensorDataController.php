<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SensorDataController extends Controller
{
    private $apiUrl = 'http://localhost:5000/api/datos';

    public function index()
{
    try {
        $response = Http::get('http://localhost:5000/api/datos');
        
        // Verifica si la respuesta existe y es exitosa
        if (!$response || !$response->successful()) {
            throw new \Exception("Error al conectar con la API");
        }

        $apiData = $response->json();
        
        // Verifica si la decodificación JSON fue exitosa
        if (is_null($apiData)) {
            throw new \Exception("La API devolvió un formato inválido");
        }

        // Estructura de datos segura con valores por defecto
        return view('sensores.index-arduino', [
            'datos' => [
                'datos' => $apiData['datos'] ?? [],
                'total_paginas' => $apiData['total_paginas'] ?? 1,
                'pagina_actual' => $apiData['pagina_actual'] ?? 1
            ]
        ]);

    } catch (\Exception $e) {
        return view('sensores.index-arduino', [
            'datos' => [
                'datos' => [],
                'total_paginas' => 1,
                'pagina_actual' => 1
            ],
            'error' => $e->getMessage()
        ]);
    }
}
    public function estadisticas(Request $request)
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
            return view('sensores.estadisticas', compact('estadisticas'));
        } catch (\Exception $e) {
            return back()->with('error', 'Error al obtener las estadísticas: ' . $e->getMessage());
        }
    }

    public function datosRango(Request $request)
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
    }
}