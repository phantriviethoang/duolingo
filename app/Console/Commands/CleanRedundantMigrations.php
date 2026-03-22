<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanRedundantMigrations extends Command
{
    protected $signature = 'migrations:clean-redundant';
    protected $description = 'Remove redundant NOOP migration files';

    public function handle()
    {
        $redundantFiles = [
            'database/migrations/2026_03_24_000000_add_part_count_preferences_to_users.php',
        ];

        foreach ($redundantFiles as $file) {
            $filePath = base_path($file);
            if (file_exists($filePath)) {
                unlink($filePath);
                $this->info("✓ Deleted: {$file}");

                // Remove from migrations table
                $migrationName = basename($file, '.php');
                DB::table('migrations')->where('migration', $migrationName)->delete();
                $this->info("✓ Removed from migrations table: {$migrationName}");
            }
        }

        $this->info('Redundant migrations cleanup completed!');
    }
}
