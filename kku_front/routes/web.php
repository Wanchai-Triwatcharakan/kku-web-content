<?php
// namespace App\Http\Controllers\frontoffice;
namespace App\Http\Controllers\frontend;


use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// \Artisan::call('cache:clear');
// \Artisan::call('route:clear');

// Route::get('/', function () {
//     return "S_House_Design_API";
// });
Route::get('/', [HomeController::class, 'indexPage']);
Route::get('/news', [HomeController::class, 'NewsPage']);
Route::get('/aboutus', [HomeController::class, 'AboutUsPage']);

// Test debug
// Route::get('/', [CategoryController::class, 'index']);
