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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->nullable();
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->integer('min_wholesale_qty')->default(1);
            $table->string('currency', 10)->default('BOB');
            $table->string('price_type', 30)->default('fixed'); // fixed, contact_for_price, negotiable
            $table->string('unit', 50)->default('unidad'); // unidad, kg, caja, paquete
            $table->string('main_image')->nullable();
            $table->json('images')->nullable();
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status', 20)->default('published'); // published, draft, archived
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
