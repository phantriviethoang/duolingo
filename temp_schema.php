<?php 
require __DIR__.'/vendor/autoload.php'; 
$app = require_once __DIR__.'/bootstrap/app.php'; 
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); 
$tables = \Illuminate\Support\Facades\Schema::getTables();
$result = [];
foreach ($tables as $tArray) { 
    $t = $tArray['name'];
    $cols = \Illuminate\Support\Facades\Schema::getColumnListing($t);
    $result[$t] = $cols;
}
file_put_contents('schema.json', json_encode($result, JSON_PRETTY_PRINT));
