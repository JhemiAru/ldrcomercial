<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Muestra el panel comercial de Ventas y Cotizaciones con vista previa interactiva.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->company()->with('category')->first();

        // Obtener productos publicados de la empresa para usarlos en el cotizador
        $products = $company
            ? $company->products()
                ->where('status', 'published')
                ->select(['id', 'name', 'sku', 'price', 'wholesale_price', 'currency', 'unit', 'main_image'])
                ->get()
            : [];

        // Datos iniciales de demostración contextualizados para la empresa
        $companyName = $company ? $company->name : 'Comercial LDR';
        $companyCity = $company && $company->city ? $company->city : 'La Paz';
        $companyTaxId = $company && $company->tax_id ? $company->tax_id : '1029384029';
        $companyPhone = $company && $company->phone ? $company->phone : '78945612';

        $demoQuotes = [
            [
                'id' => 'COT-2026-0042',
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
                'status' => 'approved', // draft, sent, approved, converted, rejected
                'payment_terms' => '50% anticipo, 50% contra entrega',
                'delivery_time' => '3 a 5 días hábiles',
                'validity_days' => 15,
                'notes' => 'Precios expresados en Bolivianos (Bs.). Incluye entrega en almacén central y soporte técnico post-venta.',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Lote Industrial Premium Mod. A-1',
                        'sku' => 'IND-01-A',
                        'unit' => 'Pza',
                        'quantity' => 10,
                        'price' => 280.00,
                        'discount' => 5, // %
                    ],
                    [
                        'id' => 2,
                        'name' => 'Kit de Accesorios y Conexiones Reforzadas',
                        'sku' => 'ACC-REF-88',
                        'unit' => 'Kit',
                        'quantity' => 4,
                        'price' => 450.00,
                        'discount' => 0,
                    ],
                    [
                        'id' => 3,
                        'name' => 'Servicio de Instalación y Calibración In Situ',
                        'sku' => 'SRV-CAL-01',
                        'unit' => 'Servicio',
                        'quantity' => 1,
                        'price' => 850.00,
                        'discount' => 10,
                    ],
                ],
            ],
            [
                'id' => 'COT-2026-0043',
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
                'notes' => 'Validez de la oferta sujeta a disponibilidad de stock en almacén El Alto.',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Pack Mayorista de Repuestos Estándar (Caja x 50)',
                        'sku' => 'PAK-50-STD',
                        'unit' => 'Caja',
                        'quantity' => 8,
                        'price' => 620.00,
                        'discount' => 8,
                    ],
                    [
                        'id' => 2,
                        'name' => 'Juego de Herramientas de Precisión',
                        'sku' => 'HRM-PREC-12',
                        'unit' => 'Juego',
                        'quantity' => 5,
                        'price' => 310.00,
                        'discount' => 0,
                    ],
                ],
            ],
            [
                'id' => 'COT-2026-0044',
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
                'notes' => 'Cotización en borrador para revisión interna con gerencia de ventas.',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Dotación Especial Insumos de Limpieza y Mantenimiento',
                        'sku' => 'INS-LMP-04',
                        'unit' => 'Tambor',
                        'quantity' => 3,
                        'price' => 750.00,
                        'discount' => 5,
                    ],
                ],
            ],
        ];

        $demoSales = [
            [
                'id' => 'VEN-2026-0118',
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
                'status' => 'completed', // completed, pending_payment, cancelled
                'payment_terms' => 'Pagado al Contado (QR Simple)',
                'delivery_time' => 'Entregado conforme',
                'validity_days' => 0,
                'notes' => 'Mercadería entregada en perfectas condiciones y factura emitida electrónicamente en SIAT.',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Equipo Multifunción Comercial v2',
                        'sku' => 'EQP-MULTI-02',
                        'unit' => 'Pza',
                        'quantity' => 2,
                        'price' => 1850.00,
                        'discount' => 0,
                    ],
                    [
                        'id' => 2,
                        'name' => 'Kit de Mantenimiento Preventivo Anual',
                        'sku' => 'MNT-ANUAL-01',
                        'unit' => 'Servicio',
                        'quantity' => 1,
                        'price' => 600.00,
                        'discount' => 10,
                    ],
                ],
            ],
            [
                'id' => 'VEN-2026-0119',
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
                'notes' => 'Guía de transporte Nº 49201. Pendiente de confirmación de depósito restante.',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Caja Surtida de Productos de Alta Rotación',
                        'sku' => 'SRT-ROT-100',
                        'unit' => 'Caja',
                        'quantity' => 12,
                        'price' => 340.00,
                        'discount' => 5,
                    ],
                ],
            ],
        ];

        return Inertia::render('Sales/Index', [
            'hasCompany' => (bool)$company,
            'company' => $company,
            'catalogProducts' => $products,
            'initialQuotes' => $demoQuotes,
            'initialSales' => $demoSales,
        ]);
    }
}

