import { query } from '../config/mysql.js';

const baseUserSelect = `
  SELECT
    a.id,
    a.name,
    a.email,
    a.profileId,
    a.createdAt,
    a.updatedAt,
    p.slug,
    p.title,
    p.isActive,
    p.selected_theme
  FROM admins a
  INNER JOIN profiles p ON p.id = a.profileId
`;

export const findUserById = async (userId) => {
  const rows = await query(
    `
      ${baseUserSelect}
      WHERE a.id = ? OR p.id = ?
      LIMIT 1
    `,
    [userId, userId]
  );

  return rows[0] || null;
};

export const findUserBySlug = async (slug) => {
  const rows = await query(
    `
      ${baseUserSelect}
      WHERE p.slug = ?
      LIMIT 1
    `,
    [slug]
  );

  return rows[0] || null;
};

export const updateUserThemeById = async (userId, selectedTheme) => {
  const result = await query(
    `
      UPDATE profiles p
      INNER JOIN admins a ON a.profileId = p.id
      SET p.selected_theme = ?
      WHERE a.id = ? OR p.id = ?
    `,
    [selectedTheme, userId, userId]
  );

  return result;
};

export const updateUserThemeBySlug = async (slug, selectedTheme) => {
  const result = await query(
    `
      UPDATE profiles
      SET selected_theme = ?
      WHERE slug = ?
    `,
    [selectedTheme, slug]
  );

  return result;
};
