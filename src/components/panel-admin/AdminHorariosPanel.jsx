import { useEffect, useMemo, useState } from "react";
import {
  DIAS_SEMANA_ADMIN,
  FORM_HORARIO_INICIAL,
} from "../../data/panel-admin/horariosAdminConfig";
import useAdminHorarios from "../../hooks/panel-admin/useAdminHorarios";
import "../../styles/panel-admin/adminHorariosPanel.css";

function obtenerLabelDia(diaSemana) {
  return (
    DIAS_SEMANA_ADMIN.find(dia => dia.id === diaSemana)?.label || diaSemana
  );
}

function AdminHorariosPanel() {
  const {
    horarios,
    horariosPorDia,
    cargandoHorarios,
    guardandoHorario,
    errorHorarios,
    guardarHorario,
    cambiarEstadoHorario,
  } = useAdminHorarios();

  const [formData, setFormData] = useState(FORM_HORARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [diaActivo, setDiaActivo] = useState("lunes");

  const horarioActivo = useMemo(() => {
    return horariosPorDia[diaActivo] || null;
  }, [horariosPorDia, diaActivo]);

  useEffect(() => {
    const horario = horariosPorDia[diaActivo];

    if (horario) {
      setFormData({
        id: horario.id,
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio?.slice(0, 5) || "12:00",
        hora_fin: horario.hora_fin?.slice(0, 5) || "22:00",
        activo: Boolean(horario.activo),
      });
      return;
    }

    setFormData({
      ...FORM_HORARIO_INICIAL,
      dia_semana: diaActivo,
    });
  }, [diaActivo, horariosPorDia]);

  const handleChange = event => {
    const { name, value, type, checked } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.dia_semana) {
      nuevosErrores.dia_semana = "Selecciona un día.";
    }

    if (!formData.hora_inicio) {
      nuevosErrores.hora_inicio = "Selecciona la hora de apertura.";
    }

    if (!formData.hora_fin) {
      nuevosErrores.hora_fin = "Selecciona la hora de cierre.";
    }

    if (
      formData.hora_inicio &&
      formData.hora_fin &&
      formData.hora_fin <= formData.hora_inicio
    ) {
      nuevosErrores.hora_fin =
        "La hora de cierre debe ser mayor a la hora de apertura.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const guardado = await guardarHorario(formData);

    if (guardado) {
      setErrores({});
    }
  };

  const alternarEstadoDia = async (dia, horario) => {
    if (horario) {
      await cambiarEstadoHorario(horario, !horario.activo);
      return;
    }

    await guardarHorario({
      ...FORM_HORARIO_INICIAL,
      dia_semana: dia.id,
      activo: true,
    });

    setDiaActivo(dia.id);
  };

  return (
    <section className="admin-horarios">
      {errorHorarios && (
        <div className="admin-horarios__error">{errorHorarios}</div>
      )}

      <section className="admin-horarios__layout">
        <form className="admin-horarios__form" onSubmit={handleSubmit}>
          <span className="admin-horarios__label">Editar horario</span>

          <h3>{obtenerLabelDia(formData.dia_semana)}</h3>

          <div className="admin-horarios__grupo">
            <label htmlFor="dia_semana">Día</label>
            <select
              id="dia_semana"
              name="dia_semana"
              value={formData.dia_semana}
              onChange={event => {
                setDiaActivo(event.target.value);
                handleChange(event);
              }}
            >
              {DIAS_SEMANA_ADMIN.map(dia => (
                <option key={dia.id} value={dia.id}>
                  {dia.label}
                </option>
              ))}
            </select>
            {errores.dia_semana && <small>{errores.dia_semana}</small>}
          </div>

          <div className="admin-horarios__fila">
            <div className="admin-horarios__grupo">
              <label htmlFor="hora_inicio">Apertura</label>
              <input
                id="hora_inicio"
                name="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={handleChange}
              />
              {errores.hora_inicio && <small>{errores.hora_inicio}</small>}
            </div>

            <div className="admin-horarios__grupo">
              <label htmlFor="hora_fin">Cierre</label>
              <input
                id="hora_fin"
                name="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={handleChange}
              />
              {errores.hora_fin && <small>{errores.hora_fin}</small>}
            </div>
          </div>

          <label className="admin-horarios__switch">
            <input
              name="activo"
              type="checkbox"
              checked={formData.activo}
              onChange={handleChange}
            />
            <span>{formData.activo ? "Día activo" : "Día inactivo"}</span>
          </label>

          <button
            type="submit"
            className="admin-horarios__btn admin-horarios__btn--principal"
            disabled={guardandoHorario}
          >
            {guardandoHorario ? "Guardando..." : "Guardar horario"}
          </button>
        </form>

        <section className="admin-horarios__card">
          <div className="admin-horarios__card-header">
            <div>
              <span className="admin-horarios__label">Semana</span>
              <h3>Horarios registrados</h3>
            </div>
          </div>

          {cargandoHorarios ? (
            <div className="admin-horarios__empty">Cargando horarios...</div>
          ) : horarios.length === 0 ? (
            <div className="admin-horarios__empty">
              Todavía no hay horarios registrados.
            </div>
          ) : (
            <div className="admin-horarios__lista">
              {DIAS_SEMANA_ADMIN.map(dia => {
                const horario = horariosPorDia[dia.id];

                return (
                  <article
                    key={dia.id}
                    className={`admin-horarios__item ${
                      diaActivo === dia.id ? "admin-horarios__item--activo" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="admin-horarios__item-main"
                      onClick={() => setDiaActivo(dia.id)}
                    >
                      <span>{dia.label}</span>

                      <strong>
                        {horario
                          ? `${horario.hora_inicio?.slice(0, 5)} - ${horario.hora_fin?.slice(0, 5)}`
                          : "Sin horario"}
                      </strong>
                    </button>

                    <button
                      type="button"
                      className={`admin-horarios__estado-pill ${
                        horario?.activo
                          ? "admin-horarios__estado-pill--activo"
                          : "admin-horarios__estado-pill--inactivo"
                      }`}
                      onClick={() => alternarEstadoDia(dia, horario)}
                      disabled={guardandoHorario}
                      title={
                        horario?.activo
                          ? "Haz clic para desactivar este día"
                          : "Haz clic para activar este día"
                      }
                    >
                      <span aria-hidden="true" />
                      {horario?.activo ? "Activo" : "Inactivo"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </section>
  );
}

export default AdminHorariosPanel;
