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
        Schema::create('queue_label_prints', function (Blueprint $table) {
            $table->id();
            $table->string('rack_code', 50);
            $table->enum('label_type', ['kecil','besar','pallet'])->default('besar');
            $table->integer('quantity')->default(1);
            $table->string('requested_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queue_label_prints');
    }
};
