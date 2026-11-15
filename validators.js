// Simple validation functions. Each one returns an error message, or null if the input is fine.

function isBlank(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function isValidId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateCostume(body) {
  if (!body || isBlank(body.name)) return 'name is required and must be a non-empty string';
  if (isBlank(body.era)) return 'era is required and must be a non-empty string';
  return null;
}

function validateActor(body) {
  if (!body || isBlank(body.name)) return 'name is required and must be a non-empty string';
  return null;
}

function validateHire(body) {
  if (!body) return 'request body is required';
  if (!isValidId(body.actor_id)) return 'actor_id is required and must be a positive whole number';
  if (!isValidId(body.costume_id)) return 'costume_id is required and must be a positive whole number';
  if (!isValidDate(body.hire_date)) return 'hire_date is required in YYYY-MM-DD format';
  if (!isValidDate(body.due_date)) return 'due_date is required in YYYY-MM-DD format';
  if (body.due_date < body.hire_date) return 'due_date cannot be before hire_date';
  return null;
}

module.exports = { isValidId, validateCostume, validateActor, validateHire };

