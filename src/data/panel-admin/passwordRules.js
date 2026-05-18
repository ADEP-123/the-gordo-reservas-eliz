export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_RULES = [
  {
    id: "length",
    label: `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`,
    test: password => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "lowercase",
    label: "Al menos una letra minúscula",
    test: password => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Al menos una letra mayúscula",
    test: password => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Al menos un número",
    test: password => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "Al menos un símbolo",
    test: password => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  },
];
