import { useEffect, useRef, useCallback } from "react";

const TIEMPO_INACTIVIDAD = 5 * 60 * 1000;

const useInactividad = (onCerrarSesion) => {
    const timerRef = useRef(null);

    const resetTimer = useCallback(() => {
        if (!onCerrarSesion) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onCerrarSesion();
        }, TIEMPO_INACTIVIDAD);
    }, [onCerrarSesion]);

    useEffect(() => {
        if (!onCerrarSesion) return;

        const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        eventos.forEach((e) => window.addEventListener(e, resetTimer));
        resetTimer();

        return () => {
            eventos.forEach((e) => window.removeEventListener(e, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [resetTimer, onCerrarSesion]);
};

export default useInactividad;