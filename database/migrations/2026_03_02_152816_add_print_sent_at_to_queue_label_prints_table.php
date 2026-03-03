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
        Schema::table('queue_label_prints', function (Blueprint $table) {
            // Stamped the moment the PDF is physically sent to the printer.
            // Used as an idempotency guard: records with a non-null print_sent_at
            // are excluded from the fetch queue so they can never be re-printed
            // even if the subsequent DB upload step fails.
            $table->timestamp('print_sent_at')->nullable()->default(null)->after('printed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('queue_label_prints', function (Blueprint $table) {
            $table->dropColumn('print_sent_at');
        });
    }
};
