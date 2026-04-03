import prisma from '../config/database.js';

export const createSkill = async (profileId, data) => {
  return prisma.skill.create({
    data: {
      ...data,
      profileId,
    },
  });
};

export const getAllSkills = async (profileId) => {
  return prisma.skill.findMany({
    where: { profileId },
  });
};

export const getSkillById = async (id, profileId) => {
  return prisma.skill.findFirst({
    where: { id, profileId },
  });
};

export const updateSkill = async (id, profileId, data) => {
  return prisma.skill.updateMany({
    where: { id, profileId },
    data,
  });
};

export const deleteSkill = async (id, profileId) => {
  return prisma.skill.deleteMany({
    where: { id, profileId },
  });
};
