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
        Schema::create('commercial_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('doc_number', 50); // ej. COT-2026-0042 o VEN-2026-0118
            $table->string('doc_type', 30)->default('quotation'); // quotation, sale, invoice, receipt
            $table->string('title')->nullable();
            
            // Datos del Cliente / Comprador
            $table->string('client_name');
            $table->string('client_nit', 50)->nullable();
            $table->string('client_phone', 50)->nullable();
            $table->string('client_email')->nullable();
            $table->string('client_city', 100)->nullable();
            $table->string('client_address')->nullable();

            // Fechas
            $table->date('date');
            $table->date('due_date')->nullable();
            
            // Estado y Condiciones Comerciales
            $table->string('status', 30)->default('draft'); // draft, sent, approved, converted, completed, pending_payment, rejected, cancelled
            $table->string('payment_terms')->nullable();
            $table->string('delivery_time')->nullable();
            $table->integer('validity_days')->default(15);
            $table->string('currency', 10)->default('BOB');
            
            // Totales Financieros
            $table->decimal('subtotal', 14, 2)->default(0.00);
            $table->decimal('discount_amount', 14, 2)->default(0.00);
            $table->decimal('tax_amount', 14, 2)->default(0.00);
            $table->decimal('total', 14, 2)->default(0.00);
            
            $table->text('notes')->nullable();
            $table->timestamps();

            // Índices para búsquedas rápidas y reportes ERP
            $table->index(['company_id', 'doc_type']);
            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'date']);
        });

        Schema::create('commercial_document_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('commercial_documents')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('name');
            $table->string('sku', 100)->nullable();
            $table->string('unit', 50)->default('Pza');
            $table->decimal('quantity', 12, 2)->default(1.00);
            $table->decimal('price', 14, 2)->default(0.00);
            $table->decimal('discount', 5, 2)->default(0.00); // Porcentaje de descuento (0 - 100%)
            $table->decimal('subtotal', 14, 2)->default(0.00);
            $table->timestamps();

            $table->index('document_id');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commercial_document_items');
        Schema::dropIfExists('commercial_documents');
    }
};

