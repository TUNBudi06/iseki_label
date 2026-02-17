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
            $table->boolean('auto_print')->default(false)->after('urgent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('print_via_auto_printer', function (Blueprint $table) {
            //
        });
    }
};
