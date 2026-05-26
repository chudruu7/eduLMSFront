export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequiredFields = (fields, requiredFields) => {
  const missingFields = requiredFields.filter(field => !fields[field]);
  return missingFields;
};