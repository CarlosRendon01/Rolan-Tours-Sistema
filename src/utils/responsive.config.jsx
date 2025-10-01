/**
 * CONFIGURACIÓN DE DISEÑO RESPONSIVE - VERSIÓN MEJORADA
 * Sistema completo de puntos de quiebre y configuraciones para media queries
 * Optimizado para rendimiento y flexibilidad máxima
 * Todo en español para evitar confusiones
 */

// Puntos de quiebre optimizados basados en dispositivos reales comunes
export const PUNTOS_QUIEBRE = {
  xs: 320,              // iPhone SE y dispositivos muy pequeños
  sm: 480,              // Móviles normales en vertical
  md: 768,              // Tablets pequeñas y móviles en horizontal  
  lg: 1024,             // Tablets grandes y laptops pequeñas
  xl: 1280,             // Laptops y monitores estándar
  '2xl': 1536,          // Monitores grandes
  '3xl': 1920,          // Monitores full HD
  '4xl': 2560           // Monitores 2K/4K
};

// Aliases más descriptivos manteniendo compatibilidad
export const DISPOSITIVOS = {
  MOVIL_MINI: 'xs',
  MOVIL: 'sm', 
  TABLET_MINI: 'md',
  TABLET: 'lg',
  PORTATIL: 'xl',
  ESCRITORIO: '2xl',
  ESCRITORIO_GRANDE: '3xl',
  ULTRA_WIDE: '4xl'
};

// Media queries optimizadas con mejor sintaxis
export const CONSULTAS_MEDIA = {
  // Consultas por tamaño específico
  xs: `(max-width: ${PUNTOS_QUIEBRE.sm - 1}px)`,
  sm: `(min-width: ${PUNTOS_QUIEBRE.sm}px) and (max-width: ${PUNTOS_QUIEBRE.md - 1}px)`,
  md: `(min-width: ${PUNTOS_QUIEBRE.md}px) and (max-width: ${PUNTOS_QUIEBRE.lg - 1}px)`,
  lg: `(min-width: ${PUNTOS_QUIEBRE.lg}px) and (max-width: ${PUNTOS_QUIEBRE.xl - 1}px)`,
  xl: `(min-width: ${PUNTOS_QUIEBRE.xl}px) and (max-width: ${PUNTOS_QUIEBRE['2xl'] - 1}px)`,
  '2xl': `(min-width: ${PUNTOS_QUIEBRE['2xl']}px) and (max-width: ${PUNTOS_QUIEBRE['3xl'] - 1}px)`,
  '3xl': `(min-width: ${PUNTOS_QUIEBRE['3xl']}px) and (max-width: ${PUNTOS_QUIEBRE['4xl'] - 1}px)`,
  '4xl': `(min-width: ${PUNTOS_QUIEBRE['4xl']}px)`,
  
  // Consultas "hacia arriba" (min-width)
  smUp: `(min-width: ${PUNTOS_QUIEBRE.sm}px)`,
  mdUp: `(min-width: ${PUNTOS_QUIEBRE.md}px)`,
  lgUp: `(min-width: ${PUNTOS_QUIEBRE.lg}px)`,
  xlUp: `(min-width: ${PUNTOS_QUIEBRE.xl}px)`,
  '2xlUp': `(min-width: ${PUNTOS_QUIEBRE['2xl']}px)`,
  
  // Consultas "hacia abajo" (max-width)
  smDown: `(max-width: ${PUNTOS_QUIEBRE.md - 1}px)`,
  mdDown: `(max-width: ${PUNTOS_QUIEBRE.lg - 1}px)`,
  lgDown: `(max-width: ${PUNTOS_QUIEBRE.xl - 1}px)`,
  xlDown: `(max-width: ${PUNTOS_QUIEBRE['2xl'] - 1}px)`,
  
  // Consultas por categorías de dispositivo
  movil: `(max-width: ${PUNTOS_QUIEBRE.md - 1}px)`,
  tablet: `(min-width: ${PUNTOS_QUIEBRE.md}px) and (max-width: ${PUNTOS_QUIEBRE.xl - 1}px)`,
  escritorio: `(min-width: ${PUNTOS_QUIEBRE.xl}px)`,
  
  // Orientación
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Densidad y características
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  hd: '(-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)',
  
  // Capacidades de interacción
  hover: '(hover: hover)',
  noHover: '(hover: none)',
  pointer: '(pointer: fine)',
  coarse: '(pointer: coarse)',
  
  // Preferencias del usuario
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  noReducedMotion: '(prefers-reduced-motion: no-preference)',
  
  // Combinaciones útiles
  movilVertical: `(max-width: ${PUNTOS_QUIEBRE.md - 1}px) and (orientation: portrait)`,
  movilHorizontal: `(max-width: ${PUNTOS_QUIEBRE.md - 1}px) and (orientation: landscape)`,
  tabletVertical: `(min-width: ${PUNTOS_QUIEBRE.md}px) and (max-width: ${PUNTOS_QUIEBRE.xl - 1}px) and (orientation: portrait)`,
  
  // Consultas para contenedores
  container: {
    sm: `(min-width: ${PUNTOS_QUIEBRE.sm}px)`,
    md: `(min-width: ${PUNTOS_QUIEBRE.md}px)`,  
    lg: `(min-width: ${PUNTOS_QUIEBRE.lg}px)`,
    xl: `(min-width: ${PUNTOS_QUIEBRE.xl}px)`,
    '2xl': `(min-width: ${PUNTOS_QUIEBRE['2xl']}px)`
  }
};

// Sistema de espaciado escalable y consistente
export const ESPACIADO = {
  xs: {
    none: '0',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px  
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem'   // 24px
  },
  sm: {
    none: '0',
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem'     // 32px
  },
  md: {
    none: '0',
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem'     // 48px
  },
  lg: {
    none: '0',
    xs: '0.5rem',     // 8px
    sm: '0.75rem',    // 12px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem'     // 64px
  }
};

// Sistema tipográfico responsivo mejorado
export const TIPOGRAFIA = {
  xs: {
    xs: '0.625rem',   // 10px
    sm: '0.75rem',    // 12px
    base: '0.875rem', // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '1.875rem' // 30px
  },
  sm: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem'  // 36px
  },
  md: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem',// 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem'     // 48px
  },
  lg: {
    xs: '0.875rem',   // 14px
    sm: '1rem',       // 16px
    base: '1.125rem', // 18px
    lg: '1.375rem',   // 22px
    xl: '1.625rem',   // 26px
    '2xl': '2.125rem',// 34px
    '3xl': '2.75rem', // 44px
    '4xl': '3.5rem'   // 56px
  }
};

// Alturas y dimensiones de componentes comunes
export const DIMENSIONES = {
  navbar: {
    xs: '48px',
    sm: '56px', 
    md: '64px',
    lg: '72px',
    xl: '80px'
  },
  sidebar: {
    collapsed: {
      md: '64px',
      lg: '72px'
    },
    expanded: {
      xs: '100vw',
      sm: '100vw',
      md: '240px',
      lg: '280px',
      xl: '320px'
    }
  },
  container: {
    sm: '100%',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  button: {
    xs: '28px',
    sm: '32px',
    md: '40px',
    lg: '44px',
    xl: '48px'
  }
};

// Z-index sistemático para evitar conflictos
export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1010,
  overlay: 1020,
  modal: 1030,
  popover: 1040,
  tooltip: 1050,
  notification: 1060,
  max: 2147483647
};

// Funciones de detección mejoradas con caché
const cache = new Map();

export const obtenerTipoDispositivo = (ancho) => {
  const cacheKey = `tipo_${ancho}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  
  let tipo;
  if (ancho < PUNTOS_QUIEBRE.sm) tipo = 'xs';
  else if (ancho < PUNTOS_QUIEBRE.md) tipo = 'sm';
  else if (ancho < PUNTOS_QUIEBRE.lg) tipo = 'md';
  else if (ancho < PUNTOS_QUIEBRE.xl) tipo = 'lg';
  else if (ancho < PUNTOS_QUIEBRE['2xl']) tipo = 'xl';
  else if (ancho < PUNTOS_QUIEBRE['3xl']) tipo = '2xl';
  else if (ancho < PUNTOS_QUIEBRE['4xl']) tipo = '3xl';
  else tipo = '4xl';
  
  cache.set(cacheKey, tipo);
  return tipo;
};

// Funciones de detección individual optimizadas
export const esXs = (ancho) => ancho < PUNTOS_QUIEBRE.sm;
export const esSm = (ancho) => ancho >= PUNTOS_QUIEBRE.sm && ancho < PUNTOS_QUIEBRE.md;
export const esMd = (ancho) => ancho >= PUNTOS_QUIEBRE.md && ancho < PUNTOS_QUIEBRE.lg;
export const esLg = (ancho) => ancho >= PUNTOS_QUIEBRE.lg && ancho < PUNTOS_QUIEBRE.xl;
export const esXl = (ancho) => ancho >= PUNTOS_QUIEBRE.xl && ancho < PUNTOS_QUIEBRE['2xl'];
export const es2xl = (ancho) => ancho >= PUNTOS_QUIEBRE['2xl'];

// Funciones de agrupación por categoría (las más usadas)
export const esMovil = (ancho) => ancho < PUNTOS_QUIEBRE.md;
export const esTablet = (ancho) => ancho >= PUNTOS_QUIEBRE.md && ancho < PUNTOS_QUIEBRE.xl;
export const esEscritorio = (ancho) => ancho >= PUNTOS_QUIEBRE.xl;

// Funciones de utilidad para componentes específicos
export const obtenerDimension = (categoria, elemento, ancho) => {
  const tipo = obtenerTipoDispositivo(ancho);
  return DIMENSIONES[categoria]?.[elemento]?.[tipo] || 
         DIMENSIONES[categoria]?.[elemento]?.md || 
         'auto';
};

export const obtenerEspaciado = (ancho, tamaño = 'md') => {
  const tipo = obtenerTipoDispositivo(ancho);
  const grupo = ['xs', 'sm'].includes(tipo) ? 'xs' : 
                ['md'].includes(tipo) ? 'md' : 'lg';
  return ESPACIADO[grupo][tamaño] || ESPACIADO.md[tamaño];
};

export const obtenerTipografia = (ancho, tamaño = 'base') => {
  const tipo = obtenerTipoDispositivo(ancho);
  const grupo = ['xs'].includes(tipo) ? 'xs' :
                ['sm'].includes(tipo) ? 'sm' :
                ['md', 'lg'].includes(tipo) ? 'md' : 'lg';
  return TIPOGRAFIA[grupo][tamaño] || TIPOGRAFIA.md[tamaño];
};

// Función para generar media queries dinámicamente
export const crearMediaQuery = (minWidth, maxWidth, orientacion, caracteristicas = {}) => {
  const condiciones = [];
  
  if (minWidth) condiciones.push(`(min-width: ${minWidth}px)`);
  if (maxWidth) condiciones.push(`(max-width: ${maxWidth}px)`);
  if (orientacion) condiciones.push(`(orientation: ${orientacion})`);
  
  Object.entries(caracteristicas).forEach(([key, value]) => {
    condiciones.push(`(${key}: ${value})`);
  });
  
  return condiciones.join(' and ');
};

// Función para limpiar caché (útil para testing)
export const limpiarCache = () => {
  cache.clear();
};

// Funciones de compatibilidad con la versión anterior
export const esMovilPequeno = esXs;
export const esDispositivoMovil = esMovil;
export const esDispositivoTablet = esTablet; 
export const esDispositivoEscritorio = esEscritorio;
export const obtenerAlturaNavbar = (ancho) => obtenerDimension('navbar', obtenerTipoDispositivo(ancho), ancho);
export const obtenerAnchoSidebar = (ancho, colapsado = false) => {
  const estado = colapsado ? 'collapsed' : 'expanded';
  return obtenerDimension('sidebar', estado, ancho);
};

// Export consolidado
export default {
  // Configuraciones principales
  PUNTOS_QUIEBRE,
  DISPOSITIVOS,
  CONSULTAS_MEDIA,
  ESPACIADO,
  TIPOGRAFIA,
  DIMENSIONES,
  Z_INDEX,
  
  // Funciones de detección
  obtenerTipoDispositivo,
  esXs, esSm, esMd, esLg, esXl, es2xl,
  esMovil, esTablet, esEscritorio,
  
  // Funciones de utilidad
  obtenerDimension,
  obtenerEspaciado,
  obtenerTipografia,
  crearMediaQuery,
  limpiarCache,
  
  // Compatibilidad hacia atrás
  esMovilPequeno,
  esDispositivoMovil,
  esDispositivoTablet,
  esDispositivoEscritorio,
  obtenerAlturaNavbar,
  obtenerAnchoSidebar
};