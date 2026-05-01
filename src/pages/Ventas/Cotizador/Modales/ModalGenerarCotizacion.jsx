import React, { useState } from "react";
import { X, Download, FileText, Loader2, CheckCircle } from "lucide-react";

const ModalGenerarCotizacion = ({
  estaAbierto,
  cotizacion,
  alCerrar,
  nombreVendedor = "[NOMBRE DEL VENDEDOR]",
  puestoVendedor = "[PUESTO]",
}) => {
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("recomendado");
  const [generando, setGenerando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(null);

  if (!estaAbierto || !cotizacion) return null;

  let todosVehiculos = [];
  try {
    const lista =
      typeof cotizacion.lista === "string"
        ? JSON.parse(cotizacion.lista)
        : cotizacion.lista;
    todosVehiculos = lista?.cotizaciones_todos_vehiculos ?? [];
  } catch {
    todosVehiculos = [];
  }

  const vehiculoRecomendadoId = cotizacion.vehiculo_id;

  // Formatear moneda MXN
  const fmt = (n) =>
    Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Número en letras (simplificado para rangos típicos de cotizaciones)
  const numeroALetras = (num) => {
    const n = Math.round(num * 100) / 100;
    const entero = Math.floor(n);
    const centavos = Math.round((n - entero) * 100);

    const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE",
      "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE",
      "DIECIOCHO", "DIECINUEVE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA",
      "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
      "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    const grupoALetras = (g) => {
      if (g === 0) return "";
      if (g === 100) return "CIEN";
      let s = "";
      if (g >= 100) { s += centenas[Math.floor(g / 100)] + " "; g %= 100; }
      if (g >= 20) { s += decenas[Math.floor(g / 10)]; if (g % 10) s += " Y " + unidades[g % 10]; }
      else if (g > 0) s += unidades[g];
      return s.trim();
    };

    let resultado = "";
    const miles = Math.floor(entero / 1000);
    const resto = entero % 1000;

    if (miles > 0) {
      resultado += miles === 1 ? "MIL" : grupoALetras(miles) + " MIL";
      if (resto > 0) resultado += " ";
    }
    resultado += grupoALetras(resto);

    return `${resultado.trim()} ${centavos.toString().padStart(2, "0")}/100 M.N.`;
  };

  // Formatear fecha larga en español
  const fechaLarga = (fechaStr) => {
    if (!fechaStr) return "";
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio",
      "agosto","septiembre","octubre","noviembre","diciembre"];
    const d = new Date(fechaStr + "T12:00:00");
    return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  };

  const generarWord = async (vehiculos) => {
    setGenerando(true);
    setError(null);
    setExito(false);

    try {
      const payload = {
        cotizacion_id: cotizacion.id,
        vehiculos_ids: vehiculos.map((v) => v.vehiculo_id),
        nombre_vendedor: nombreVendedor,
        puesto_vendedor: puestoVendedor,
      };

      const res = await fetch("/api/cotizaciones/generar-word", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al generar el documento");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const nombres = vehiculos.length === 1 ? vehiculos[0].vehiculo_nombre : "TODOS_VEHICULOS";
      a.download = `Cotizacion_${cotizacion.folio}_${nombres}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  };

  const handleGenerar = () => {
    let vehiculosAGenerar = [];
    if (vehiculoSeleccionado === "todos") {
      vehiculosAGenerar = todosVehiculos;
    } else if (vehiculoSeleccionado === "recomendado") {
      const rec = todosVehiculos.find((v) => v.vehiculo_id === vehiculoRecomendadoId) ?? todosVehiculos[0];
      if (rec) vehiculosAGenerar = [rec];
    } else {
      const veh = todosVehiculos.find((v) => String(v.vehiculo_id) === vehiculoSeleccionado);
      if (veh) vehiculosAGenerar = [veh];
    }
    if (vehiculosAGenerar.length > 0) generarWord(vehiculosAGenerar);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={alCerrar}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-white" size={24} />
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Generar Cotización</h2>
              <p className="text-blue-200 text-sm">
                Folio: {cotizacion.folio} · {cotizacion.nombre_cliente ?? cotizacion.cliente?.nombre ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={alCerrar}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Resumen del viaje */}
          <div className="bg-blue-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Origen</span>
              <span className="font-medium text-gray-800">{cotizacion.origen || "Oaxaca de Juárez, Oax."}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Destino</span>
              <span className="font-medium text-gray-800">{cotizacion.destino}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Salida</span>
              <span className="font-medium text-gray-800">
                {fechaLarga(cotizacion.fecha_salida)}{cotizacion.hora_salida ? ` · ${cotizacion.hora_salida}` : ""}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Regreso</span>
              <span className="font-medium text-gray-800">
                {cotizacion.fecha_regreso ? fechaLarga(cotizacion.fecha_regreso) : "—"}
                {cotizacion.hora_regreso ? ` · ${cotizacion.hora_regreso}` : ""}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Pasajeros</span>
              <span className="font-medium text-gray-800">{cotizacion.num_pasajeros ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wide">Kilómetros</span>
              <span className="font-medium text-gray-800">{cotizacion.total_kilometros ?? "—"} km</span>
            </div>
          </div>

          {/* Selector de vehículo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ¿Para qué vehículo deseas generar la cotización?
            </label>
            <div className="space-y-2">
              {/* Opción recomendado */}
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                border-blue-200 bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-100">
                <input
                  type="radio"
                  name="vehiculo"
                  value="recomendado"
                  checked={vehiculoSeleccionado === "recomendado"}
                  onChange={() => setVehiculoSeleccionado("recomendado")}
                  className="accent-blue-600"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-800">
                    Vehículo recomendado
                    {(() => {
                      const rec = todosVehiculos.find((v) => v.vehiculo_id === vehiculoRecomendadoId) ?? todosVehiculos[0];
                      return rec ? ` · ${rec.vehiculo_nombre} (${rec.capacidad_pasajeros} pax)` : "";
                    })()}
                  </span>
                  {(() => {
                    const rec = todosVehiculos.find((v) => v.vehiculo_id === vehiculoRecomendadoId) ?? todosVehiculos[0];
                    return rec ? (
                      <span className="block text-xs text-blue-700 font-semibold">
                        Total con IVA: ${fmt(rec.costos.total_con_iva)}
                      </span>
                    ) : null;
                  })()}
                </div>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Sugerido</span>
              </label>

              {/* Vehículos individuales */}
              {todosVehiculos.map((v) => (
                <label
                  key={v.vehiculo_id}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                    border-gray-200 hover:border-gray-300 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="vehiculo"
                    value={String(v.vehiculo_id)}
                    checked={vehiculoSeleccionado === String(v.vehiculo_id)}
                    onChange={() => setVehiculoSeleccionado(String(v.vehiculo_id))}
                    className="accent-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {v.vehiculo_nombre} · {v.capacidad_pasajeros} pasajeros
                    </span>
                    <span className="block text-xs text-gray-500">
                      Subtotal: ${fmt(v.costos.subtotal)} + IVA ${fmt(v.costos.iva)} ={" "}
                      <strong className="text-gray-700">${fmt(v.costos.total_con_iva)}</strong>
                    </span>
                  </div>
                </label>
              ))}

              {/* Todos */}
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                border-gray-200 hover:border-gray-300 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  name="vehiculo"
                  value="todos"
                  checked={vehiculoSeleccionado === "todos"}
                  onChange={() => setVehiculoSeleccionado("todos")}
                  className="accent-purple-600"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-800">Todos los vehículos</span>
                  <span className="block text-xs text-gray-500">
                    Genera una cotización por cada vehículo disponible ({todosVehiculos.length} en total)
                  </span>
                </div>
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">ZIP</span>
              </label>
            </div>
          </div>

          {/* Error / éxito */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠ {error}
            </div>
          )}
          {exito && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle size={16} /> Documento generado y descargado correctamente.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={alCerrar}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium
              hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerar}
            disabled={generando}
            className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400
              text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {generando ? (
              <><Loader2 size={16} className="animate-spin" /> Generando...</>
            ) : (
              <><Download size={16} /> Descargar Word</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGenerarCotizacion;