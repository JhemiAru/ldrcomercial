import React, { useState, useEffect, useRef } from 'react';

/**
 * Función auxiliar para extraer latitud y longitud desde texto o URL de Google Maps
 */
export function extractCoordinatesFromInput(input) {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();

    // 1. Coordenadas directas: "-16.50025, -68.15082" o "-16.50025,-68.15082"
    const directMatch = trimmed.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
    if (directMatch) {
        const lat = parseFloat(directMatch[1]);
        const lng = parseFloat(directMatch[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
        }
    }

    // 2. URL de Google Maps con @lat,lng
    const atMatch = trimmed.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (atMatch) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // 3. Parámetros de consulta ?q=lat,lng o &ll=lat,lng
    const queryMatch = trimmed.match(/[?&](?:q|query|ll|center|sll)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (queryMatch) {
        return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
    }

    return null;
}

export default function LocationPicker({
    googleMapsLink = '',
    latitude = '',
    longitude = '',
    city = 'La Paz',
    onChange,
    errors = {},
}) {
    const mapContainerRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markerRef = useRef(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState('');
    const [detectedNotice, setDetectedNotice] = useState('');
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Coordenadas iniciales por defecto (La Paz, Bolivia)
    const defaultLat = -16.5000;
    const defaultLng = -68.1500;

    const currentLat = parseFloat(latitude) || (googleMapsLink ? extractCoordinatesFromInput(googleMapsLink)?.lat : null) || defaultLat;
    const currentLng = parseFloat(longitude) || (googleMapsLink ? extractCoordinatesFromInput(googleMapsLink)?.lng : null) || defaultLng;

    // Cargar biblioteca Leaflet dinámicamente desde CDN si no existe
    useEffect(() => {
        let isMounted = true;

        const loadLeaflet = () => {
            if (window.L) {
                if (isMounted) setIsMapLoaded(true);
                return;
            }

            // Inyectar CSS
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Inyectar JS
            if (!document.getElementById('leaflet-js')) {
                const script = document.createElement('script');
                script.id = 'leaflet-js';
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                script.onload = () => {
                    if (isMounted) setIsMapLoaded(true);
                };
                document.body.appendChild(script);
            } else {
                const existingScript = document.getElementById('leaflet-js');
                existingScript.addEventListener('load', () => {
                    if (isMounted) setIsMapLoaded(true);
                });
            }
        };

        loadLeaflet();

        return () => {
            isMounted = false;
        };
    }, []);

    // Inicializar o actualizar mapa de Leaflet
    useEffect(() => {
        if (!isMapLoaded || !mapContainerRef.current || !window.L) return;

        if (!leafletMapRef.current) {
            const map = window.L.map(mapContainerRef.current, {
                center: [currentLat, currentLng],
                zoom: 15,
                scrollWheelZoom: false,
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            const marker = window.L.marker([currentLat, currentLng], {
                draggable: true,
            }).addTo(map);

            marker.on('dragend', (e) => {
                const position = e.target.getLatLng();
                updateCoordinates(position.lat, position.lng, true);
            });

            map.on('click', (e) => {
                marker.setLatLng(e.latlng);
                updateCoordinates(e.latlng.lat, e.latlng.lng, true);
            });

            leafletMapRef.current = map;
            markerRef.current = marker;
        } else {
            // Si el mapa ya existe y cambiaron coordenadas
            if (markerRef.current) {
                markerRef.current.setLatLng([currentLat, currentLng]);
            }
        }
    }, [isMapLoaded]);

    const updateCoordinates = (lat, lng, syncUrl = false) => {
        const roundedLat = parseFloat(lat.toFixed(7));
        const roundedLng = parseFloat(lng.toFixed(7));

        const updates = {
            latitude: roundedLat,
            longitude: roundedLng,
        };

        if (syncUrl && !googleMapsLink) {
            updates.google_maps_link = `https://www.google.com/maps?q=${roundedLat},${roundedLng}`;
        }

        if (onChange) {
            onChange(updates);
        }

        if (markerRef.current) {
            markerRef.current.setLatLng([roundedLat, roundedLng]);
        }
        if (leafletMapRef.current) {
            leafletMapRef.current.panTo([roundedLat, roundedLng]);
        }

        setDetectedNotice(`Coordenadas fijadas: ${roundedLat}, ${roundedLng}`);
    };

    // Manejar cambio en el enlace de Google Maps
    const handleGoogleMapsLinkChange = (e) => {
        const url = e.target.value;
        const extracted = extractCoordinatesFromInput(url);

        const updates = {
            google_maps_link: url,
        };

        if (extracted) {
            updates.latitude = parseFloat(extracted.lat.toFixed(7));
            updates.longitude = parseFloat(extracted.lng.toFixed(7));
            setDetectedNotice(`¡Coordenadas detectadas automáticamente del enlace!`);

            if (markerRef.current && leafletMapRef.current) {
                markerRef.current.setLatLng([extracted.lat, extracted.lng]);
                leafletMapRef.current.flyTo([extracted.lat, extracted.lng], 16);
            }
        } else {
            setDetectedNotice('');
        }

        if (onChange) {
            onChange(updates);
        }
    };

    // Manejar GPS del dispositivo
    const handleGetGpsLocation = () => {
        if (!navigator.geolocation) {
            setGpsError('Tu navegador no soporta geolocalización.');
            return;
        }

        setGpsLoading(true);
        setGpsError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGpsLoading(false);
                const { latitude: lat, longitude: lng } = position.coords;
                updateCoordinates(lat, lng, true);
                setDetectedNotice('¡Ubicación GPS actual capturada con éxito!');
            },
            (err) => {
                setGpsLoading(false);
                let message = 'No se pudo obtener la ubicación GPS.';
                if (err.code === 1) message = 'Permiso de ubicación denegado por el navegador.';
                else if (err.code === 2) message = 'Posición no disponible.';
                else if (err.code === 3) message = 'Tiempo de espera agotado al buscar GPS.';
                setGpsError(message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="space-y-4">
            {/* Campo de Enlace de Google Maps */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Enlace o Ubicación de Google Maps
                    </label>
                    {googleMapsLink && (
                        <a
                            href={googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <span>🗺️ Probar Enlace</span>
                        </a>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                        📍
                    </div>
                    <input
                        type="url"
                        value={googleMapsLink || ''}
                        onChange={handleGoogleMapsLinkChange}
                        placeholder="Ej. https://maps.app.goo.gl/... o https://www.google.com/maps?q=-16.5002,-68.1508"
                        className="pl-9 w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                </div>
                {errors.google_maps_link && (
                    <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.google_maps_link}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                    Puedes pegar el enlace que compartes por WhatsApp desde Google Maps, o presionar el botón GPS para ubicar tu negocio.
                </p>
            </div>

            {/* Fila de Coordenadas + Botón GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Latitud GPS (App Móvil)
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={latitude ?? ''}
                        onChange={(e) => {
                            const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                            onChange && onChange({ latitude: val });
                            if (markerRef.current && val !== '' && !isNaN(val)) {
                                markerRef.current.setLatLng([val, currentLng]);
                            }
                        }}
                        placeholder="-16.5000000"
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] text-slate-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Longitud GPS (App Móvil)
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={longitude ?? ''}
                        onChange={(e) => {
                            const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                            onChange && onChange({ longitude: val });
                            if (markerRef.current && val !== '' && !isNaN(val)) {
                                markerRef.current.setLatLng([currentLat, val]);
                            }
                        }}
                        placeholder="-68.1500000"
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b132b] text-slate-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-4">
                    <button
                        type="button"
                        onClick={handleGetGpsLocation}
                        disabled={gpsLoading}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                    >
                        {gpsLoading ? (
                            <>
                                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                <span>Buscando GPS...</span>
                            </>
                        ) : (
                            <>
                                <span>🎯</span>
                                <span>Mi GPS Actual</span>
                            </>
                        )}
                    </button>
                </div>

                {gpsError && (
                    <div className="sm:col-span-12 text-[11px] text-red-500 font-medium">
                        ⚠️ {gpsError}
                    </div>
                )}

                {detectedNotice && (
                    <div className="sm:col-span-12 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span>✓</span>
                        <span>{detectedNotice}</span>
                    </div>
                )}
            </div>

            {/* Mapa Interactivo con Leaflet / OpenStreetMap */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner bg-slate-100 dark:bg-slate-900">
                <div className="bg-slate-200/70 dark:bg-white/10 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold flex items-center gap-1">
                        <span>🗺️</span>
                        <span>Ajuste fino en mapa (Arrastra el marcador a tu tienda)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        OpenStreetMap &bull; 100% Gratuito
                    </span>
                </div>
                <div
                    ref={mapContainerRef}
                    style={{ height: '220px', width: '100%', zIndex: 1 }}
                />
            </div>
        </div>
    );
}
