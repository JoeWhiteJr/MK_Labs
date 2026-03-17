const PASSWORD_RULES_MESSAGE = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';

function isStrongPassword(value) {
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

module.exports = { isStrongPassword, PASSWORD_RULES_MESSAGE };
