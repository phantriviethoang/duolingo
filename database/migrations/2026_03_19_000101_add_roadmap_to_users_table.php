<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thêm cột target_part_id và is_high_quality vào users
     * target_part_id: Part mục tiêu user muốn đạt (FK -> levels.id)
     * is_high_quality: Chế độ cao cấp (threshold tự động +10%)
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('target_part_id')->nullable()->constrained('levels')->nullOnDelete()
                ->comment('Lộ trình mục tiêu (Part/Level)');
            $table->boolean('is_high_quality')->default(false)->comment('Chế độ cao cấp (threshold +10%)');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeignIdFor('target_part_id');
            $table->dropColumn(['target_part_id', 'is_high_quality']);
        });
    }
};
