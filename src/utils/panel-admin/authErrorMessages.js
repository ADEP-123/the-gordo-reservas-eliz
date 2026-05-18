export function obtenerMensajeErrorAuth(error) {
  if (!error) return "Ocurrió un error inesperado.";

  const code = error.code;

  if (code === "same_password") {
    return "La nueva contraseña debe ser diferente a la contraseña actual.";
  }

  if (code === "weak_password") {
    return "La contraseña no cumple la política de seguridad configurada en Supabase.";
  }

  if (code === "session_expired" || code === "session_not_found") {
    return "El enlace de recuperación expiró o ya fue usado. Solicita uno nuevo.";
  }

  if (code === "flow_state_expired" || code === "flow_state_not_found") {
    return "El enlace de recuperación ya no es válido. Solicita uno nuevo.";
  }

  if (code === "over_email_send_rate_limit") {
    return "Se enviaron demasiados correos. Espera un momento antes de intentarlo otra vez.";
  }

  if (code === "over_request_rate_limit") {
    return "Hay demasiados intentos. Espera unos minutos antes de volver a probar.";
  }

  if (code === "validation_failed") {
    return "Revisa los datos ingresados e intenta nuevamente.";
  }

  return error.message || "No fue posible completar la acción.";
}
