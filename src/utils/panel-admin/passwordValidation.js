import { PASSWORD_RULES } from "../../data/panel-admin/passwordRules";

export function evaluarReglasPassword(password = "") {
  return PASSWORD_RULES.map(rule => ({
    ...rule,
    valido: rule.test(password),
  }));
}

export function passwordCumpleReglas(password = "") {
  return evaluarReglasPassword(password).every(rule => rule.valido);
}

export function passwordsCoinciden(password = "", confirmPassword = "") {
  return password.length > 0 && password === confirmPassword;
}

export function validarCambioPassword({ password, confirmPassword }) {
  if (!password.trim() || !confirmPassword.trim()) {
    return "Completa ambos campos.";
  }

  if (!passwordCumpleReglas(password)) {
    return "La contraseña todavía no cumple todos los requisitos.";
  }

  if (!passwordsCoinciden(password, confirmPassword)) {
    return "Las contraseñas no coinciden.";
  }

  return "";
}
