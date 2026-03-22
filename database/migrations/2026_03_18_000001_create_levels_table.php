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
            $table->string('name')->unique()->comment('CEFR level: A1, A2, B1, B2, C1, C2');
            $table->text('description')->nullable();
            $table->integer('order')->comment('Thứ tự: 1, 2, 3, 4, 5, 6');
            $table->integer('pass_threshold')->default(60)->comment('Điểm đạt chung');
            $table->json('part_thresholds')->default(json_encode([1 => 60.0, 2 => 75.0, 3 => 90.0]))->comment('Dynamic part thresholds: {1: 60.0, 2: 75.0, 3: 90.0}');
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
