import { type IntegrationService } from '@domains/integration/service/integration.service';
import { type ProjectDTO } from '@domains/project/dto';
import type { IssueProviderDTO } from 'domains/issueProvider/dto';
import { NotFoundException } from '@utils';
import type { ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import type { ProjectRepository } from '@domains/project/repository';
import type { IssueProviderRepository } from '@domains/issueProvider/repository';
import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(
    private readonly projectTool: ProjectManagementTool,
    private readonly projectRepository: ProjectRepository,
    private readonly issueProviderRepository: IssueProviderRepository
  ) {}

  /**
   * Retrieves projects from the specified provider that have not been integrated yet.
   * @param {string} providerName - The name of the issue provider.
   * @param {string | undefined} secret - (Optional) The secret for accessing the provider.
   * @returns {Promise<ProjectPreIntegratedDTO[]>} A promise that resolves with an array of ProjectPreIntegratedDTO objects representing the projects.
   * @throws {NotFoundException} If the specified issue provider is not found.
   */
  async retrieveProjectsFromProvider(providerName: string, secret?: string | undefined): Promise<ProjectPreIntegratedDTO[]> {
    const provider: IssueProviderDTO | null = await this.issueProviderRepository.getByName(providerName);
    if (provider === null) {
      throw new NotFoundException('IssueProvider');
    }

    const unfilteredProjects: ProjectPreIntegratedDTO[] = await this.projectTool.getProjects(secret);
    const filteredProjects: ProjectPreIntegratedDTO[] = [];
    // retrieve only not integrated projects
    for (const project of unfilteredProjects) {
      const integratedProject: ProjectDTO | null = await this.projectRepository.getByProviderId(project.providerProjectId);
      if (integratedProject === null) {
        filteredProjects.push(project);
      }
    }
    return filteredProjects;
  }
}
