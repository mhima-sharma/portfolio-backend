const DEFAULT_SLUG = 'portfolio';
const MAX_SLUG_LENGTH = 50;
const MIN_SLUG_LENGTH = 3;

export const sanitizeSlug = (value) => {
  const normalized = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-$/g, '');

  if (!normalized) {
    return DEFAULT_SLUG;
  }

  if (normalized.length >= MIN_SLUG_LENGTH) {
    return normalized;
  }

  return `${normalized}${DEFAULT_SLUG}`.slice(0, MAX_SLUG_LENGTH).replace(/-$/g, '');
};

export const generateUniqueSlugCandidate = (baseSlug) => {
  const safeBaseSlug = sanitizeSlug(baseSlug);
  const suffix = String(Math.floor(Math.random() * 900000) + 1000);
  const maxBaseLength = MAX_SLUG_LENGTH - suffix.length - 1;
  const trimmedBase = safeBaseSlug.slice(0, Math.max(MIN_SLUG_LENGTH, maxBaseLength)).replace(/-$/g, '');

  return `${trimmedBase}-${suffix}`;
};
