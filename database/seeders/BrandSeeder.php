<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            // Seguridad & Redes (mencionado Dahua por el usuario)
            ['name' => 'Dahua', 'description' => 'Sistemas de videovigilancia, cámaras de seguridad y tecnología de control de acceso.'],
            ['name' => 'Hikvision', 'description' => 'Soluciones de seguridad electrónica, CCTV y videovigilancia profesional.'],
            ['name' => 'TP-Link', 'description' => 'Routers, switches y dispositivos de conectividad y redes.'],
            ['name' => 'Ubiquiti', 'description' => 'Equipos de redes inalámbricas y telecomunicaciones de alto rendimiento.'],

            // Tecnología & Informática
            ['name' => 'Samsung', 'description' => 'Electrónica de consumo, smartphones, pantallas y electrodomésticos.'],
            ['name' => 'Apple', 'description' => 'Dispositivos premium, laptops, tablets y telefonía inteligente.'],
            ['name' => 'Xiaomi', 'description' => 'Smartphones, tecnología para el hogar inteligente y gadgets.'],
            ['name' => 'Sony', 'description' => 'Audio, video profesional, cámaras y entretenimiento.'],
            ['name' => 'LG', 'description' => 'Televisores, monitores y tecnología para el hogar.'],
            ['name' => 'Lenovo', 'description' => 'Computadoras portátiles, servidores y equipos de oficina.'],
            ['name' => 'HP', 'description' => 'Laptops, impresoras empresariales y suministros de cómputo.'],
            ['name' => 'Dell', 'description' => 'Computadoras, estaciones de trabajo y servidores empresariales.'],
            ['name' => 'Epson', 'description' => 'Impresoras EcoTank, proyectores y consumibles de alta eficiencia.'],
            ['name' => 'Canon', 'description' => 'Impresoras profesionales, cámaras fotográficas y óptica.'],

            // Construcción & Ferretería
            ['name' => 'Tramontina', 'description' => 'Herramientas manuales, menaje industrial y equipamiento.'],
            ['name' => 'Bosch', 'description' => 'Herramientas eléctricas industriales y tecnología de precisión.'],
            ['name' => 'Makita', 'description' => 'Herramientas eléctricas y a batería para construcción y carpintería.'],
            ['name' => 'DeWalt', 'description' => 'Herramientas pesadas y maquinaria para obra y construcción.'],
            ['name' => 'Stanley', 'description' => 'Herramientas manuales de alta durabilidad y cajas de herramientas.'],
            ['name' => 'Truper', 'description' => 'Ferretería profesional, herramientas de mano y jardín.'],
            ['name' => '3M', 'description' => 'Seguridad industrial, cintas adhesivas, abrasivos y protección personal.'],

            // Materiales de Construcción Bolivia
            ['name' => 'Coboce', 'description' => 'Cemento, cerámicas y materiales de construcción de calidad boliviana.'],
            ['name' => 'Fancesa', 'description' => 'Cemento y derivados para la industria de la construcción.'],
            ['name' => 'Soboce', 'description' => 'Cemento Viacha, hormigón preparado y soluciones constructivas.'],
            ['name' => 'Tigre', 'description' => 'Tuberías y conexiones para agua, alcantarillado y electricidad.'],
            ['name' => 'Plastforte', 'description' => 'Tuberías de polietileno HDPE para conducción de fluidos.'],

            // Genérico
            ['name' => 'Genérica / Sin Marca', 'description' => 'Productos estándar, artesanales o de fabricación independiente.'],
        ];

        foreach ($brands as $b) {
            Brand::firstOrCreate(
                ['name' => $b['name']],
                [
                    'slug' => Str::slug($b['name']),
                    'description' => $b['description'] ?? null,
                    'is_active' => true,
                ]
            );
        }
    }
}
