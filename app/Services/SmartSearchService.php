<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class SmartSearchService
{
    /**
     * Diccionario de conceptos y sinónimos para expansión semántica en español.
     * Permite relacionar necesidades o intenciones con productos del catálogo.
     */
    protected static array $synonyms = [
        'bajar de peso' => ['adelgazar', 'quemar grasa', 'quema grasa', 'dieta', 'reductor', 'reductores', 'perder peso', 'fitness', 'desintoxicante', 'detox', 'suplemento'],
        'adelgazar' => ['bajar de peso', 'quemar grasa', 'dieta', 'reductor', 'detox'],
        'celular' => ['telefono', 'teléfono', 'smartphone', 'movil', 'móvil', 'xiaomi', 'samsung', 'iphone', 'motorola', 'infinix', 'tecno', 'honor'],
        'smartphone' => ['celular', 'telefono', 'teléfono', 'movil', 'móvil'],
        'computadora' => ['laptop', 'portatil', 'portátil', 'pc', 'notebook', 'computador', 'desktop'],
        'laptop' => ['computadora', 'portatil', 'notebook', 'pc'],
        'ferreteria' => ['herramienta', 'herramientas', 'construccion', 'construcción', 'tornillo', 'taladro', 'disco', 'pintura', 'cemento'],
        'herramienta' => ['ferreteria', 'taladro', 'amoladora', 'destornillador', 'llave', 'alicate'],
        'ropa' => ['moda', 'prenda', 'camisa', 'pantalon', 'polera', 'vestido', 'calzado', 'textil'],
        'medicamento' => ['salud', 'farmacia', 'medico', 'médico', 'jarabe', 'pastilla', 'capsula'],
        'alimento' => ['comida', 'bebida', 'snack', 'abarrote', 'grano', 'harina', 'aceite', 'comestible'],
    ];

    /**
     * Palabras clave que indican intención de precio bajo o económico
     */
    protected static array $economicKeywords = [
        'economico', 'económico', 'economica', 'económica',
        'barato', 'barata', 'baratos', 'baratas',
        'accesible', 'bajo costo', 'bajo precio', 'comodo', 'cómodo'
    ];

    /**
     * Palabras clave que indican intención de ofertas y descuentos
     */
    protected static array $offerKeywords = [
        'oferta', 'ofertas', 'descuento', 'descuentos', 'rebaja', 'rebajas',
        'promocion', 'promoción', 'promociones', 'promo', 'promos', 'liquidacion', 'liquidación'
    ];

    /**
     * Palabras clave que indican intención mayorista B2B
     */
    protected static array $wholesaleKeywords = [
        'mayorista', 'mayoristas', 'al por mayor', 'por mayor', 'mayor',
        'por volumen', 'distribuidor', 'b2b', 'fardo', 'caja', 'docena'
    ];

    /**
     * Palabras clave que indican intención de alta gama o premium
     */
    protected static array $premiumKeywords = [
        'alta gama', 'gama alta', 'premium', 'caro', 'profesional', 'lujo', 'original'
    ];

    /**
     * Analiza una consulta en lenguaje natural y extrae intenciones, modificadores y términos limpios
     */
    public static function parseQuery(string $rawQuery): array
    {
        $normalized = mb_strtolower(trim($rawQuery), 'UTF-8');
        
        $intents = [
            'sort_price_asc' => false,
            'sort_price_desc' => false,
            'filter_offers' => false,
            'filter_wholesale' => false,
            'expanded_terms' => [],
            'clean_term' => $normalized,
            'detected_intent_label' => null,
        ];

        // 1. Detectar intención económica
        foreach (self::$economicKeywords as $keyword) {
            if (str_contains($normalized, $keyword)) {
                $intents['sort_price_asc'] = true;
                $intents['detected_intent_label'] = '💰 Ordenado por menor precio (Económico)';
                $normalized = trim(str_replace($keyword, '', $normalized));
            }
        }

        // 2. Detectar intención de ofertas / promociones
        foreach (self::$offerKeywords as $keyword) {
            if (str_contains($normalized, $keyword)) {
                $intents['filter_offers'] = true;
                $intents['detected_intent_label'] = '🔥 Filtrado por productos en oferta o descuento';
                $normalized = trim(str_replace($keyword, '', $normalized));
            }
        }

        // 3. Detectar intención mayorista B2B
        foreach (self::$wholesaleKeywords as $keyword) {
            if (str_contains($normalized, $keyword)) {
                $intents['filter_wholesale'] = true;
                $intents['detected_intent_label'] = '🏢 Filtrado por precios mayoristas B2B';
                $normalized = trim(str_replace($keyword, '', $normalized));
            }
        }

        // 4. Detectar intención premium
        foreach (self::$premiumKeywords as $keyword) {
            if (str_contains($normalized, $keyword)) {
                $intents['sort_price_desc'] = true;
                $intents['detected_intent_label'] = '⭐ Ordenado por gama alta / premium';
                $normalized = trim(str_replace($keyword, '', $normalized));
            }
        }

        // Limpiar conectores como "para", "de", "con", "en", "el", "la", "los", "las", "un", "una"
        $words = preg_split('/\s+/', $normalized);
        $stopWords = ['para', 'de', 'del', 'con', 'en', 'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'];
        $filteredWords = array_filter($words, function ($w) use ($stopWords) {
            return !in_array($w, $stopWords) && mb_strlen($w) > 0;
        });

        $cleanTerm = implode(' ', $filteredWords);
        $intents['clean_term'] = trim($cleanTerm) ?: trim($normalized);

        // 5. Expansión semántica por sinónimos
        $termsToSearch = array_filter([$intents['clean_term'], $rawQuery]);
        foreach (self::$synonyms as $concept => $syns) {
            if (str_contains($normalized, $concept) || str_contains(mb_strtolower($rawQuery, 'UTF-8'), $concept)) {
                $termsToSearch = array_merge($termsToSearch, $syns);
            }
            foreach ($syns as $syn) {
                if (str_contains($normalized, $syn)) {
                    $termsToSearch[] = $concept;
                    $termsToSearch = array_merge($termsToSearch, $syns);
                    break;
                }
            }
        }

        $intents['expanded_terms'] = array_values(array_unique(array_filter($termsToSearch)));

        return $intents;
    }

    /**
     * Aplica la búsqueda inteligente a un Query Builder de Productos
     */
    public static function applyProductSearch(Builder $query, string $rawQuery): array
    {
        $parsed = self::parseQuery($rawQuery);
        $cleanTerm = $parsed['clean_term'];
        $expandedTerms = $parsed['expanded_terms'];

        // Si hay términos de búsqueda
        if (!empty($cleanTerm) || !empty($expandedTerms)) {
            $query->where(function (Builder $subQuery) use ($cleanTerm, $expandedTerms, $rawQuery) {
                // 1. Coincidencia directa con el término limpio o la frase original
                $subQuery->where('name', 'like', "%{$cleanTerm}%")
                         ->orWhere('sku', 'like', "%{$cleanTerm}%")
                         ->orWhere('tags', 'like', "%{$cleanTerm}%")
                         ->orWhere('short_description', 'like', "%{$cleanTerm}%")
                         ->orWhere('description', 'like', "%{$cleanTerm}%")
                         ->orWhereHas('category', function ($catQuery) use ($cleanTerm) {
                             $catQuery->where('name', 'like', "%{$cleanTerm}%");
                         })
                         ->orWhereHas('company', function ($compQuery) use ($cleanTerm) {
                             $compQuery->where('name', 'like', "%{$cleanTerm}%");
                         });

                // 2. Coincidencias con términos semánticos expandidos
                foreach (array_slice($expandedTerms, 0, 6) as $expTerm) {
                    if (empty($expTerm) || $expTerm === $cleanTerm) continue;
                    $subQuery->orWhere('name', 'like', "%{$expTerm}%")
                             ->orWhere('tags', 'like', "%{$expTerm}%")
                             ->orWhere('short_description', 'like', "%{$expTerm}%");
                }
            });
        }

        // 3. Aplicar filtros de intención
        if ($parsed['filter_offers']) {
            $query->whereNotNull('original_price')
                  ->whereColumn('original_price', '>', 'price');
        }

        if ($parsed['filter_wholesale']) {
            $query->whereNotNull('wholesale_price')
                  ->where('wholesale_price', '>', 0);
        }

        // 4. Aplicar orden de intención
        if ($parsed['sort_price_asc']) {
            $query->orderBy('price', 'asc');
        } elseif ($parsed['sort_price_desc']) {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest();
        }

        return $parsed;
    }
}

