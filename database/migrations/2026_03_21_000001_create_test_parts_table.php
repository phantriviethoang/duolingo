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
        Schema::create('test_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('part_number');
            $table->unsignedInteger('question_count');
            $table->unsignedInteger('duration')->comment('Duration in minutes');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['test_id', 'part_number']);
            $table->index(['part_number', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_parts');
    }
};
