import { useEffect, useMemo, useState } from "react";
import { ESTADOS_MESA } from "../../data/estadosMesa";
import useAdminMesas from "../../hooks/panel-admin/useAdminMesas";
import {
  FORM_MESA_INICIAL,
  UBICACIONES_MESA,
} from "../../data/panel-admin/mesasAdminConfig";
import "../../styles/panel-admin/adminMesasPanel.css";

function AdminMesasPanel() {
  const {
    mesas,
    cargandoMesas,
    guardandoMesa,
    errorMesas,
    guardarMesa,
    actualizarEstadoMesa,
  } = useAdminMesas();

  const [formData, setFormData] = useState(FORM_MESA_INICIAL);
  const [errores, setErrores] = useState({});
  const [mesaActivaId, setMesaActivaId] = useState("");

  const estaEditando = Boolean(formData.id);

  useEffect(() => {
    if (mesas.length === 0) {
      setMesaActivaId("");
      return;
    }

    const existeMesaActiva = mesas.some(mesa => mesa.id === mesaActivaId);

    if (!existeMesaActiva) {
      setMesaActivaId(mesas[0].id);
    }
  }, [mesas, mesaActivaId]);

  const mesaActiva = useMemo(() => {
    return mesas.find(mesa => mesa.id === mesaActivaId) || null;
  }, [mesas, mesaActivaId]);

  const resumen = useMemo(() => {
    return {
      total: mesas.length,
      disponibles: mesas.filter(mesa => mesa.estado === "disponible").length,
      ocupadas: mesas.filter(mesa => mesa.estado === "ocupada").length,
      bloqueadas: mesas.filter(mesa => mesa.estado === "bloqueada").length,
    };
  }, [mesas]);

  const limpiarFormulario = () => {
    setFormData(FORM_MESA_INICIAL);
    setErrores({});
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.numero || Number(formData.numero) <= 0) {
      nuevosErrores.numero = "Ingresa un número de mesa válido.";
    }

    if (!formData.capacidad || Number(formData.capacidad) <= 0) {
      nuevosErrores.capacidad = "Ingresa una capacidad válida.";
    }

    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = "Selecciona una ubicación.";
    }

    if (!formData.estado) {
      nuevosErrores.estado = "Selecciona un estado.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const guardado = await guardarMesa(formData);

    if (guardado) {
      limpiarFormulario();
    }
  };

  const editarMesa = mesa => {
    setFormData({
      id: mesa.id,
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      ubicacion: mesa.ubicacion,
      estado: mesa.estado,
    });

    setErrores({});
  };

  const renderAccionesMesa = mesa => (
    <div className="admin-mesas__acciones">
      <button type="button" onClick={() => editarMesa(mesa)}>
        Editar
      </button>

      {mesa.estado !== "bloqueada" ? (
        <button
          type="button"
          onClick={() => actualizarEstadoMesa(mesa.id, "bloqueada")}
          disabled={guardandoMesa}
        >
          Bloquear
        </button>
      ) : (
        <button
          type="button"
          onClick={() => actualizarEstadoMesa(mesa.id, "disponible")}
          disabled={guardandoMesa}
        >
          Activar
        </button>
      )}
    </div>
  );

  return (
    <section className="admin-mesas">
      <header className="admin-mesas__header admin-mesas__header--compact">
        <div className="admin-mesas__stats">
          <article>
            <span>Total</span>
            <strong>{resumen.total}</strong>
          </article>

          <article>
            <span>Disponibles</span>
            <strong>{resumen.disponibles}</strong>
          </article>

          <article>
            <span>Ocupadas</span>
            <strong>{resumen.ocupadas}</strong>
          </article>

          <article>
            <span>Bloqueadas</span>
            <strong>{resumen.bloqueadas}</strong>
          </article>
        </div>
      </header>

      {errorMesas && <div className="admin-mesas__error">{errorMesas}</div>}

      <div className="admin-mesas__layout">
        <form className="admin-mesas__form" onSubmit={handleSubmit}>
          <span className="admin-mesas__label">
            {estaEditando ? "Editar mesa" : "Nueva mesa"}
          </span>

          <h3>{estaEditando ? `Mesa ${formData.numero}` : "Crear mesa"}</h3>

          <div className="admin-mesas__grupo">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              name="numero"
              type="number"
              min="1"
              value={formData.numero}
              onChange={handleChange}
              placeholder="Ej: 8"
            />
            {errores.numero && <small>{errores.numero}</small>}
          </div>

          <div className="admin-mesas__grupo">
            <label htmlFor="capacidad">Capacidad</label>
            <input
              id="capacidad"
              name="capacidad"
              type="number"
              min="1"
              value={formData.capacidad}
              onChange={handleChange}
              placeholder="Ej: 4"
            />
            {errores.capacidad && <small>{errores.capacidad}</small>}
          </div>

          <div className="admin-mesas__grupo">
            <label htmlFor="ubicacion">Ubicación</label>
            <select
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
            >
              {UBICACIONES_MESA.map(ubicacion => (
                <option key={ubicacion} value={ubicacion}>
                  {ubicacion}
                </option>
              ))}
            </select>
            {errores.ubicacion && <small>{errores.ubicacion}</small>}
          </div>

          <div className="admin-mesas__grupo">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="bloqueada">Bloqueada</option>
            </select>
            {errores.estado && <small>{errores.estado}</small>}
          </div>

          <div className="admin-mesas__acciones-form">
            {estaEditando && (
              <button
                type="button"
                className="admin-mesas__btn admin-mesas__btn--secundario"
                onClick={limpiarFormulario}
                disabled={guardandoMesa}
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="admin-mesas__btn admin-mesas__btn--principal"
              disabled={guardandoMesa}
            >
              {guardandoMesa
                ? "Guardando..."
                : estaEditando
                  ? "Guardar cambios"
                  : "Crear mesa"}
            </button>
          </div>
        </form>

        <section className="admin-mesas__tabla-card">
          <div className="admin-mesas__tabla-header">
            <div>
              <span className="admin-mesas__label">Listado</span>
              <h3>Mesas registradas</h3>
            </div>
          </div>

          {cargandoMesas ? (
            <div className="admin-mesas__empty">Cargando mesas...</div>
          ) : mesas.length === 0 ? (
            <div className="admin-mesas__empty">
              Todavía no hay mesas registradas.
            </div>
          ) : (
            <>
              <div className="admin-mesas__selector-movil">
                <label htmlFor="mesa-activa">Selecciona una mesa</label>
                <select
                  id="mesa-activa"
                  value={mesaActivaId}
                  onChange={event => setMesaActivaId(event.target.value)}
                >
                  {mesas.map(mesa => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} · {mesa.capacidad} personas ·{" "}
                      {mesa.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              {mesaActiva && (
                <article className="admin-mesas__detalle-movil">
                  <div>
                    <span className="admin-mesas__label">
                      Mesa seleccionada
                    </span>
                    <h4>Mesa {mesaActiva.numero}</h4>
                  </div>

                  <div className="admin-mesas__detalle-grid">
                    <p>
                      <span>Capacidad</span>
                      <strong>{mesaActiva.capacidad} personas</strong>
                    </p>

                    <p>
                      <span>Ubicación</span>
                      <strong>{mesaActiva.ubicacion}</strong>
                    </p>

                    <p>
                      <span>Estado</span>
                      <strong>
                        {ESTADOS_MESA[mesaActiva.estado]?.texto ||
                          mesaActiva.estado}
                      </strong>
                    </p>
                  </div>

                  {renderAccionesMesa(mesaActiva)}
                </article>
              )}

              <div className="admin-mesas__tabla">
                <table>
                  <thead>
                    <tr>
                      <th>Mesa</th>
                      <th>Capacidad</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {mesas.map(mesa => (
                      <tr key={mesa.id}>
                        <td>
                          <strong>Mesa {mesa.numero}</strong>
                        </td>

                        <td>{mesa.capacidad} personas</td>

                        <td>{mesa.ubicacion}</td>

                        <td>
                          <span
                            className={`admin-mesas__estado admin-mesas__estado--${mesa.estado}`}
                          >
                            {ESTADOS_MESA[mesa.estado]?.texto || mesa.estado}
                          </span>
                        </td>

                        <td>{renderAccionesMesa(mesa)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default AdminMesasPanel;
