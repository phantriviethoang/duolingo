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
        Schema::table('test_questions', function (Blueprint $table) {
            // Change correct_option_id from INT to VARCHAR to store option IDs like 'A', 'B', 'C', 'D'
            $table->string('correct_option_id', 10)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_questions', function (Blueprint $table) {
            $table->integer('correct_option_id')->change();
        });
    }
};
