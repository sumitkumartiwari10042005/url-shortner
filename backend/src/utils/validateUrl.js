export const isValidUrl = (input) => {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return false;
  }

  let parsed;
  try {
    parsed = new URL(input); 
  } catch {
    return false;
  }

  const allowedProtocols = ['http:', 'https:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    return false;
  }


  if (!parsed.hostname) {
    return false;
  }

  return true;
};