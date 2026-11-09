<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanyOgCardService
{
    /**
     * Obtiene o genera la imagen OpenGraph para una empresa.
     * Soporta seleccionar un flyer específico del carrusel (1, 2, 3), el logo o la tarjeta automática ('card').
     * Retorna la ruta física del archivo generado (JPEG).
     */
    public function getOrGenerateCard(Company $company, ?string $bannerKey = null): string
    {
        $dir = storage_path('app/public/og_cards');
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        $key = strtolower(trim((string)$bannerKey));
        if ($key === '' || $key === 'default') {
            $key = '1';
        }

        // Si se pide explícitamente la tarjeta automática multi-producto
        if ($key === 'card') {
            return $this->getOrGenerateTemplateCard($company, $dir);
        }

        // Determinar qué flyer/imagen se seleccionó
        $imageSrc = null;
        if ($key === '1' || $key === 'banner') {
            $imageSrc = $company->banner;
        } elseif ($key === '2' || $key === 'banner_2') {
            $imageSrc = $company->banner_2;
        } elseif ($key === '3' || $key === 'banner_3') {
            $imageSrc = $company->banner_3;
        } elseif ($key === 'logo') {
            $imageSrc = $company->logo;
        }

        // Si la imagen seleccionada no existe, buscar el primer banner disponible
        if (empty($imageSrc)) {
            $imageSrc = $company->banner ?: ($company->banner_2 ?: ($company->banner_3 ?: $company->logo));
        }

        // Si la empresa no tiene ninguna imagen subida, generamos la tarjeta automática
        if (empty($imageSrc)) {
            return $this->getOrGenerateTemplateCard($company, $dir);
        }

        // Procesar y cachear el flyer seleccionado como JPEG de alta compatibilidad para WhatsApp
        return $this->processAndCacheFlyer($company, $imageSrc, $key, $dir);
    }

    /**
     * Procesa un flyer (PNG, JPG, WebP o URL) y lo almacena como JPEG estándar optimizado para WhatsApp.
     */
    protected function processAndCacheFlyer(Company $company, string $imageSrc, string $key, string $dir): string
    {
        $hash = md5($company->id . '_' . $key . '_' . $imageSrc);
        $fileName = "flyer_{$company->id}_{$key}_{$hash}.jpg";
        $filePath = $dir . DIRECTORY_SEPARATOR . $fileName;

        if (file_exists($filePath) && (time() - filemtime($filePath) < 86400 * 7)) {
            return $filePath;
        }

        // Limpiar versiones anteriores de este mismo flyer
        foreach (glob($dir . DIRECTORY_SEPARATOR . "flyer_{$company->id}_{$key}_*.jpg") as $old) {
            @unlink($old);
        }

        // Cargar imagen de origen
        $gdImg = $this->loadImageFromAnySource($imageSrc);

        if (!$gdImg) {
            // Si falló la carga, caemos a la tarjeta automática
            return $this->getOrGenerateTemplateCard($company, $dir);
        }

        $srcW = imagesx($gdImg);
        $srcH = imagesy($gdImg);

        // Si la imagen tiene proporciones válidas, la guardamos directamente como JPEG de alta calidad
        // Si tiene transparencia PNG o WebP, creamos fondo blanco o la exportamos nítida
        $target = imagecreatetruecolor($srcW, $srcH);
        $white = imagecolorallocate($target, 255, 255, 255);
        imagefilledrectangle($target, 0, 0, $srcW, $srcH, $white);

        imagecopy($target, $gdImg, 0, 0, 0, 0, $srcW, $srcH);
        imagejpeg($target, $filePath, 92);

        imagedestroy($gdImg);
        imagedestroy($target);

        return $filePath;
    }

    /**
     * Genera la tarjeta con diseño oficial de LDR (Logo + Productos destacados).
     */
    protected function getOrGenerateTemplateCard(Company $company, string $dir): string
    {
        $latestProductUpdate = $company->products()->latest('updated_at')->value('updated_at');
        $hash = md5($company->id . '_' . $company->updated_at . '_' . $company->logo . '_' . $latestProductUpdate);
        $fileName = "company_{$company->id}_{$hash}.jpg";
        $filePath = $dir . DIRECTORY_SEPARATOR . $fileName;

        if (file_exists($filePath) && (time() - filemtime($filePath) < 86400 * 7)) {
            return $filePath;
        }

        foreach (glob($dir . DIRECTORY_SEPARATOR . "company_{$company->id}_*.jpg") as $oldFile) {
            @unlink($oldFile);
        }

        $this->generateCardImage($company, $filePath);

        return $filePath;
    }

    /**
     * Construye la imagen de 1200 x 630 px con PHP GD.
     */
    protected function generateCardImage(Company $company, string $outputPath): void
    {
        $width = 1200;
        $height = 630;

        $im = imagecreatetruecolor($width, $height);
        if (function_exists('imageantialias')) {
            @imageantialias($im, true);
        }

        // --- PALETA DE COLORES ---
        $cBgDark       = imagecolorallocate($im, 11, 19, 43);      // #0B132B
        $cCardBg       = imagecolorallocate($im, 24, 34, 64);      // #182240
        $cCardBorder   = imagecolorallocate($im, 45, 60, 100);
        $cWhite        = imagecolorallocate($im, 255, 255, 255);
        $cMuted        = imagecolorallocate($im, 148, 163, 184);   // Slate-400
        $cLightSlate   = imagecolorallocate($im, 203, 213, 225);   // Slate-300
        $cBlue         = imagecolorallocate($im, 37, 99, 235);     // Azul LDR
        $cSky          = imagecolorallocate($im, 56, 189, 248);    // Celeste
        $cOrange       = imagecolorallocate($im, 249, 115, 22);    // Naranja LDR
        $cGreen        = imagecolorallocate($im, 34, 197, 94);     // Verde
        $cBadgeBg      = imagecolorallocate($im, 16, 52, 90);

        imagefilledrectangle($im, 0, 0, $width, $height, $cBgDark);

        $glowBlue = imagecolorallocatealpha($im, 37, 99, 235, 110);
        imagefilledellipse($im, 1080, 110, 480, 480, $glowBlue);

        $glowOrange = imagecolorallocatealpha($im, 249, 115, 22, 118);
        imagefilledellipse($im, 120, 560, 380, 380, $glowOrange);

        $boldFont = resource_path('fonts/Roboto-Bold.ttf');
        $regularFont = resource_path('fonts/Roboto-Regular.ttf');
        $hasFonts = file_exists($boldFont) && file_exists($regularFont);

        // Header Superior
        if ($hasFonts) {
            imagettftext($im, 16, 0, 60, 48, $cWhite, $boldFont, 'LDR');
            imagettftext($im, 16, 0, 104, 48, $cOrange, $boldFont, '.');
            imagettftext($im, 10, 0, 116, 47, $cMuted, $boldFont, 'COMERCIAL');

            $this->drawRoundedRect($im, 920, 24, 1140, 56, 12, $cBadgeBg);
            imagettftext($im, 10, 0, 936, 45, $cSky, $boldFont, 'CATÁLOGO OFICIAL B2B');
        }

        $lineColor = imagecolorallocatealpha($im, 255, 255, 255, 115);
        imageline($im, 60, 75, 1140, 75, $lineColor);

        // Columna Izquierda: Logo y Datos
        $logoBoxSize = 130;
        $logoX = 60;
        $logoY = 110;

        $cWhiteBox = imagecolorallocate($im, 255, 255, 255);
        $this->drawRoundedRect($im, $logoX, $logoY, $logoX + $logoBoxSize, $logoY + $logoBoxSize, 20, $cWhiteBox);

        $logoLoaded = false;
        if (!empty($company->logo)) {
            $logoImg = $this->loadImageFromAnySource($company->logo);
            if ($logoImg) {
                $srcW = imagesx($logoImg);
                $srcH = imagesy($logoImg);
                $pad = 12;
                $destW = $logoBoxSize - ($pad * 2);
                $destH = $logoBoxSize - ($pad * 2);

                $ratio = min($destW / $srcW, $destH / $srcH);
                $finalW = (int)($srcW * $ratio);
                $finalH = (int)($srcH * $ratio);
                $destX = $logoX + $pad + (int)(($destW - $finalW) / 2);
                $destY = $logoY + $pad + (int)(($destH - $finalH) / 2);

                imagecopyresampled($im, $logoImg, $destX, $destY, 0, 0, $finalW, $finalH, $srcW, $srcH);
                imagedestroy($logoImg);
                $logoLoaded = true;
            }
        }

        if (!$logoLoaded) {
            $initial = mb_substr($company->name, 0, 1, 'UTF-8');
            if ($hasFonts) {
                imagettftext($im, 48, 0, $logoX + 42, $logoY + 90, $cBlue, $boldFont, $initial);
            }
        }

        if ($hasFonts) {
            $catName = mb_strtoupper($company->category->name ?? 'COMERCIAL', 'UTF-8');
            imagettftext($im, 10, 0, $logoX + $logoBoxSize + 22, $logoY + 35, $cSky, $boldFont, $catName);

            if ($company->is_verified) {
                imagettftext($im, 10, 0, $logoX + $logoBoxSize + 22, $logoY + 68, $cGreen, $boldFont, '✓ Verificada Oficial');
            }

            $cityText = '📍 ' . ($company->city ? $company->city . ', Bolivia' : 'Bolivia');
            imagettftext($im, 10, 0, $logoX + $logoBoxSize + 22, $logoY + 100, $cMuted, $regularFont, $cityText);

            $companyName = $company->name;
            $wrappedLines = $this->wrapText($companyName, $boldFont, 22, 420);
            $yName = 285;
            foreach (array_slice($wrappedLines, 0, 2) as $line) {
                imagettftext($im, 22, 0, 60, $yName, $cWhite, $boldFont, $line);
                $yName += 36;
            }

            $desc = strip_tags($company->short_description ?: $company->description ?: 'Catálogo de productos y cotizaciones directas sin intermediarios en Bolivia.');
            $descLines = $this->wrapText($desc, $regularFont, 11, 420);
            $yDesc = $yName + 15;
            foreach (array_slice($descLines, 0, 3) as $dLine) {
                imagettftext($im, 11, 0, 60, $yDesc, $cLightSlate, $regularFont, $dLine);
                $yDesc += 22;
            }

            $btnY = 485;
            $this->drawRoundedRect($im, 60, $btnY, 440, $btnY + 46, 12, $cBlue);
            imagettftext($im, 11, 0, 85, $btnY + 29, $cWhite, $boldFont, 'Ver Catálogo y Cotizar en Línea  →');
        }

        // Columna Derecha: Productos Destacados
        $products = $company->products()
            ->where('status', 'published')
            ->orderBy('is_featured', 'desc')
            ->latest('id')
            ->take(3)
            ->get();

        if ($hasFonts) {
            imagettftext($im, 11, 0, 520, 115, $cMuted, $boldFont, 'PRODUCTOS DESTACADOS DEL NEGOCIO');
        }

        if ($products->count() > 0) {
            $count = min($products->count(), 3);
            $totalWidth = 620;
            $cardGap = 16;
            $cardW = (int)(($totalWidth - (($count - 1) * $cardGap)) / $count);
            $cardH = 405;
            $cardY = 135;

            foreach ($products as $idx => $product) {
                $cardX = 520 + ($idx * ($cardW + $cardGap));

                $this->drawRoundedRect($im, $cardX, $cardY, $cardX + $cardW, $cardY + $cardH, 16, $cCardBg);

                $cOutline = imagecolorallocatealpha($im, 255, 255, 255, 118);
                $this->drawRoundedRectBorder($im, $cardX, $cardY, $cardX + $cardW, $cardY + $cardH, 16, $cOutline);

                $imgBoxSize = $cardW - 20;
                $imgBoxX = $cardX + 10;
                $imgBoxY = $cardY + 10;

                $this->drawRoundedRect($im, $imgBoxX, $imgBoxY, $imgBoxX + $imgBoxSize, $imgBoxY + $imgBoxSize, 12, $cWhite);

                $productImgLoaded = false;
                if (!empty($product->main_image)) {
                    $pImg = $this->loadImageFromAnySource($product->main_image);
                    if ($pImg) {
                        $pSrcW = imagesx($pImg);
                        $pSrcH = imagesy($pImg);
                        $pPad = 6;
                        $pDestW = $imgBoxSize - ($pPad * 2);
                        $pDestH = $imgBoxSize - ($pPad * 2);

                        $pRatio = min($pDestW / $pSrcW, $pDestH / $pSrcH);
                        $pFinalW = (int)($pSrcW * $pRatio);
                        $pFinalH = (int)($pSrcH * $pRatio);
                        $pDestX = $imgBoxX + $pPad + (int)(($pDestW - $pFinalW) / 2);
                        $pDestY = $imgBoxY + $pPad + (int)(($pDestH - $pFinalH) / 2);

                        imagecopyresampled($im, $pImg, $pDestX, $pDestY, 0, 0, $finalW ?? $pFinalW, $pFinalH, $pSrcW, $pSrcH);
                        imagedestroy($pImg);
                        $productImgLoaded = true;
                    }
                }

                if (!$productImgLoaded && $hasFonts) {
                    imagettftext($im, 24, 0, $imgBoxX + ($imgBoxSize / 2) - 15, $imgBoxY + ($imgBoxSize / 2) + 10, $cMuted, $boldFont, '📦');
                }

                if ($hasFonts) {
                    $pNameLines = $this->wrapText($product->name, $boldFont, 10, $cardW - 24);
                    $yPName = $imgBoxY + $imgBoxSize + 26;
                    foreach (array_slice($pNameLines, 0, 2) as $pnLine) {
                        imagettftext($im, 10, 0, $cardX + 12, $yPName, $cWhite, $boldFont, $pnLine);
                        $yPName += 18;
                    }

                    $currency = $product->currency ?: 'Bs.';
                    $priceText = $currency . ' ' . number_format($product->price, 2);
                    imagettftext($im, 13, 0, $cardX + 12, $cardY + $cardH - 35, $cGreen, $boldFont, $priceText);

                    $tagText = $product->wholesale_price ? 'Precio Mayorista y Minorista' : 'Disponible en Catálogo';
                    imagettftext($im, 8, 0, $cardX + 12, $cardY + $cardH - 15, $cMuted, $regularFont, $tagText);
                }
            }
        } else {
            $panelX = 520;
            $panelY = 135;
            $panelW = 620;
            $panelH = 405;

            $this->drawRoundedRect($im, $panelX, $panelY, $panelX + $panelW, $panelY + $panelH, 20, $cCardBg);

            if ($hasFonts) {
                imagettftext($im, 20, 0, $panelX + 40, $panelY + 120, $cWhite, $boldFont, 'Catálogo Digital Oficial');
                imagettftext($im, 13, 0, $panelX + 40, $panelY + 170, $cSky, $boldFont, '✓ Contacto directo con el fabricante o proveedor');
                imagettftext($im, 13, 0, $panelX + 40, $panelY + 215, $cLightSlate, $regularFont, '• Solicita cotizaciones personalizadas en tiempo real');
                imagettftext($im, 13, 0, $panelX + 40, $panelY + 255, $cLightSlate, $regularFont, '• Consulta listas de precios mayoristas por WhatsApp');
                imagettftext($im, 13, 0, $panelX + 40, $panelY + 295, $cLightSlate, $regularFont, '• Ubicación verificada en ' . ($company->city ?: 'Bolivia'));

                $this->drawRoundedRect($im, $panelX + 40, $panelY + 330, $panelX + 380, $panelY + 375, 12, $cOrange);
                imagettftext($im, 11, 0, $panelX + 60, $panelY + 358, $cWhite, $boldFont, 'Abrir Perfil de la Empresa →');
            }
        }

        // Footer Inferior
        $cFooterBg = imagecolorallocate($im, 6, 11, 25);
        imagefilledrectangle($im, 0, 575, $width, $height, $cFooterBg);

        imagefilledrectangle($im, 0, 575, 400, 578, $cOrange);
        imagefilledrectangle($im, 400, 575, $width, 578, $cBlue);

        if ($hasFonts) {
            imagettftext($im, 10, 0, 60, 608, $cMuted, $regularFont, 'LDR Comercial • La plataforma de catálogos y empresas de Bolivia');
            
            $urlText = config('app.url', 'https://ldrcomercial.com') . '/empresas/' . $company->id;
            imagettftext($im, 10, 0, 800, 608, $cSky, $boldFont, $urlText);
        }

        imagejpeg($im, $outputPath, 88);
        imagedestroy($im);
    }

    /**
     * Carga una imagen en GD desde una ruta local o URL externa.
     */
    protected function loadImageFromAnySource(string $pathOrUrl)
    {
        try {
            $binary = null;
            if (str_starts_with($pathOrUrl, 'http://') || str_starts_with($pathOrUrl, 'https://')) {
                $context = stream_context_create([
                    'http' => ['timeout' => 3, 'user_agent' => 'LDRComercial-CardGen/1.0'],
                    'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false]
                ]);
                $binary = @file_get_contents($pathOrUrl, false, $context);
            } else {
                $cleanPath = ltrim(preg_replace('/^\/?storage\//', '', $pathOrUrl), '/');
                $storagePath = storage_path('app/public/' . $cleanPath);
                if (file_exists($storagePath)) {
                    $binary = @file_get_contents($storagePath);
                } else {
                    $publicPath = public_path(ltrim($pathOrUrl, '/'));
                    if (file_exists($publicPath)) {
                        $binary = @file_get_contents($publicPath);
                    }
                }
            }

            if ($binary) {
                return @imagecreatefromstring($binary);
            }
        } catch (\Throwable $e) {
            // Silenciar fallos
        }

        return null;
    }

    protected function drawRoundedRect($im, int $x1, int $y1, int $x2, int $y2, int $radius, $color): void
    {
        imagefilledrectangle($im, $x1 + $radius, $y1, $x2 - $radius, $y2, $color);
        imagefilledrectangle($im, $x1, $y1 + $radius, $x2, $y2 - $radius, $color);

        imagefilledellipse($im, $x1 + $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
        imagefilledellipse($im, $x2 - $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
        imagefilledellipse($im, $x1 + $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
        imagefilledellipse($im, $x2 - $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
    }

    protected function drawRoundedRectBorder($im, int $x1, int $y1, int $x2, int $y2, int $radius, $color): void
    {
        imageline($im, $x1 + $radius, $y1, $x2 - $radius, $y1, $color);
        imageline($im, $x1 + $radius, $y2, $x2 - $radius, $y2, $color);
        imageline($im, $x1, $y1 + $radius, $x1, $y2 - $radius, $color);
        imageline($im, $x2, $y1 + $radius, $x2, $y2 - $radius, $color);

        imagearc($im, $x1 + $radius, $y1 + $radius, $radius * 2, $radius * 2, 180, 270, $color);
        imagearc($im, $x2 - $radius, $y1 + $radius, $radius * 2, $radius * 2, 270, 360, $color);
        imagearc($im, $x2 - $radius, $y2 - $radius, $radius * 2, $radius * 2, 0, 90, $color);
        imagearc($im, $x1 + $radius, $y2 - $radius, $radius * 2, $radius * 2, 90, 180, $color);
    }

    protected function wrapText(string $text, string $font, int $size, int $maxWidth): array
    {
        $words = explode(' ', $text);
        $lines = [];
        $currentLine = '';

        foreach ($words as $word) {
            $testLine = $currentLine === '' ? $word : $currentLine . ' ' . $word;
            $box = imagettfbbox($size, 0, $font, $testLine);
            $lineWidth = abs($box[4] - $box[0]);

            if ($lineWidth > $maxWidth && $currentLine !== '') {
                $lines[] = $currentLine;
                $currentLine = $word;
            } else {
                $currentLine = $testLine;
            }
        }

        if ($currentLine !== '') {
            $lines[] = $currentLine;
        }

        return $lines;
    }
}
