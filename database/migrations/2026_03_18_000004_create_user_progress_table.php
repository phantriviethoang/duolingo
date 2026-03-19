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
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('level')->comment('CEFR level: A1, A2, B1, B2, C1, C2');
            $table->integer('part')->comment('Part number: 1, 2, 3');
            $table->boolean('completed')->default(false);
            $table->integer('score')->default(0);
            $table->integer('attempts')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Unique: một user chỉ có tối đa 1 progress record cho mỗi level + part
            $table->unique(['user_id', 'level', 'part']);

            // Index for faster queries
            $table->index(['user_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
