<?php

namespace App\Http\Controllers;

use App\Models\CommercialDocument;
use App\Models\CommercialDocumentItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Muestra el panel comercial de Ventas y Cotizaciones conectado a la base de datos MySQL.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->company()->with('category')->first();

        if (!$company) {
            return Inertia::render('Sales/Index', [
                'hasCompany' => false,
                'company' => null,
                'catalogProducts' => [],
                'initialQuotes' => [],
                'initialSales' => [],
            ]);
        }

        // Obtener productos publicados de la empresa para el selector del cotizador
        $products = $company->products()
            ->where('status', 'published')
            ->select(['id', 'name', 'sku', 'price', 'wholesale_price', 'currency', 'unit', 'main_image'])
            ->get();

        // Obtener cotizaciones y ventas con sus ítems
        $documents = $company->commercialDocuments()
            ->with(['items.product'])
            ->latest('date')
            ->latest('id')
            ->get();

        // Formatear para el frontend de React
        $formattedDocs = $documents->map(function ($doc) {
            return [
                'id' => $doc->doc_number, // Mantenemos el código visible (ej. COT-2026-0042)
                'db_id' => $doc->id,
                'doc_number' => $doc->doc_number,
                'doc_type' => $doc->doc_type,
                'title' => $doc->title,
                'client_name' => $doc->client_name,
                'client_nit' => $doc->client_nit,
                'client_phone' => $doc->client_phone,
                'client_email' => $doc->client_email,
                'client_city' => $doc->client_city,
                'client_address' => $doc->client_address,
                'date' => $doc->date ? $doc->date->format('Y-m-d') : date('Y-m-d'),
                'due_date' => $doc->due_date ? $doc->due_date->format('Y-m-d') : null,
                'status' => $doc->status,
                'payment_terms' => $doc->payment_terms,
                'delivery_time' => $doc->delivery_time,
                'validity_days' => $doc->validity_days ?? 15,
                'currency' => $doc->currency ?? 'BOB',
                'subtotal' => (float)$doc->subtotal,
                'discount_amount' => (float)$doc->discount_amount,
                'tax_amount' => (float)$doc->tax_amount,
                'total' => (float)$doc->total,
                'notes' => $doc->notes,
                'items' => $doc->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'name' => $item->name,
                        'sku' => $item->sku,
                        'unit' => $item->unit ?? 'Pza',
                        'quantity' => (float)$item->quantity,
                        'price' => (float)$item->price,
                        'discount' => (float)$item->discount,
                        'subtotal' => (float)$item->subtotal,
                    ];
                }),
            ];
        });

        $quotes = $formattedDocs->where('doc_type', 'quotation')->values();
        $sales = $formattedDocs->where('doc_type', 'sale')->values();

        return Inertia::render('Sales/Index', [
            'hasCompany' => true,
            'company' => $company,
            'catalogProducts' => $products,
            'initialQuotes' => $quotes,
            'initialSales' => $sales,
        ]);
    }

    /**
     * Guarda un nuevo documento comercial (cotización o venta) en MySQL.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return back()->withErrors(['company' => 'No tienes una empresa asociada para registrar operaciones comerciales.']);
        }

        $validated = $request->validate([
            'doc_type' => 'required|in:quotation,sale,invoice,receipt',
            'client_name' => 'required|string|max:255',
            'client_nit' => 'nullable|string|max:50',
            'client_phone' => 'nullable|string|max:50',
            'client_email' => 'nullable|email|max:255',
            'client_city' => 'nullable|string|max:100',
            'client_address' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'delivery_time' => 'nullable|string|max:255',
            'validity_days' => 'nullable|integer|min:1|max:365',
            'notes' => 'nullable|string',
            'date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'nullable|string|max:100',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0|max:100',
            'items.*.product_id' => 'nullable|exists:products,id',
        ]);

        $createdDoc = DB::transaction(function () use ($company, $validated) {
            $docType = $validated['doc_type'];
            $docNumber = $this->generateUniqueDocNumber($company->id, $docType);

            $date = $validated['date'] ?? now()->toDateString();
            $dueDate = $validated['due_date'] ?? ($docType === 'quotation' ? now()->addDays($validated['validity_days'] ?? 15)->toDateString() : $date);
            $status = $docType === 'quotation' ? 'sent' : 'completed';
            $title = $docType === 'quotation'
                ? "Cotización para {$validated['client_name']}"
                : "Nota de Venta para {$validated['client_name']}";

            // Calcular totales
            $subtotalSum = 0;
            $discountSum = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $qty = (float)$item['quantity'];
                $price = (float)$item['price'];
                $disc = isset($item['discount']) ? (float)$item['discount'] : 0.0;

                $base = $qty * $price;
                $discAmount = $base * ($disc / 100);
                $itemSubtotal = $base - $discAmount;

                $subtotalSum += $base;
                $discountSum += $discAmount;

                $itemsData[] = [
                    'product_id' => $item['product_id'] ?? null,
                    'name' => $item['name'],
                    'sku' => $item['sku'] ?? null,
                    'unit' => $item['unit'] ?? 'Pza',
                    'quantity' => $qty,
                    'price' => $price,
                    'discount' => $disc,
                    'subtotal' => $itemSubtotal,
                ];
            }

            $total = $subtotalSum - $discountSum;

            $document = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => $docNumber,
                'doc_type' => $docType,
                'title' => $title,
                'client_name' => $validated['client_name'],
                'client_nit' => $validated['client_nit'] ?? null,
                'client_phone' => $validated['client_phone'] ?? null,
                'client_email' => $validated['client_email'] ?? null,
                'client_city' => $validated['client_city'] ?? null,
                'client_address' => $validated['client_address'] ?? null,
                'date' => $date,
                'due_date' => $dueDate,
                'status' => $status,
                'payment_terms' => $validated['payment_terms'] ?? 'Pago al Contado / QR Simple',
                'delivery_time' => $validated['delivery_time'] ?? 'Inmediata / En 24 horas',
                'validity_days' => $validated['validity_days'] ?? 15,
                'currency' => 'BOB',
                'subtotal' => $subtotalSum,
                'discount_amount' => $discountSum,
                'tax_amount' => 0.00,
                'total' => $total,
                'notes' => $validated['notes'] ?? 'Precios en Bolivianos (Bs.). Sujeto a stock disponible.',
            ]);

            foreach ($itemsData as $itemData) {
                $document->items()->create($itemData);
            }

            return $document->load('items.product');
        });

        return back()->with('success', "Documento {$createdDoc->doc_number} creado exitosamente.");
    }

    /**
     * Convierte una cotización existente en una venta oficial.
     */
    public function convertToSale(Request $request, $id)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            abort(403);
        }

        $quote = CommercialDocument::where('company_id', $company->id)
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('doc_number', $id);
            })
            ->with('items')
            ->firstOrFail();

        DB::transaction(function () use ($company, $quote) {
            // Marcar cotización como aprobada / convertida
            $quote->update(['status' => 'approved']);

            // Crear venta derivada
            $saleDocNumber = $this->generateUniqueDocNumber($company->id, 'sale');

            $sale = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => $saleDocNumber,
                'doc_type' => 'sale',
                'title' => "Venta Concretada desde {$quote->doc_number}",
                'client_name' => $quote->client_name,
                'client_nit' => $quote->client_nit,
                'client_phone' => $quote->client_phone,
                'client_email' => $quote->client_email,
                'client_city' => $quote->client_city,
                'client_address' => $quote->client_address,
                'date' => now()->toDateString(),
                'due_date' => now()->toDateString(),
                'status' => 'completed',
                'payment_terms' => 'Pagado al Contado / Transferencia QR',
                'delivery_time' => 'Entrega conforme / Despachado',
                'validity_days' => 0,
                'currency' => $quote->currency ?? 'BOB',
                'subtotal' => $quote->subtotal,
                'discount_amount' => $quote->discount_amount,
                'tax_amount' => $quote->tax_amount,
                'total' => $quote->total,
                'notes' => "Generada a partir de la cotización {$quote->doc_number}. " . $quote->notes,
            ]);

            foreach ($quote->items as $item) {
                $sale->items()->create([
                    'product_id' => $item->product_id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'unit' => $item->unit,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'discount' => $item->discount,
                    'subtotal' => $item->subtotal,
                ]);
            }
        });

        return back()->with('success', "Cotización {$quote->doc_number} convertida a venta exitosamente.");
    }

    /**
     * Actualiza el estado de un documento comercial (ej. marcar como aprobada, rechazada o pagada).
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:draft,sent,approved,converted,completed,pending_payment,rejected,cancelled',
        ]);

        $doc = CommercialDocument::where('company_id', $company->id)
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('doc_number', $id);
            })
            ->firstOrFail();

        $doc->update(['status' => $validated['status']]);

        return back()->with('success', "Estado del documento {$doc->doc_number} actualizado.");
    }

    /**
     * Elimina un documento comercial y sus ítems de MySQL.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            abort(403);
        }

        $doc = CommercialDocument::where('company_id', $company->id)
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('doc_number', $id);
            })
            ->firstOrFail();

        $docNumber = $doc->doc_number;
        $doc->delete();

        return back()->with('success', "Documento {$docNumber} eliminado de la base de datos.");
    }

    /**
     * Generador de numeración correlativa segura por empresa y año (ej. COT-2026-0001, VEN-2026-0001).
     */
    private function generateUniqueDocNumber(int $companyId, string $docType): string
    {
        $prefix = $docType === 'quotation' ? 'COT' : ($docType === 'sale' ? 'VEN' : 'DOC');
        $year = date('Y');

        $count = CommercialDocument::where('company_id', $companyId)
            ->where('doc_type', $docType)
            ->whereYear('date', $year)
            ->count();

        $seq = $count + 1;
        do {
            $formatted = sprintf('%s-%s-%04d', $prefix, $year, $seq);
            $exists = CommercialDocument::where('company_id', $companyId)
                ->where('doc_number', $formatted)
                ->exists();
            if ($exists) {
                $seq++;
            }
        } while ($exists);

        return $formatted;
    }

    /**
     * Siembra datos comerciales iniciales en MySQL para que el usuario cuente con historial operativo.
     */
    private function seedInitialDocuments($company)
    {
        DB::transaction(function () use ($company) {
            // Cotización 1
            $c1 = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => 'COT-2026-0042',
                'doc_type' => 'quotation',
                'title' => 'Cotización Equipamiento y Suministros B2B',
                'client_name' => 'Constructora Altiplano S.R.L.',
                'client_nit' => '4829104019',
                'client_phone' => '71523490',
                'client_email' => 'compras@altiplano.bo',
                'client_city' => 'Santa Cruz de la Sierra',
                'client_address' => 'Av. San Martín #450, Equipetrol',
                'date' => '2026-10-25',
                'due_date' => '2026-11-10',
                'status' => 'approved',
                'payment_terms' => '50% anticipo, 50% contra entrega',
                'delivery_time' => '3 a 5 días hábiles',
                'validity_days' => 15,
                'subtotal' => 5450.00,
                'discount_amount' => 225.00,
                'total' => 5225.00,
                'notes' => 'Precios expresados en Bolivianos (Bs.). Incluye entrega en almacén central y soporte post-venta.',
            ]);
            $c1->items()->createMany([
                ['name' => 'Lote Industrial Premium Mod. A-1', 'sku' => 'IND-01-A', 'unit' => 'Pza', 'quantity' => 10, 'price' => 280.00, 'discount' => 5, 'subtotal' => 2660.00],
                ['name' => 'Kit de Accesorios y Conexiones Reforzadas', 'sku' => 'ACC-REF-88', 'unit' => 'Kit', 'quantity' => 4, 'price' => 450.00, 'discount' => 0, 'subtotal' => 1800.00],
                ['name' => 'Servicio de Instalación y Calibración In Situ', 'sku' => 'SRV-CAL-01', 'unit' => 'Servicio', 'quantity' => 1, 'price' => 850.00, 'discount' => 10, 'subtotal' => 765.00],
            ]);

            // Cotización 2
            $c2 = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => 'COT-2026-0043',
                'doc_type' => 'quotation',
                'title' => 'Presupuesto Institucional de Mercadería Mayorista',
                'client_name' => 'Distribuidora Los Andes',
                'client_nit' => '3928174021',
                'client_phone' => '72099182',
                'client_email' => 'gerencia@distribuidoraandes.com',
                'client_city' => 'La Paz',
                'client_address' => 'Calle Murillo #1289, Zona Central',
                'date' => '2026-10-27',
                'due_date' => '2026-11-12',
                'status' => 'sent',
                'payment_terms' => 'Transferencia Bancaria / QR Simple a 15 días',
                'delivery_time' => 'Inmediata',
                'validity_days' => 15,
                'subtotal' => 6510.00,
                'discount_amount' => 396.80,
                'total' => 6113.20,
                'notes' => 'Validez de la oferta sujeta a disponibilidad de stock en almacén El Alto.',
            ]);
            $c2->items()->createMany([
                ['name' => 'Pack Mayorista de Repuestos Estándar (Caja x 50)', 'sku' => 'PAK-50-STD', 'unit' => 'Caja', 'quantity' => 8, 'price' => 620.00, 'discount' => 8, 'subtotal' => 4563.20],
                ['name' => 'Juego de Herramientas de Precisión', 'sku' => 'HRM-PREC-12', 'unit' => 'Juego', 'quantity' => 5, 'price' => 310.00, 'discount' => 0, 'subtotal' => 1550.00],
            ]);

            // Cotización 3
            $c3 = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => 'COT-2026-0044',
                'doc_type' => 'quotation',
                'title' => 'Propuesta Comercial para Suministro Trimestral',
                'client_name' => 'Hotel Real Palace Cochabamba',
                'client_nit' => '8491029014',
                'client_phone' => '74301928',
                'client_email' => 'administracion@realpalace.com.bo',
                'client_city' => 'Cochabamba',
                'client_address' => 'Av. Heroínas #820',
                'date' => '2026-10-28',
                'due_date' => '2026-11-15',
                'status' => 'draft',
                'payment_terms' => 'Al Contado / Contra Entrega',
                'delivery_time' => '24 a 48 horas',
                'validity_days' => 15,
                'subtotal' => 2250.00,
                'discount_amount' => 112.50,
                'total' => 2137.50,
                'notes' => 'Cotización en borrador para revisión interna.',
            ]);
            $c3->items()->createMany([
                ['name' => 'Dotación Especial Insumos de Limpieza y Mantenimiento', 'sku' => 'INS-LMP-04', 'unit' => 'Tambor', 'quantity' => 3, 'price' => 750.00, 'discount' => 5, 'subtotal' => 2137.50],
            ]);

            // Venta 1
            $s1 = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => 'VEN-2026-0118',
                'doc_type' => 'sale',
                'title' => 'Nota de Venta / Pedido Entregado',
                'client_name' => 'Importadora & Multiservicios Illimani',
                'client_nit' => '9840291018',
                'client_phone' => '76543210',
                'client_email' => 'ventas@illimanibolivia.com',
                'client_city' => 'La Paz',
                'client_address' => 'Av. Montes #742',
                'date' => '2026-10-24',
                'due_date' => '2026-10-24',
                'status' => 'completed',
                'payment_terms' => 'Pagado al Contado (QR Simple)',
                'delivery_time' => 'Entregado conforme',
                'validity_days' => 0,
                'subtotal' => 4300.00,
                'discount_amount' => 60.00,
                'total' => 4240.00,
                'notes' => 'Mercadería entregada en perfectas condiciones.',
            ]);
            $s1->items()->createMany([
                ['name' => 'Equipo Multifunción Comercial v2', 'sku' => 'EQP-MULTI-02', 'unit' => 'Pza', 'quantity' => 2, 'price' => 1850.00, 'discount' => 0, 'subtotal' => 3700.00],
                ['name' => 'Kit de Mantenimiento Preventivo Anual', 'sku' => 'MNT-ANUAL-01', 'unit' => 'Servicio', 'quantity' => 1, 'price' => 600.00, 'discount' => 10, 'subtotal' => 540.00],
            ]);

            // Venta 2
            $s2 = CommercialDocument::create([
                'company_id' => $company->id,
                'doc_number' => 'VEN-2026-0119',
                'doc_type' => 'sale',
                'title' => 'Orden de Venta Mayorista Despachada',
                'client_name' => 'Comercializadora del Sur',
                'client_nit' => '6740291015',
                'client_phone' => '78291044',
                'client_email' => 'pedidos@comercializadorasur.bo',
                'client_city' => 'Tarija',
                'client_address' => 'Av. Víctor Paz Estenssoro #312',
                'date' => '2026-10-26',
                'due_date' => '2026-11-05',
                'status' => 'pending_payment',
                'payment_terms' => 'Crédito Comercial 10 días',
                'delivery_time' => 'Despachado por Encomienda Flota',
                'validity_days' => 10,
                'subtotal' => 4080.00,
                'discount_amount' => 204.00,
                'total' => 3876.00,
                'notes' => 'Guía de transporte Nº 49201. Pendiente de confirmación de depósito restante.',
            ]);
            $s2->items()->createMany([
                ['name' => 'Caja Surtida de Productos de Alta Rotación', 'sku' => 'SRT-ROT-100', 'unit' => 'Caja', 'quantity' => 12, 'price' => 340.00, 'discount' => 5, 'subtotal' => 3876.00],
            ]);
        });
    }
}
