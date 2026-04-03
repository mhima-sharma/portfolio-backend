import prisma from '../config/database.js';

export const createProject = async (profileId, data) => {
  const { technologies, ...projectData } = data;

  const project = await prisma.project.create({
    data: {
      ...projectData,
      profileId,
    },
  });

  if (technologies && technologies.length > 0) {
    await prisma.projectTechnology.createMany({
      data: technologies.map(tech => ({
        projectId: project.id,
        technologyName: tech,
      })),
    });
  }

  return getProjectById(project.id);
};

export const getAllProjects = async (profileId) => {
  const projects = await prisma.project.findMany({
    where: { profileId },
    include: {
      technologies: true,
    },
  });

  return projects.map(project => ({
    ...project,
    technologies: project.technologies.map(t => t.technologyName),
  }));
};

export const getProjectById = async (id, profileId) => {
  const project = await prisma.project.findFirst({
    where: { id, profileId },
    include: {
      technologies: true,
    },
  });

  if (!project) return null;

  return {
    ...project,
    technologies: project.technologies.map(t => t.technologyName),
  };
};

export const updateProject = async (id, profileId, data) => {
  const { technologies, ...projectData } = data;

  // Update project
  const project = await prisma.project.updateMany({
    where: { id, profileId },
    data: projectData,
  });

  if (project.count === 0) {
    throw new Error('Project not found');
  }

  // Update technologies if provided
  if (technologies !== undefined) {
    await prisma.projectTechnology.deleteMany({
      where: { projectId: id },
    });

    if (technologies.length > 0) {
      await prisma.projectTechnology.createMany({
        data: technologies.map(tech => ({
          projectId: id,
          technologyName: tech,
        })),
      });
    }
  }

  return getProjectById(id, profileId);
};

export const deleteProject = async (id, profileId) => {
  return prisma.project.deleteMany({
    where: { id, profileId },
  });
};
