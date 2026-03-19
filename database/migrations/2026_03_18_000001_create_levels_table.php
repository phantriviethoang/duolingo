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
            $table->string('target_level')->default('A1')->comment('A1, A2, B1, B2, C1, C2');
            $table->string('name')->comment('Ví dụ: Phần 1, Phần 2');
            $table->text('description')->nullable();
            $table->integer('order')->comment('Thứ tự: 1, 2, 3');
            $table->float('pass_threshold')->default(0.5);
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
