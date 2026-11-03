<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageOptimizer
{
    /**
     * Optimiza y convierte cualquier imagen a formato WebP moderno,
     * redimensionándola a un tamaño máximo respetando el ratio original.
     *
     * @param UploadedFile $file
     * @param string $directory Carpeta dentro del disco público (ej. 'companies', 'products', 'companies/banners')
     * @param int $maxWidth Ancho máximo en píxeles (default 1400)
     * @param int $maxHeight Alto máximo en píxeles (default 1400)
     * @param int $quality Calidad de compresión WebP (1-100, default 82)
     * @return string Ruta relativa pública (ej. '/storage/products/abc123xyz.webp')
     */
    public static function storeAsWebp(
        UploadedFile $file,
        string $directory = 'uploads',
        int $maxWidth = 1400,
        int $maxHeight = 1400,
        int $quality = 82
    ): string {
        // Si es SVG u otro formato vectorial, guardamos directamente sin GD
        $extension = strtolower($file->getClientOriginalExtension());
        if ($extension === 'svg') {
            $path = $file->store($directory, 'public');
            return '/storage/' . $path;
        }

        // Si GD no está disponible o no soporta WebP, fallback estándar
        if (!function_exists('imagecreatefromstring') || !function_exists('imagewebp')) {
            $path = $file->store($directory, 'public');
            return '/storage/' . $path;
        }

        try {
            $binaryData = @file_get_contents($file->getRealPath());
            if ($binaryData === false) {
                $path = $file->store($directory, 'public');
                return '/storage/' . $path;
            }

            $sourceImage = @imagecreatefromstring($binaryData);
            if (!$sourceImage) {
                $path = $file->store($directory, 'public');
                return '/storage/' . $path;
            }

            // Manejar orientación EXIF si es JPEG tomado de teléfono
            if (function_exists('exif_read_data') && in_array($extension, ['jpg', 'jpeg'])) {
                try {
                    $exif = @exif_read_data($file->getRealPath());
                    if (!empty($exif['Orientation'])) {
                        switch ($exif['Orientation']) {
                            case 3:
                                $sourceImage = imagerotate($sourceImage, 180, 0);
                                break;
                            case 6:
                                $sourceImage = imagerotate($sourceImage, -90, 0);
                                break;
                            case 8:
                                $sourceImage = imagerotate($sourceImage, 90, 0);
                                break;
                        }
                    }
                } catch (\Throwable $e) {
                    // Ignorar errores de EXIF
                }
            }

            $origWidth = imagesx($sourceImage);
            $origHeight = imagesy($sourceImage);

            // Calcular nuevas dimensiones respetando relación de aspecto
            $newWidth = $origWidth;
            $newHeight = $origHeight;

            if ($origWidth > $maxWidth || $origHeight > $maxHeight) {
                $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight);
                $newWidth = max(1, (int) round($origWidth * $ratio));
                $newHeight = max(1, (int) round($origHeight * $ratio));
            }

            // Crear lienzo de destino con soporte de canal alfa transparente
            $targetImage = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($targetImage, false);
            imagesavealpha($targetImage, true);
            $transparent = imagecolorallocatealpha($targetImage, 255, 255, 255, 127);
            imagefilledrectangle($targetImage, 0, 0, $newWidth, $newHeight, $transparent);

            // Remuestrear / redimensionar con alta fidelidad
            imagecopyresampled(
                $targetImage,
                $sourceImage,
                0, 0, 0, 0,
                $newWidth,
                $newHeight,
                $origWidth,
                $origHeight
            );

            // Generar nombre único para el archivo WebP
            $filename = Str::random(30) . '.webp';
            $relativeDir = trim($directory, '/');
            $fullStorageDir = storage_path('app/public/' . $relativeDir);

            if (!is_dir($fullStorageDir)) {
                @mkdir($fullStorageDir, 0755, true);
            }

            $destinationFilePath = $fullStorageDir . DIRECTORY_SEPARATOR . $filename;

            // Guardar en WebP
            $saved = @imagewebp($targetImage, $destinationFilePath, $quality);

            // Liberar memoria de GD
            if (is_resource($sourceImage) || (is_object($sourceImage) && $sourceImage instanceof \GdImage)) {
                @imagedestroy($sourceImage);
            }
            if (is_resource($targetImage) || (is_object($targetImage) && $targetImage instanceof \GdImage)) {
                @imagedestroy($targetImage);
            }

            if ($saved && file_exists($destinationFilePath)) {
                return '/storage/' . ($relativeDir ? $relativeDir . '/' : '') . $filename;
            }

            // Fallback en caso de fallo al escribir
            $path = $file->store($directory, 'public');
            return '/storage/' . $path;
        } catch (\Throwable $e) {
            // Fallback seguro a almacenamiento estándar si algo falla
            $path = $file->store($directory, 'public');
            return '/storage/' . $path;
        }
    }
}

