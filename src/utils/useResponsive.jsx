import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  PUNTOS_QUIEBRE,
  CONSULTAS_MEDIA,
  Z_INDEX,
  obtenerTipoDispositivo,
  esXs, esSm, esMd, esLg, esXl, es2xl,
  esMovil, esTablet, esEscritorio,
  obtenerDimension,
  obtenerEspaciado,
  obtenerTipografia,
  crearMediaQuery,
  // Compatibilidad con versión anterior
  esMovilPequeno,
  esDispositivoMovil,
  esDispositivoTablet,
  esDispositivoEscritorio,
  obtenerAlturaNavbar,
  obtenerAnchoSidebar
} from './responsive.config.jsx';

/**
 * Hook principal para manejo responsive - VERSIÓN MEJORADA
 * Sistema completo de detección de dispositivos con optimizaciones avanzadas
 * Incluye caché, debouncing inteligente y compatibilidad SSR
 */
export const useResponsive = (opciones = {}) => {
  const {
    debounceMs = 100,
    enableCache = true,
    ssrFallback = { ancho: 1280, alto: 800 },
    trackOrientation = true,
    trackPixelRatio = true
  } = opciones;

  // Estados principales con valores SSR-friendly
  const [dimensiones, setDimensiones] = useState(() => {
    if (typeof window === 'undefined') return ssrFallback;
    return {
      ancho: window.innerWidth,
      alto: window.innerHeight
    };
  });

  const [orientacion, setOrientacion] = useState(() => {
    if (typeof window === 'undefined') return 'landscape';
    if (!trackOrientation) return null;
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  const [pixelRatio, setPixelRatio] = useState(() => {
    if (typeof window === 'undefined') return 1;
    if (!trackPixelRatio) return 1;
    return window.devicePixelRatio || 1;
  });

  // Referencias para optimización
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const ultimasDimensionesRef = useRef(dimensiones);
  const cacheRef = useRef(new Map());

  // Función de actualización optimizada con caché opcional
  const actualizarDimensiones = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const nuevasDimensiones = {
      ancho: window.innerWidth,
      alto: window.innerHeight
    };
    
    // Registrar cambios de un píxel para respetar los cortes de las media queries.
    const { ancho: anchoAnterior, alto: altoAnterior } = ultimasDimensionesRef.current;
    
    if (nuevasDimensiones.ancho === anchoAnterior &&
        nuevasDimensiones.alto === altoAnterior) {
      return;
    }
    
    ultimasDimensionesRef.current = nuevasDimensiones;
    setDimensiones(nuevasDimensiones);
    
    // Actualizar orientación si está habilitado el tracking
    if (trackOrientation) {
      const nuevaOrientacion = nuevasDimensiones.alto > nuevasDimensiones.ancho ? 'portrait' : 'landscape';
      setOrientacion(prev => prev !== nuevaOrientacion ? nuevaOrientacion : prev);
    }
    
    // Actualizar pixel ratio si está habilitado el tracking
    if (trackPixelRatio) {
      const nuevoPixelRatio = window.devicePixelRatio || 1;
      setPixelRatio(prev => prev !== nuevoPixelRatio ? nuevoPixelRatio : prev);
    }
    
    // Limpiar caché si hay cambios significativos
    if (enableCache && cacheRef.current.size > 50) {
      cacheRef.current.clear();
    }
  }, [trackOrientation, trackPixelRatio, enableCache]);

  // Debounced resize handler con RequestAnimationFrame
  const manejarResize = useCallback(() => {
    // Cancelar operaciones pendientes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    // Usar RAF para sincronización con el navegador
    rafRef.current = requestAnimationFrame(() => {
      timeoutRef.current = setTimeout(actualizarDimensiones, debounceMs);
    });
  }, [actualizarDimensiones, debounceMs]);

  // Configurar event listeners con cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Llamada inicial
    actualizarDimensiones();
    
    // Event listeners optimizados
    const opciones = { passive: true };
    window.addEventListener('resize', manejarResize, opciones);
    window.addEventListener('orientationchange', manejarResize, opciones);
    
    // Listener para cambios en pixel ratio (monitors externos, zoom, etc.)
    if (trackPixelRatio && 'matchMedia' in window) {
      const mediaQuery = window.matchMedia('(min-resolution: 1dppx)');
      const handlePixelRatioChange = () => {
        setPixelRatio(window.devicePixelRatio || 1);
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handlePixelRatioChange);
      } else {
        mediaQuery.addListener(handlePixelRatioChange);
      }
      
      return () => {
        window.removeEventListener('resize', manejarResize);
        window.removeEventListener('orientationchange', manejarResize);
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handlePixelRatioChange);
        } else {
          mediaQuery.removeListener(handlePixelRatioChange);
        }
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    return () => {
      window.removeEventListener('resize', manejarResize);
      window.removeEventListener('orientationchange', manejarResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [manejarResize, actualizarDimensiones, trackPixelRatio]);

  // Valores calculados con memoización
  const valoresCalculados = useMemo(() => {
    const { ancho, alto } = dimensiones;
    const tipoDispositivo = obtenerTipoDispositivo(ancho);
    
    // Generar clave de caché
    const cacheKey = `${ancho}_${alto}_${orientacion}_${pixelRatio}`;
    if (enableCache && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }
    
    const resultado = {
      // Dimensiones básicas
      ancho,
      alto,
      orientacion,
      pixelRatio,
      
      // Tipo y categoría
      tipoDispositivo,
      categoria: esMovil(ancho) ? 'movil' : esTablet(ancho) ? 'tablet' : 'escritorio',
      
      // Detección individual de tamaños
      esXs: esXs(ancho),
      esSm: esSm(ancho), 
      esMd: esMd(ancho),
      esLg: esLg(ancho),
      esXl: esXl(ancho),
      es2xl: es2xl(ancho),
      
      // Detección por categorías principales
      esMovil: esMovil(ancho),
      esTablet: esTablet(ancho), 
      esEscritorio: esEscritorio(ancho),
      
      // Compatibilidad con versión anterior
      esMovilPequeno: esMovilPequeno(ancho),
      esDispositivoMovil: esDispositivoMovil(ancho),
      esDispositivoTablet: esDispositivoTablet(ancho),
      esDispositivoEscritorio: esDispositivoEscritorio(ancho),
      
      // Orientación
      esPortrait: orientacion === 'portrait',
      esLandscape: orientacion === 'landscape',
      
      // Características de pantalla
      esRetina: pixelRatio > 1,
      esHD: pixelRatio >= 1.5,
      es4K: pixelRatio >= 2,
      
      // Consultas útiles
      esSmUp: ancho >= PUNTOS_QUIEBRE.sm,
      esMdUp: ancho >= PUNTOS_QUIEBRE.md,
      esLgUp: ancho >= PUNTOS_QUIEBRE.lg,
      esXlUp: ancho >= PUNTOS_QUIEBRE.xl,
      
      esSmDown: ancho < PUNTOS_QUIEBRE.md,
      esMdDown: ancho < PUNTOS_QUIEBRE.lg,
      esLgDown: ancho < PUNTOS_QUIEBRE.xl,
      
      // Características específicas
      esPantallaEstrecha: ancho < 1200,
      esPantallaAncha: ancho >= 1440,
      esPantallaCorta: alto < 600,
      esPantallaAlta: alto >= 900,
      
      // Ratio de aspecto
      ratioAspecto: alto > 0 ? ancho / alto : 1,
      esCuadrada: Math.abs((ancho / alto) - 1) < 0.1,
      esPanoramica: (ancho / alto) > 1.5,
      
      // Dimensiones de componentes
      alturaNavbar: obtenerAlturaNavbar(ancho),
      anchoSidebarExpandido: obtenerAnchoSidebar(ancho, false),
      anchoSidebarColapsado: obtenerAnchoSidebar(ancho, true),
      
      // Funciones de utilidad
      obtenerDimension: (categoria, elemento) => obtenerDimension(categoria, elemento, ancho),
      obtenerEspaciado: (tamaño) => obtenerEspaciado(ancho, tamaño),
      obtenerTipografia: (tamaño) => obtenerTipografia(ancho, tamaño),
      
      // Decisiones de UI
      deberiaColapsarSidebar: () => {
        if (esMovil(ancho)) return true;
        if (esTablet(ancho)) return ancho < 900;
        return false;
      },
      
      deberiaOcultarSidebar: () => esMovil(ancho),
      
      deberiaUsarNavbarFija: () => esMovil(ancho) || esTablet(ancho),
      
      tieneEspacioParaSidebar: () => ancho >= 1200,
      
      // Clases CSS útiles
      obtenerClasesCSS: () => {
        const clases = ['responsive', `tipo-${tipoDispositivo}`];
        
        if (esMovil(ancho)) clases.push('es-movil');
        if (esTablet(ancho)) clases.push('es-tablet'); 
        if (esEscritorio(ancho)) clases.push('es-escritorio');
        
        if (orientacion) clases.push(`orientacion-${orientacion}`);
        if (pixelRatio > 1) clases.push('es-retina');
        
        return clases.join(' ');
      }
    };
    
    // Guardar en caché
    if (enableCache) {
      cacheRef.current.set(cacheKey, resultado);
    }
    
    return resultado;
  }, [dimensiones, orientacion, pixelRatio, enableCache]);

  return valoresCalculados;
};

/**
 * Hook para detectar media queries específicas con optimizaciones
 * Incluye manejo de errores y compatibilidad con navegadores antiguos
 */
export const useMediaQuery = (query, opciones = {}) => {
  const { 
    defaultValue = false,
    ssrValue = null 
  } = opciones;

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return ssrValue !== null ? ssrValue : defaultValue;
    }
    
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.warn(`Error en media query "${query}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mediaQueryList;
    
    try {
      mediaQueryList = window.matchMedia(query);
    } catch (error) {
      console.warn(`Error creando media query "${query}":`, error);
      return;
    }

    const handleChange = (event) => setMatches(event.matches);

    // Establecer valor inicial
    setMatches(mediaQueryList.matches);

    // Compatibilidad con navegadores antiguos
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, defaultValue]);

  return matches;
};

/**
 * Hook para múltiples media queries con un solo listener
 */
export const useMultipleMediaQueries = (queries, opciones = {}) => {
  const { defaultValues = {}, ssrValues = {} } = opciones;
  
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return Object.keys(queries).reduce((acc, key) => {
        acc[key] = ssrValues[key] !== undefined ? ssrValues[key] : 
                   defaultValues[key] !== undefined ? defaultValues[key] : false;
        return acc;
      }, {});
    }
    
    return Object.entries(queries).reduce((acc, [key, query]) => {
      try {
        acc[key] = window.matchMedia(query).matches;
      } catch (error) {
        console.warn(`Error en media query "${key}":`, error);
        acc[key] = defaultValues[key] || false;
      }
      return acc;
    }, {});
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryLists = {};
    const handlers = {};
    const cleanup = [];

    // Configurar listeners para cada query
    Object.entries(queries).forEach(([key, query]) => {
      try {
        const mql = window.matchMedia(query);
        mediaQueryLists[key] = mql;
        
        handlers[key] = (event) => {
          setMatches(prev => ({
            ...prev,
            [key]: event.matches
          }));
        };

        // Establecer valor inicial
        setMatches(prev => ({
          ...prev,
          [key]: mql.matches
        }));

        // Agregar listener
        if (mql.addEventListener) {
          mql.addEventListener('change', handlers[key]);
          cleanup.push(() => mql.removeEventListener('change', handlers[key]));
        } else {
          mql.addListener(handlers[key]);
          cleanup.push(() => mql.removeListener(handlers[key]));
        }
      } catch (error) {
        console.warn(`Error configurando media query "${key}":`, error);
      }
    });

    return () => {
      cleanup.forEach(fn => fn());
    };
  }, [queries, defaultValues]);

  return matches;
};

/**
 * Hook para obtener el breakpoint actual como string
 */
export const useBreakpoint = () => {
  const { tipoDispositivo } = useResponsive();
  return tipoDispositivo;
};

/**
 * Hook para detectar dispositivos táctiles
 */
export const useTouchDevice = () => {
  return useMediaQuery(CONSULTAS_MEDIA.noHover);
};

/**
 * Hook para detectar preferencias del sistema
 */
export const useSystemPreferences = () => {
  const queries = {
    darkMode: CONSULTAS_MEDIA.darkMode,
    reducedMotion: CONSULTAS_MEDIA.reducedMotion,
    touchDevice: CONSULTAS_MEDIA.noHover
  };

  return useMultipleMediaQueries(queries, {
    defaultValues: {
      darkMode: false,
      reducedMotion: false,
      touchDevice: false
    }
  });
};

/**
 * Hook para obtener configuración recomendada basada en el dispositivo
 */
export const useDeviceConfig = () => {
  const responsive = useResponsive();
  const preferences = useSystemPreferences();
  
  return useMemo(() => ({
    // Configuración de animaciones
    animaciones: {
      habilitadas: !preferences.reducedMotion,
      duracion: preferences.reducedMotion ? 0 : responsive.esMovil ? 200 : 300,
      suaves: preferences.reducedMotion || responsive.esMovil
    },
    
    // Configuración de interacción
    interaccion: {
      tiempoHover: preferences.touchDevice ? 0 : 200,
      tamanoToque: preferences.touchDevice ? 'grande' : 'normal',
      modoTactil: preferences.touchDevice
    },
    
    // Configuración de espaciado
    espaciado: {
      extra: responsive.esMovil,
      compacto: responsive.esXs,
      amplio: responsive.esEscritorio && !responsive.esPantallaEstrecha
    },
    
    // Configuración de tipografía
    tipografia: {
      escalaAmpliada: responsive.esEscritorio && responsive.esPantallaAncha,
      escalaReducida: responsive.esXs,
      lineHeightExtra: responsive.esMovil
    },
    
    // Configuración de layout
    layout: {
      sidebar: {
        debeMostrar: responsive.tieneEspacioParaSidebar(),
        debeColapsar: responsive.deberiaColapsarSidebar(),
        modo: responsive.esMovil ? 'overlay' : 'push'
      },
      navbar: {
        fija: responsive.deberiaUsarNavbarFija(),
        altura: responsive.alturaNavbar
      },
      contenido: {
        maxAncho: responsive.esPantallaAncha ? '1400px' : '1200px',
        padding: responsive.obtenerEspaciado('lg')
      }
    }
  }), [responsive, preferences]);
};

/**
 * Hook para crear media queries dinámicamente
 */
export const useDynamicMediaQuery = (config) => {
  const query = useMemo(() => {
    const { minWidth, maxWidth, orientation, features = {} } = config;
    return crearMediaQuery(minWidth, maxWidth, orientation, features);
  }, [config]);
  
  return useMediaQuery(query);
};

/**
 * Hook para obtener información de viewport extendida
 */
export const useViewport = () => {
  const responsive = useResponsive();
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId = null;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  
  return {
    ...responsive,
    scrollY,
    isScrolling,
    isScrolledPastNavbar: scrollY > parseInt(responsive.alturaNavbar),
    scrollProgress: Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)
  };
};

/**
 * Hook para debugging responsive (solo desarrollo)
 */
export const useResponsiveDebug = (enabled = false) => {
  const responsive = useResponsive();
  
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    const info = {
      ancho: responsive.ancho,
      tipo: responsive.tipoDispositivo,
      categoria: responsive.categoria,
      orientacion: responsive.orientacion
    };
    
    console.log('🔧 Responsive Debug:', info);
  }, [responsive, enabled]);
  
  return responsive;
};

// Exports para compatibilidad
export { 
  CONSULTAS_MEDIA, 
  Z_INDEX,
  // Hooks con nombres en español
  useMediaQuery as useConsultaMedia,
  useBreakpoint as usePuntoQuiebre,
  useTouchDevice as useDispositivoTactil,
  useSystemPreferences as useModoOscuroSistema
};

// Export principal
export default useResponsive;
