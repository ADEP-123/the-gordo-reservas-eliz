function MesaVisual({ capacidad = 2, estado = "disponible" }) {
  const cantidadSillas = Math.max(1, Number(capacidad) || 1);

  const sillas = Array.from({ length: cantidadSillas }, (_, index) => {
    const angulo = -90 + (360 / cantidadSillas) * index;

    return {
      id: index,
      angulo,
      anguloInverso: -angulo,
    };
  });

  return (
    <div className={`mesa-visual mesa-visual--${estado}`}>
      {sillas.map(silla => (
        <span
          key={silla.id}
          className="mesa-visual__silla"
          style={{
            "--angulo": `${silla.angulo}deg`,
            "--angulo-inverso": `${silla.anguloInverso}deg`,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="mesa-visual__mesa">
        <span className="mesa-visual__brillo" />
      </div>
    </div>
  );
}

export default MesaVisual;
