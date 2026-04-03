import prisma from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils.js';
import { sanitizeSlug, generateUniqueSlugCandidate } from '../utils/slugUtils.js';

const isSlugUniqueConstraintError = (error) => {
  if (error.code !== 'P2002') {
    return false;
  }

  const targets = Array.isArray(error.meta?.target)
    ? error.meta.target
    : [error.meta?.target].filter(Boolean);

  return targets.some(target => String(target).toLowerCase().includes('slug'));
};

const buildUniqueProfileSlug = async (requestedSlug, name) => {
  let candidate = sanitizeSlug(requestedSlug || name);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const existingProfile = await prisma.profile.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existingProfile) {
      return candidate;
    }

    candidate = generateUniqueSlugCandidate(requestedSlug || name);
  }

  throw new Error('Unable to generate unique slug');
};

export const loginAdmin = async (email, password) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(admin.id, admin.profileId);

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      profileId: admin.profileId,
    },
    profile: admin.profile
      ? {
          id: admin.profile.id,
          name: admin.profile.name,
          slug: admin.profile.slug,
          title: admin.profile.title,
        }
      : null,
  };
};

export const createUserWithProfile = async (name, email, password, slug, title) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(password);
  let lastError;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const uniqueSlug = await buildUniqueProfileSlug(slug, name);

    try {
      const { admin, profile } = await prisma.$transaction(async (tx) => {
        const profileRecord = await tx.profile.create({
          data: {
            name,
            slug: uniqueSlug,
            title,
            email,
            isActive: true,
          },
        });

        const adminRecord = await tx.admin.create({
          data: {
            name,
            email,
            passwordHash,
            profileId: profileRecord.id,
          },
        });

        return {
          admin: adminRecord,
          profile: profileRecord,
        };
      });

      const token = generateToken(admin.id, profile.id);

      return {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          profileId: profile.id,
        },
        profile: {
          id: profile.id,
          name: profile.name,
          slug: profile.slug,
          title: profile.title,
        },
      };
    } catch (error) {
      if (isSlugUniqueConstraintError(error)) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  if (lastError) {
    throw new Error('Unable to generate unique slug');
  }
  
  throw new Error('Unable to generate unique slug');
};

export const getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileId: true,
      profile: {
        select: {
          id: true,
          name: true,
          slug: true,
          title: true,
        },
      },
    },
  });

  return admin;
};
