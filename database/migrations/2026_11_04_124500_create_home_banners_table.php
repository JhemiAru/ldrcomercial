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
        Schema::create('home_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('image'); // URL o ruta local /storage/banners/...
            $table->string('link')->nullable(); // Enlace de destino al hacer clic
            $table->integer('order')->default(0); // Posición en el carrusel
            $table->boolean('is_active')->default(true); // Activo / Inactivo
            $table->timestamps();

            $table->index('is_active');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_banners');
    }
};

