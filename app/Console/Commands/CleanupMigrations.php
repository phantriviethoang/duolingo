<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupMigrations extends Command
{
    protected $signature = 'app:cleanup-migrations';
    protected $description = 'Remove redundant migration files and their database records';

    public function handle()
    {
        // List of migration files to remove (redundant ADD COLUMN migrations)
        $filesToDelete = [
            'database/migrations/2026_03_22_114312_modify_questions_and_create_question_test_table.php',
        ];

        // Corresponding migration names in database
        $migrationsToDelete = [
            '2026_03_22_114312_modify_questions_and_create_question_test_table',
        ];

        // Delete from database
        foreach ($migrationsToDelete as $migration) {
            DB::table('migrations')->where('migration', $migration)->delete();
            $this->info("✓ Removed from migrations table: $migration");
        }

        // Delete files
        foreach ($filesToDelete as $file) {
            $path = base_path($file);
            if (file_exists($path)) {
                unlink($path);
                $this->info("✓ Deleted file: $file");
            } else {
                $this->warn("⚠ File not found: $file");
            }
        }

        $this->info("\n✅ Cleanup complete! Migration files and records removed.");
        $this->info("Now run: php artisan migrate:fresh --seed");
    }
}
