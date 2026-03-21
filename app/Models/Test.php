<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'duration' => 'integer',
        'total_questions' => 'integer',
        'part' => 'integer',
    ];

    /**
     * Relationships
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function parts()
    {
        return $this->hasMany(TestPart::class)->orderBy('part_number');
    }

    public function partConfig(int $partNumber): ?TestPart
    {
        if (! $this->usesTestPartsTable()) {
            return null;
        }

        return $this->parts()->where('part_number', $partNumber)->first();
    }

    public function activePartNumbers(): array
    {
        if (! $this->usesTestPartsTable()) {
            return $this->part ? [(int) $this->part] : [1];
        }

        $numbers = $this->parts()
            ->where('is_active', true)
            ->pluck('part_number')
            ->map(fn ($value) => (int) $value)
            ->values()
            ->toArray();

        if ($numbers !== []) {
            return $numbers;
        }

        return $this->part ? [(int) $this->part] : [1];
    }

    public static function configuredQuestionCountForPart(int $part): int
    {
        return 20;
    }

    public function configuredQuestionCount(?int $partNumber = null): int
    {
        $resolvedPart = $partNumber ?? (int) ($this->part ?: 1);
        $partConfig = $this->partConfig($resolvedPart);

        if ($partConfig) {
            return max(1, (int) $partConfig->question_count);
        }

        return max(1, (int) ($this->total_questions ?: self::configuredQuestionCountForPart($resolvedPart)));
    }

    public static function configuredDurationForPart(int $part): int
    {
        return 15;
    }

    public function configuredDuration(?int $partNumber = null): int
    {
        $resolvedPart = $partNumber ?? (int) ($this->part ?: 1);
        $partConfig = $this->partConfig($resolvedPart);

        if ($partConfig) {
            return max(1, (int) $partConfig->duration);
        }

        return max(1, (int) ($this->duration ?: self::configuredDurationForPart($resolvedPart)));
    }

    private function usesTestPartsTable(): bool
    {
        static $hasTable = null;

        if ($hasTable === null) {
            $hasTable = Schema::hasTable('test_parts');
        }

        return $hasTable;
    }
}
