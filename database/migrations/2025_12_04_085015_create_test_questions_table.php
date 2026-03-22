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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('level')->nullable()->comment('CEFR level: A1, A2, etc.');
            $table->integer('part_number')->nullable();
            $table->text('question_text');
            $table->string('question_type')->default('multiple_choice');
            $table->integer('order');
            $table->text('translation')->nullable();
            $table->text('explanation')->nullable();
            $table->text('detailed_explanation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
