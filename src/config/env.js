const createConfigError = (message) => {
  const error = new Error(message);
  error.code = 'CONFIG_ERROR';
  return error;
};

export const getRequiredEnv = (key) => {
  const value = process.env[key];

  if (!value || !String(value).trim()) {
    throw createConfigError(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const assertRequiredEnv = (keys) => {
  keys.forEach(getRequiredEnv);
};
