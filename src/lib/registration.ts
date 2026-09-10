export function getActivityButtonLabel(buttonText: string): string {
  const normalized = buttonText.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /^(?:reservar|reserva|inscribirse|inscribete|registrarse|registrate)\b/.test(normalized)
    ? "Regístrate"
    : buttonText;
}
