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
        Schema::table('results', function (Blueprint $table) {
            $table->unsignedInteger('part_number')->nullable()->after('test_id');
            $table->float('custom_pass_threshold')->nullable()->after('part_number');
            $table->index(['test_id', 'part_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            $table->dropIndex(['test_id', 'part_number']);
            $table->dropColumn('custom_pass_threshold');
            $table->dropColumn('part_number');
        });
    }
};
