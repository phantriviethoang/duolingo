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
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration')->comment('Thời gian làm bài (phút)');
            $table->string('level')->comment('CEFR level: A1, A2, B1, B2, C1, C2');
            $table->integer('part')->comment('Part number: 1, 2, 3');
            $table->integer('total_questions')->default(0);
            $table->integer('attempts')->default(0)->comment('Số lượt làm bài');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
