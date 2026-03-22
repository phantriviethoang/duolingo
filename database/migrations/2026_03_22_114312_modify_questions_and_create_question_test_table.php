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
        // Drop test_id from questions if it exists
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'test_id')) {
                // To support SQLite gracefully we might just drop the column
                // Laravel 11+ supports it well
                $table->dropForeign(['test_id']);
                $table->dropColumn('test_id');
            }
        });

        // Create pivot table
        Schema::create('question_test', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_test');
        
        Schema::table('questions', function (Blueprint $table) {
            $table->foreignId('test_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }
};
