<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SensorDataController;

Route::get('/sensores', [SensorDataController::class, 'index'])->name('sensores.index');
Route::get('/sensores/estadisticas', [SensorDataController::class, 'estadisticas'])->name('sensores.estadisticas');
//Route::get('/sensores/rango', [SensorDataController::class, 'datosRango'])->name('sensores.rango');
Route::get('/sensores/cargar-vista/{vista}', [SensorDataController::class, 'vistaEstadisticas'])->name('sensores.cargar-vista');
Route::get('/sensores/control', [SensorDataController::class, 'misionControl'])->name('sensores.control');
