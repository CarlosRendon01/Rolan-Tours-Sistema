import React, { useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';

const ModalEliminarDefinitivoAbono = ({ estaAbierto, alCerrar, abono, alEliminar }) => {
  const [procesando, setProcesando] = useState(false);

  if (!estaAbierto || !abono) return null;

  const manejarEliminar = async () => {
    // ✅ PRIMERA CONFIRMACIÓN
    const resultado = await Swal.fire({
      title: '⚠️ ¡Eliminar Definitivamente!',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p><strong>Cliente:</strong> ${abono.cliente.nombre}</p>
          <p><strong>Servicio:</strong> ${abono.servicio.tipo}</p>
          <p><strong>Monto Total:</strong> $${abono.planPago.montoTotal.toLocaleString()}</p>
          <hr style="margin: 1rem 0;">
          <div style="background: #fee2e2; padding: 1rem; border-radius: 8px; border-left: 4px solid #dc2626;">
            <p style="color: #991b1b; font-weight: 600; margin: 0;">
              ⚠️ ADVERTENCIA: Esta acción es PERMANENTE
            </p>
            <p style="color: #991b1b; font-size: 0.875rem; margin: 0.5rem 0 0 0;">
              El pago y todos sus ${abono.planPago.abonosRealizados || 0} abonos serán eliminados de la base de datos y NO podrán ser recuperados.
            </p>
          </div>
        </div>
      `,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar definitivamente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!resultado.isConfirmed) return;

    // ✅ SEGUNDA CONFIRMACIÓN
    const confirmacionFinal = await Swal.fire({
      title: '¿Estás completamente seguro?',
      text: 'Esta es tu última oportunidad para cancelar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (!confirmacionFinal.isConfirmed) return;

    // ✅ PROCESAR ELIMINACIÓN
    setProcesando(true);
    Swal.fire({
      title: 'Eliminando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/abonos/${abono.id}/force`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      Swal.close();

      await Swal.fire({
        title: 'Eliminado Definitivamente',
        html: `
          <div style="padding: 1rem;">
            <p style="color: #059669; font-weight: 600;">
              El pago ha sido eliminado permanentemente
            </p>
            <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">
              Cliente: ${abono.cliente.nombre}
            </p>
          </div>
        `,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });

      if (alEliminar) {
        await alEliminar(abono);
      }

      alCerrar();
    } catch (error) {
      console.error('Error al eliminar definitivamente:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar el pago',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setProcesando(false);
    }
  };

  return null; // Todo se maneja con Swal, no necesita renderizar nada
};

export default ModalEliminarDefinitivoAbono;