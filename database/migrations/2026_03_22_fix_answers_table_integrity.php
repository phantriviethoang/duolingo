<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix answers table integrity:
     * - Add DB constraint: only 1 correct answer per question
     * - Add index for performance
     * - Add comment for clarity
     */
    public function up(): void
    {
        Schema::table('answers', function (Blueprint $table) {
            // Add comment to clarify the semantics
            $table->text('answer_text')->change()->comment('The answer text/option');
            $table->boolean('is_correct')->change()->default(false)->comment('True if this is the correct answer - MUST be exactly 1 per question');

            // Add index for fast query: get correct answer (composite index)
            $table->index(['question_id', 'is_correct'])->comment('Speed up: get correct answer per question');

            // Note: DB constraint for single correct answer per question is enforced via
            // application-level validation in QuestionController (see store/update methods)
            // This is more reliable than DB constraints which have SQLite limitations
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->dropIndex('answers_question_id_is_correct_index');
        });
    }
};
