<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thêm cột order và pass_threshold vào levels
     * order: Thứ tự từ 1-7 (A1=1, A2=2, ..., C2=7)
     * pass_threshold: Điểm chặn để mở phần tiếp theo (50%, 65%, 80%)
     */
    public function up(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->integer('order')->default(0)->comment('Thứ tự Part từ 1-7');
            $table->float('pass_threshold')->default(0.5)->comment('Ngưỡng điểm % để mở phần tiếp theo');
        });
    }

    public function down(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->dropColumn(['order', 'pass_threshold']);
        });
    }
};
