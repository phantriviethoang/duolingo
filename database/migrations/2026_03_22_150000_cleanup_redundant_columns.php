<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove redundant columns from database
     */
    public function up(): void
    {
        // Drop redundant columns from users table
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'target_part_count')) {
                $table->dropColumn('target_part_count');
            }
            if (Schema::hasColumn('users', 'target_part_id')) {
                $table->dropForeign(['target_part_id']); // Drop FK first
                $table->dropColumn('target_part_id');
            }
            if (Schema::hasColumn('users', 'is_high_quality')) {
                $table->dropColumn('is_high_quality');
            }
        });

        // Drop legacy columns from tests table (now in test_parts)
        Schema::table('tests', function (Blueprint $table) {
            if (Schema::hasColumn('tests', 'duration')) {
                $table->dropColumn('duration');
            }
            if (Schema::hasColumn('tests', 'part')) {
                $table->dropColumn('part');
            }
        });

        // Drop redundant columns from test_sessions table
        Schema::table('test_sessions', function (Blueprint $table) {
            if (Schema::hasColumn('test_sessions', 'level')) {
                $table->dropColumn('level');
            }
            if (Schema::hasColumn('test_sessions', 'part')) {
                $table->dropColumn('part');
            }
        });

        // Drop generic threshold from levels table (use part-specific only)
        Schema::table('levels', function (Blueprint $table) {
            if (Schema::hasColumn('levels', 'pass_threshold')) {
                $table->dropColumn('pass_threshold');
            }
        });

        // Add UNIQUE constraint to question_test pivot table
        Schema::table('question_test', function (Blueprint $table) {
            if (!Schema::hasIndex('question_test', 'unique_question_test')) {
                $table->unique(['question_id', 'test_id'], 'unique_question_test');
            }
        });
    }

    /**
     * Reverse the migration
     */
    public function down(): void
    {
        // Restore columns (Note: Data will be lost, use with caution)
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'target_part_count')) {
                $table->integer('target_part_count')->nullable();
            }
            if (!Schema::hasColumn('users', 'target_part_id')) {
                $table->foreignId('target_part_id')->nullable()->constrained('levels');
            }
            if (!Schema::hasColumn('users', 'is_high_quality')) {
                $table->boolean('is_high_quality')->default(false);
            }
        });

        Schema::table('tests', function (Blueprint $table) {
            if (!Schema::hasColumn('tests', 'duration')) {
                $table->integer('duration')->default(15);
            }
            if (!Schema::hasColumn('tests', 'part')) {
                $table->integer('part')->nullable()->default(1);
            }
        });

        Schema::table('test_sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('test_sessions', 'level')) {
                $table->string('level', 10);
            }
            if (!Schema::hasColumn('test_sessions', 'part')) {
                $table->unsignedInteger('part')->nullable();
            }
        });

        Schema::table('levels', function (Blueprint $table) {
            if (!Schema::hasColumn('levels', 'pass_threshold')) {
                $table->integer('pass_threshold')->default(60);
            }
        });

        Schema::table('question_test', function (Blueprint $table) {
            if (Schema::hasIndex('question_test', 'unique_question_test')) {
                $table->dropUnique('unique_question_test');
            }
        });
    }
};
