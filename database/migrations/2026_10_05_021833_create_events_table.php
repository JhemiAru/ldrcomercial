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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('event_type', 30)->default('event'); // fair, promo, webinar, launch, discount
            $table->string('banner_image')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->string('modality', 30)->default('in_person'); // in_person, online, hybrid
            $table->string('location_name')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('link')->nullable();
            $table->string('admission_type', 30)->default('free'); // free, paid, registration_required
            $table->decimal('admission_price', 10, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status', 20)->default('active'); // active, concluded, cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
