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
        Schema::table('tests', function (Blueprint $table) {
            $table->foreignId('level_id')->nullable()->after('is_active')->constrained('levels')->nullOnDelete();
            $table->boolean('is_high_quality')->default(false)->after('level_id')->comment('Chế độ yêu cầu cao hơn');
            $table->float('difficulty_score')->default(1.0)->after('is_high_quality')->comment('Hệ số độ khó');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Level::class);
            $table->dropColumn(['level_id', 'is_high_quality', 'difficulty_score']);
        });
    }
};
