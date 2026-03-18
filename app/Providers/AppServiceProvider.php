<?php

namespace App\Providers;

use App\Models\Test as Exam;
use App\Policies\ExamPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        $this->registerPolicies();
    }

    /**
     * Register authorization policies.
     */
    protected function registerPolicies(): void
    {
        // Map models to their policies
        $policies = [
            Exam::class => ExamPolicy::class,
        ];

        foreach ($policies as $model => $policy) {
            \Gate::policy($model, $policy);
        }
    }
}
