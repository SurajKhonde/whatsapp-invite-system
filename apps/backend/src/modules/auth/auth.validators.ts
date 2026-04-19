export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  // min 8, at least 1 letter
  const passwordRegex = /^(?=.*[A-Za-z]).{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string) => {
  // only letters + space
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name);
};