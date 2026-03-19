<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('A1, A2, B1, B2, B3, C1, C2');
            $table->text('description')->nullable();
            $table->integer('order')->unique()->comment('Thứ tự của Part: 1-7'); // Thứ tự 1, 2, 3, ... 7
            $table->float('pass_threshold')->default(0.5)->comment('Ngưỡng điểm đạt (0.5=50%, 0.7=70%, 0.9=90%)'); // 0.5, 0.7, 0.9
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
