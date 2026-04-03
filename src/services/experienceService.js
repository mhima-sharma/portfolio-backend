import prisma from '../config/database.js';

export const createExperience = async (profileId, data) => {
  return prisma.experience.create({
    data: {
      ...data,
      profileId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
};

export const getAllExperience = async (profileId) => {
  return prisma.experience.findMany({
    where: { profileId },
    orderBy: {
      startDate: 'desc',
    },
  });
};

export const getExperienceById = async (id, profileId) => {
  return prisma.experience.findFirst({
    where: { id, profileId },
  });
};

export const updateExperience = async (id, profileId, data) => {
  const updateData = { ...data };

  if (data.startDate) {
    updateData.startDate = new Date(data.startDate);
  }

  if (data.endDate) {
    updateData.endDate = new Date(data.endDate);
  }

  return prisma.experience.updateMany({
    where: { id, profileId },
    data: updateData,
  });
};

export const deleteExperience = async (id, profileId) => {
  return prisma.experience.deleteMany({
    where: { id, profileId },
  });
};
