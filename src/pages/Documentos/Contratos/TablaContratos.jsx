import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Users, BarChart3, RotateCcw, FileText } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ModalVerContrato from './Modales/ModalVerContrato';
import ModalEditarContrato from './Modales/ModalEditarContrato';
import ModalEliminarContrato from './Modales/ModalEliminarContrato';
import ModalRestaurarContrato from './Modales/ModalRestaurarContrato';
import ModalEliminarDefinitivo from './Modales/ModalEliminarDefinitivo';
import './TablaContratos.css';

const TablaContratos = () => {
  // CAMBIAR ESTO SEGÚN EL ROL DEL USUARIO LOGUEADO
  // true = Administrador, false = Usuario normal
  const [esAdministrador, setEsAdministrador] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Estados para los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [contratoAEliminar, setContratoAEliminar] = useState(null);
  const [contratoARestaurar, setContratoARestaurar] = useState(null);
  const [contratoAEliminarDefinitivo, setContratoAEliminarDefinitivo] = useState(null);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  // Estado para los datos de Contratos - AHORA CON CAMPO "activo"
  const [datosContratos, setDatosContratos] = useState([
    {
      id: 1,
      fechaSalida: '2025-10-20',
      fechaRegreso: '2025-10-22',
      horaSalida: '08:00',
      horaRegreso: '18:00',
      pasajeros: '15',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: 'Tlacolula',
      destinoServicio: 'Puerto Escondido',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 2,
      fechaSalida: '2025-10-25',
      fechaRegreso: '2025-10-27',
      horaSalida: '09:00',
      horaRegreso: '19:00',
      pasajeros: '20',
      origenServicio: 'Oaxaca Aeropuerto',
      puntoIntermedio: 'Ocotlán',
      destinoServicio: 'Huatulco',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 3,
      fechaSalida: '2025-10-28',
      fechaRegreso: '2025-10-30',
      horaSalida: '07:30',
      horaRegreso: '17:30',
      pasajeros: '12',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'Hierve el Agua',
      fecha_registro: '02/09/2025',
      activo: false
    },
    {
      id: 4,
      fechaSalida: '2025-11-01',
      fechaRegreso: '2025-11-03',
      horaSalida: '10:00',
      horaRegreso: '20:00',
      pasajeros: '18',
      origenServicio: 'Hotel Casa Oaxaca',
      puntoIntermedio: 'Teotitlán del Valle',
      destinoServicio: 'Monte Albán',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 5,
      fechaSalida: '2025-11-05',
      fechaRegreso: '2025-11-07',
      horaSalida: '08:30',
      horaRegreso: '18:30',
      pasajeros: '25',
      origenServicio: 'Oaxaca Terminal ADO',
      puntoIntermedio: 'Mitla',
      destinoServicio: 'Zipolite',
      fecha_registro: '03/09/2025',
      activo: false
    },
    {
      id: 6,
      fechaSalida: '2025-11-10',
      fechaRegreso: '2025-11-12',
      horaSalida: '06:00',
      horaRegreso: '16:00',
      pasajeros: '10',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'San José del Pacífico',
      fecha_registro: '03/09/2025',
      activo: true
    },
    {
      id: 7,
      fechaSalida: '2025-11-15',
      fechaRegreso: '2025-11-17',
      horaSalida: '09:30',
      horaRegreso: '19:30',
      pasajeros: '22',
      origenServicio: 'Oaxaca Aeropuerto',
      puntoIntermedio: 'Zaachila',
      destinoServicio: 'Mazunte',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 8,
      fechaSalida: '2025-11-20',
      fechaRegreso: '2025-11-22',
      horaSalida: '07:00',
      horaRegreso: '17:00',
      pasajeros: '14',
      origenServicio: 'Hotel Quinta Real',
      puntoIntermedio: 'Santa María del Tule',
      destinoServicio: 'Benito Juárez',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 9,
      fechaSalida: '2025-11-25',
      fechaRegreso: '2025-11-27',
      horaSalida: '08:00',
      horaRegreso: '18:00',
      pasajeros: '16',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'Chacahua',
      fecha_registro: '05/09/2025',
      activo: true
    },
    {
      id: 10,
      fechaSalida: '2025-12-01',
      fechaRegreso: '2025-12-03',
      horaSalida: '10:30',
      horaRegreso: '20:30',
      pasajeros: '30',
      origenServicio: 'Oaxaca Terminal',
      puntoIntermedio: 'Zimatlán',
      destinoServicio: 'Puerto Ángel',
      fecha_registro: '05/09/2025',
      activo: true
    }
  ]);

  const contratosFiltrados = datosContratos.filter(contrato => {
    if (!esAdministrador && !contrato.activo) {
      return false;
    }

    // FILTRO DE BÚSQUEDA
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      contrato.id.toString().includes(busqueda) ||
      (contrato.origenServicio && contrato.origenServicio.toLowerCase().includes(busqueda)) ||
      (contrato.destinoServicio && contrato.destinoServicio.toLowerCase().includes(busqueda)) ||
      (contrato.puntoIntermedio && contrato.puntoIntermedio.toLowerCase().includes(busqueda)) ||
      (contrato.pasajeros && contrato.pasajeros.toString().includes(busqueda)) ||
      (contrato.fechaSalida && contrato.fechaSalida.includes(busqueda))
    );
  });

  // Calcular paginación
  const totalRegistros = contratosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const contratosPaginados = contratosFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const contratosActivos = datosContratos.filter(c => c.activo).length;
  const contratosInactivos = datosContratos.filter(c => !c.activo).length;

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarCambioRegistros = (evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  };

  const manejarBusqueda = (evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  };

  const manejarAccion = (accion, contrato) => {
    switch (accion) {
      case 'ver':
        setContratoSeleccionado(contrato);
        setModalVerAbierto(true);
        break;
      case 'editar':
        setContratoSeleccionado(contrato);
        setModalEditarAbierto(true);
        break;
      case 'pdf':
        generarYDescargarPDF(contrato);
        break;
      case 'eliminar':
        // Si es admin y el contrato está inactivo, mostrar modal de eliminar definitivo
        if (esAdministrador && !contrato.activo) {
          setContratoAEliminarDefinitivo(contrato);
        } else {
          // Si no, mostrar modal de desactivar (ModalEliminarContrato)
          setContratoAEliminar(contrato);
        }
        break;
      case 'restaurar':
        setContratoARestaurar(contrato);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setContratoSeleccionado(null);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setContratoSeleccionado(null);
  };

  const manejarGuardarContrato = async (datosActualizados) => {
    try {
      // Actualizar el contrato en el estado
      setDatosContratos(datosContratos.map(contrato =>
        contrato.id === datosActualizados.id ? datosActualizados : contrato
      ));

      console.log('Contrato actualizada:', datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      throw error;
    }
  };

  const manejarEliminarContrato = async (contrato) => {
    if (!contrato) {
      // Cancelar eliminación
      setContratoAEliminar(null);
      return;
    }

    try {
      // SOFT DELETE: Marcar como inactivo
      setDatosContratos(datosContratos.map(c =>
        c.id === contrato.id ? { ...c, activo: false } : c
      ));

      setContratoAEliminar(null);
      console.log('Contrato DESACTIVADA:', contrato);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al desactivar contrato:', error);
      setContratoAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (contrato) => {
    try {
      // Restaurar contrato (marcarlo como activo)
      setDatosContratos(datosContratos.map(c =>
        c.id === contrato.id ? { ...c, activo: true } : c
      ));

      setContratoARestaurar(null);
      console.log('Contrato RESTAURADA:', contrato);
    } catch (error) {
      console.error('Error al restaurar contrato:', error);
    }
  };

  const manejarEliminarDefinitivo = async (contrato) => {
    try {
      // Eliminar definitivamente del sistema
      setDatosContratos(datosContratos.filter(c => c.id !== contrato.id));

      setContratoAEliminarDefinitivo(null);
      console.log('Contrato eliminada DEFINITIVAMENTE:', contrato);
    } catch (error) {
      console.error('Error al eliminar definitivamente contrato:', error);
    }
  };

  // Función para generar el pdf actualizado 
  const generarYDescargarPDF = async (contrato) => {
    try {

      const plantillaUrl = '/TRANSPORTE_P1.pdf';
      const plantillaBytes = await fetch(plantillaUrl).then(res => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);


      firstPage.drawText(new Date(contrato.fechaSalida).toLocaleDateString('es-MX'), {
        x: 150,
        y: 700,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });


      const pdfBytes = await pdfDoc.save();


      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contrato_${contrato.id}_${contrato.fechaSalida}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log('PDF generado y descargado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="Contratos-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="Contratos-encabezado">
        <div className="Contratos-seccion-logo">
          <div className="Contratos-lineas-decorativas">
            <div className="Contratos-linea Contratos-roja"></div>
            <div className="Contratos-linea Contratos-azul"></div>
            <div className="Contratos-linea Contratos-verde"></div>
            <div className="Contratos-linea Contratos-amarilla"></div>
          </div>
          <h1 className="Contratos-titulo">Gestión de Contratos</h1>
          {/* Badge de rol */}
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            marginLeft: '1rem'
          }}>
            {esAdministrador ? 'ADMINISTRADOR' : 'USUARIO'}
          </span>
        </div>

        {/* Estadísticas */}
        <div className="Contratos-contenedor-estadisticas">
          <div className="Contratos-estadistica">
            <div className="Contratos-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="Contratos-info-estadistica">
              <span className="Contratos-label-estadistica">ACTIVAS: {contratosActivos}</span>
            </div>
          </div>

          {esAdministrador && (
            <div className="Contratos-estadistica">
              <div className="Contratos-icono-estadistica-cuadrado">
                <BarChart3 size={20} />
              </div>
              <div className="Contratos-info-estadistica">
                <span className="Contratos-label-estadistica">INACTIVAS: {contratosInactivos}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="Contratos-controles">
        <div className="Contratos-control-registros">
          {/* BOTÓN PARA CAMBIAR DE ROL (SOLO PARA PRUEBAS - ELIMINAR EN PRODUCCIÓN) */}
          <button
            onClick={() => setEsAdministrador(!esAdministrador)}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #17a2b8, #138496)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              marginRight: '1rem'
            }}
          >
            Cambiar a {esAdministrador ? 'Usuario' : 'Admin'}
          </button>

          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="Contratos-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="Contratos-controles-derecha">
          <div className="Contratos-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="Contratos-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar contrato..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="Contratos-entrada-buscar"
              />
              <Search className="Contratos-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="Contratos-contenedor-tabla">
        <table className="Contratos-tabla">
          <thead>
            <tr className="Contratos-fila-encabezado">
              <th>ID</th>
              <th>FECHA SALIDA</th>
              <th>FECHA REGRESO</th>
              <th>HORA SALIDA</th>
              <th>HORA REGRESO</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {contratosPaginados.map((contrato, index) => (
              <tr
                key={contrato.id}
                className="Contratos-fila-contrato"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: contrato.activo ? 'white' : '#f8d7da'
                }}
              >
                <td data-label="ID" className="Contratos-columna-id">
                  <span className="Contratos-badge-id">#{contrato.id.toString().padStart(3, '0')}</span>
                </td>
                <td data-label="Fecha Salida" className="Contratos-columna-fecha">
                  <span className="Contratos-fecha">{new Date(contrato.fechaSalida).toLocaleDateString('es-MX')}</span>
                </td>
                <td data-label="Fecha Regreso" className="Contratos-columna-fecha">
                  <span className="Contratos-fecha">{new Date(contrato.fechaRegreso).toLocaleDateString('es-MX')}</span>
                </td>
                <td data-label="Hora Salida" className="Contratos-columna-hora">
                  <span className="Contratos-badge-hora">{contrato.horaSalida}</span>
                </td>
                <td data-label="Hora Regreso" className="Contratos-columna-hora">
                  <span className="Contratos-badge-hora">{contrato.horaRegreso}</span>
                </td>
                <td data-label="Origen" className="Contratos-columna-origen">
                  <span className="Contratos-ubicacion">{contrato.origenServicio}</span>
                </td>
                <td data-label="Destino" className="Contratos-columna-destino">
                  <span className="Contratos-ubicacion">{contrato.destinoServicio}</span>
                </td>
                <td data-label="Acciones" className="Contratos-columna-acciones">
                  <div className="Contratos-botones-accion">
                    <button
                      className="Contratos-boton-accion Contratos-ver"
                      onClick={() => manejarAccion('ver', contrato)}
                      title="Ver contrato"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="Contratos-boton-accion Contratos-descargar"
                      onClick={() => manejarAccion('pdf', contrato)}
                      title="Descargar contrato"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className="Contratos-boton-accion Contratos-editar"
                      onClick={() => manejarAccion('editar', contrato)}
                      title="Editar contrato"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Botón RESTAURAR solo para admin con Contratos inactivas */}
                    {esAdministrador && !contrato.activo && (
                      <button
                        className="Contratos-boton-accion Contratos-restaurar"
                        onClick={() => manejarAccion('restaurar', contrato)}
                        title="Restaurar contrato"
                        style={{
                          background: 'linear-gradient(45deg, #28a745, #218838)',
                          color: 'white'
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    <button
                      className="Contratos-boton-accion Contratos-eliminar"
                      onClick={() => manejarAccion('eliminar', contrato)}
                      title={esAdministrador && !contrato.activo ? 'Eliminar definitivamente' : 'Desactivar contrato'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de paginación y controles */}
      <div className="Contratos-pie-tabla">
        <div className="Contratos-informacion-registros">
          Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
          {terminoBusqueda && (
            <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
              (filtrado de {datosContratos.length} registros totales)
            </span>
          )}
        </div>

        <div className="Contratos-controles-paginacion">
          <button
            className="Contratos-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="Contratos-numeros-paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
              <button
                key={numero}
                className={`Contratos-numero-pagina ${paginaActual === numero ? 'Contratos-activo' : ''}`}
                onClick={() => cambiarPagina(numero)}
              >
                {numero}
              </button>
            ))}
          </div>

          <button
            className="Contratos-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Modal Ver contrato */}
      <ModalVerContrato
        estaAbierto={modalVerAbierto}
        contrato={contratoSeleccionado}
        alCerrar={cerrarModalVer}
      />

      {/* Modal Editar contrato */}
      <ModalEditarContrato
        estaAbierto={modalEditarAbierto}
        contrato={contratoSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarContrato}
      />

      {/* Modal Eliminar contrato (Desactivar) */}
      {contratoAEliminar && (
        <ModalEliminarContrato
          contrato={contratoAEliminar}
          alConfirmar={manejarEliminarContrato}
          esAdministrador={esAdministrador}
        />
      )}

      {/* Modal Restaurar contrato */}
      {contratoARestaurar && (
        <ModalRestaurarContrato
          contrato={contratoARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setContratoARestaurar(null)}
        />
      )}

      {/* Modal Eliminar Definitivamente */}
      {contratoAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          contrato={contratoAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setContratoAEliminarDefinitivo(null)}
        />
      )}
    </div>
  );
};

export default TablaContratos;