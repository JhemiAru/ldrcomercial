<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Company;
use App\Models\Event;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CommercialDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuarios Principales
        $vaneAdmin = User::updateOrCreate(
            ['email' => 'vaneadmin@ldrcomercial.com'],
            [
                'name' => 'Administradora Vane',
                'password' => bcrypt('agosto06@'),
                'role' => 'admin',
                'phone' => '+59170000000',
                'email_verified_at' => now(),
            ]
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@ldrcomercial.com'],
            [
                'name' => 'Administrador LDR',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'phone' => '+59170000000',
                'email_verified_at' => now(),
            ]
        );

        $techUser = User::updateOrCreate(
            ['email' => 'empresa@demo.com'],
            [
                'name' => 'TechSolutions Bolivia',
                'password' => bcrypt('password123'),
                'role' => 'company',
                'phone' => '+59175012345',
            ]
        );

        $constUser = User::updateOrCreate(
            ['email' => 'constructora@demo.com'],
            [
                'name' => 'ConstruSur Materiales',
                'password' => bcrypt('password123'),
                'role' => 'company',
                'phone' => '+59171098765',
            ]
        );

        $agroUser = User::updateOrCreate(
            ['email' => 'agrosur@demo.com'],
            [
                'name' => 'AgroInsumos del Oriente',
                'password' => bcrypt('password123'),
                'role' => 'company',
                'phone' => '+59178044332',
            ]
        );

        // 2. Categorías / Rubros
        $categoriesData = [
            ['name' => 'Tecnología y Electrónica', 'icon' => '💻', 'type' => 'both', 'description' => 'Servidores, cómputo corporativo, redes e infraestructura.'],
            ['name' => 'Construcción y Ferretería', 'icon' => '🏗️', 'type' => 'both', 'description' => 'Materiales de construcción, herramientas de potencia y ferretería pesada.'],
            ['name' => 'Alimentos y Bebidas', 'icon' => '🍎', 'type' => 'both', 'description' => 'Distribución de alimentos al por mayor, granos y especialidades.'],
            ['name' => 'Agroindustria y Maquinaria', 'icon' => '🌾', 'type' => 'both', 'description' => 'Insumos agrícolas, fertilizantes, tractores y repuestos.'],
            ['name' => 'Salud y Equipamiento Médico', 'icon' => '🏥', 'type' => 'both', 'description' => 'Equipamiento biomédico, insumos clínicos y farmacia.'],
            ['name' => 'Logística y Transporte', 'icon' => '🚚', 'type' => 'sector', 'description' => 'Servicios de transporte de carga pesada, almacenaje y aduanas.'],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[$data['name']] = Category::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'name' => $data['name'],
                    'icon' => $data['icon'],
                    'type' => $data['type'],
                    'description' => $data['description'],
                    'is_active' => true,
                ]
            );
        }

        // 3. Empresas con Logo y Banner
        $company1 = Company::updateOrCreate(
            ['slug' => 'techsolutions-bolivia'],
            [
                'user_id' => $techUser->id,
                'category_id' => $categories['Tecnología y Electrónica']->id,
                'name' => 'TechSolutions Bolivia SRL',
                'legal_name' => 'TechSolutions Importadora & Distribuidora SRL',
                'tax_id' => '1029384756',
                'logo' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
                'short_description' => 'Mayorista de hardware corporativo, servidores e infraestructura de red.',
                'description' => 'Empresa líder en soluciones informáticas y distribución mayorista para corporaciones, bancos y pymes.',
                'phone' => '+591 3 3456789',
                'whatsapp' => '59175012345',
                'email' => 'ventas@techsolutions.bo',
                'website' => 'https://techsolutions.bo',
                'address' => 'Av. San Martín #450, Equipetrol',
                'city' => 'Santa Cruz de la Sierra',
                'department' => 'Santa Cruz',
                'is_verified' => true,
                'is_active' => true,
            ]
        );

        $company2 = Company::updateOrCreate(
            ['slug' => 'construsur-materiales'],
            [
                'user_id' => $constUser->id,
                'category_id' => $categories['Construcción y Ferretería']->id,
                'name' => 'ConstruSur Materiales & Ferretería Industrial',
                'legal_name' => 'ConstruSur Distribuidora Industrial SA',
                'tax_id' => '2049586711',
                'logo' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
                'short_description' => 'Distribución mayorista de aceros, cementos y herramientas industriales para construcción.',
                'description' => 'Más de 15 años abasteciendo a constructoras, contratistas y ferreterías con los mejores precios directos de fábrica.',
                'phone' => '+591 3 3881122',
                'whatsapp' => '59171098765',
                'email' => 'pedidos@construsur.bo',
                'website' => 'https://construsur.bo',
                'address' => 'Parque Industrial, Mz. 12',
                'city' => 'Santa Cruz de la Sierra',
                'department' => 'Santa Cruz',
                'is_verified' => true,
                'is_active' => true,
            ]
        );

        $company3 = Company::updateOrCreate(
            ['slug' => 'agroinsumos-del-oriente'],
            [
                'user_id' => $agroUser->id,
                'category_id' => $categories['Agroindustria y Maquinaria']->id,
                'name' => 'AgroInsumos del Oriente',
                'legal_name' => 'AgroInsumos & Semillas del Oriente SRL',
                'tax_id' => '3094857102',
                'logo' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&auto=format&fit=crop&q=80',
                'short_description' => 'Fertilizantes foliares, semillas certificadas y repuestos de cosechadoras.',
                'description' => 'Soluciones integrales de abastecimiento para el productor agropecuario boliviano con despacho nacional.',
                'phone' => '+591 3 3119988',
                'whatsapp' => '59178044332',
                'email' => 'contacto@agrooriente.bo',
                'website' => 'https://agrooriente.bo',
                'address' => 'Carretera al Norte Km 14',
                'city' => 'Warnes',
                'department' => 'Santa Cruz',
                'is_verified' => true,
                'is_active' => true,
            ]
        );

        // 4. Catálogo de Productos con Imágenes Directas
        $products = [
            [
                'company_id' => $company1->id,
                'category_id' => $categories['Tecnología y Electrónica']->id,
                'name' => 'Servidor Dell PowerEdge R450 2U Rackeable',
                'sku' => 'SRV-DELL-R450',
                'short_description' => 'Servidor para racks corporativos de alta demanda, virtualización con procesadores Xeon duales.',
                'price' => 18500.00,
                'wholesale_price' => 16900.00,
                'min_wholesale_qty' => 2,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'unidad',
                'main_image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 12,
                'is_featured' => true,
            ],
            [
                'company_id' => $company1->id,
                'category_id' => $categories['Tecnología y Electrónica']->id,
                'name' => 'Laptop Corporativa Lenovo ThinkPad T14 Gen 4 Core i7',
                'sku' => 'LAP-TP-T14G4',
                'short_description' => 'Portátil empresarial ultrarresistente con 32GB RAM, 1TB SSD NVMe y pantalla antireflejo.',
                'price' => 7450.00,
                'wholesale_price' => 6700.00,
                'min_wholesale_qty' => 3,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'unidad',
                'main_image' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 35,
                'is_featured' => true,
            ],
            [
                'company_id' => $company1->id,
                'category_id' => $categories['Tecnología y Electrónica']->id,
                'name' => 'Switch Gestionable Cisco Catalyst 24 Puertos Gigabit PoE+',
                'sku' => 'SW-CISCO-C1000',
                'short_description' => 'Conmutador de red L2 gestionable con soporte PoE+ para telefonía IP, cámaras y WiFi 6.',
                'price' => 3200.00,
                'wholesale_price' => 2850.00,
                'min_wholesale_qty' => 5,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'unidad',
                'main_image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 20,
                'is_featured' => true,
            ],
            [
                'company_id' => $company2->id,
                'category_id' => $categories['Construcción y Ferretería']->id,
                'name' => 'Rotomartillo Percutor Industrial Bosch GBH 2-28 F',
                'sku' => 'TOOL-BSH-GBH28',
                'short_description' => 'Potente taladro percutor de 880W con maletín de transporte y mandril intercambiable.',
                'price' => 1480.00,
                'wholesale_price' => 1290.00,
                'min_wholesale_qty' => 4,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'unidad',
                'main_image' => 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 50,
                'is_featured' => true,
            ],
            [
                'company_id' => $company2->id,
                'category_id' => $categories['Construcción y Ferretería']->id,
                'name' => 'Cemento Estructural IP-40 Alta Resistencia (Bolsa 50kg)',
                'sku' => 'MAT-CEM-IP40',
                'short_description' => 'Cemento portland puzolánico ideal para vaciado de losas, columnas y pavimentos rígidos.',
                'price' => 54.00,
                'wholesale_price' => 48.50,
                'min_wholesale_qty' => 100,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'bolsa',
                'main_image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 2500,
                'is_featured' => true,
            ],
            [
                'company_id' => $company3->id,
                'category_id' => $categories['Agroindustria y Maquinaria']->id,
                'name' => 'Fertilizante Compuesto NPK 15-15-15 Granulado (50kg)',
                'sku' => 'AGR-FERT-NPK15',
                'short_description' => 'Abono mineral equilibrado para nutrición intensiva en soya, maíz, sorgo y frutales.',
                'price' => 280.00,
                'wholesale_price' => 245.00,
                'min_wholesale_qty' => 20,
                'currency' => 'BOB',
                'price_type' => 'fixed',
                'unit' => 'bolsa',
                'main_image' => 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
                'in_stock' => true,
                'stock_quantity' => 600,
                'is_featured' => true,
            ],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(
                ['slug' => Str::slug($prod['name'])],
                array_merge($prod, ['status' => 'published'])
            );
        }

        // 5. Eventos Comerciales con Banners Reales
        Event::updateOrCreate(
            ['slug' => 'encuentro-tecnologico-b2b-santa-cruz-2026'],
            [
                'company_id' => $company1->id,
                'title' => 'Encuentro Tecnológico y Rueda B2B Santa Cruz 2026',
                'short_description' => 'Lanzamiento de nuevas líneas de servidores e infraestructura con precios preferenciales por preventa.',
                'description' => 'Acompañanos en una jornada presencial con demostraciones de servidores, networking con ejecutivos y descuentos de fábrica.',
                'event_type' => 'fair',
                'banner_image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
                'start_date' => now()->addDays(12)->setHour(18)->setMinute(30),
                'end_date' => now()->addDays(12)->setHour(22)->setMinute(0),
                'modality' => 'in_person',
                'location_name' => 'Centro de Convenciones Los Tajibos',
                'address' => 'Av. San Martín #455',
                'city' => 'Santa Cruz de la Sierra',
                'admission_type' => 'registration_required',
                'admission_price' => 0.00,
                'link' => 'https://techsolutions.bo/registro-b2b',
                'is_featured' => true,
                'status' => 'active',
            ]
        );

        Event::updateOrCreate(
            ['slug' => 'expo-construccion-precios-fabrica-2026'],
            [
                'company_id' => $company2->id,
                'title' => 'Jornada Mayorista: Descuentos Directos de Fábrica en Acero y Cemento',
                'short_description' => 'Precios especiales por volumen para constructoras, empresas de ingeniería y ferreterías.',
                'description' => 'Venta especial con liquidación de lotes en aceros corrugados, herramientas de potencia y cementos.',
                'event_type' => 'discount',
                'banner_image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
                'start_date' => now()->addDays(5)->setHour(8)->setMinute(0),
                'end_date' => now()->addDays(7)->setHour(18)->setMinute(0),
                'modality' => 'in_person',
                'location_name' => 'Centro Logístico ConstruSur, Parque Industrial',
                'address' => 'Av. Virgen de Cotoca, 4to Anillo',
                'city' => 'Santa Cruz de la Sierra',
                'admission_type' => 'free',
                'admission_price' => 0.00,
                'is_featured' => true,
                'status' => 'active',
            ]
        );
    }
}
