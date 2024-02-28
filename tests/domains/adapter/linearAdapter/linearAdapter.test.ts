import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { type RoleRepository } from '@domains/role/repository';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { RoleRepositoryMock } from '../../role/mockRepository/role.repository.mock';
import process from 'process';
import { LinearClient, type LinearFetch, type Team, type User, type UserConnection } from '@linear/sdk';
import teamData from './data/team-data.json';
import membersData from './data/members-data.json';

let mockRepository: RoleRepository;
let mockLinearClient: LinearClient;
let adapter: LinearAdapter;
let team: Team;
let members: UserConnection | PromiseLike<UserConnection>;

describe('Linear Adapter tests', () => {
  before(() => {
    mockRepository = new RoleRepositoryMock();
    mockLinearClient = new LinearClient({ apiKey: process.env.LINEAR_SECRET });
    adapter = new LinearAdapter(mockRepository);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    members = { nodes: [{ id: '1' }, { id: '2' }] };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    team = {
      async members(): LinearFetch<UserConnection> {
        return await members;
      },
      name: 'Tricker',
    };
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  it('Should successfully integrate data', { skip: true }, async () => {
    mock.method(mockLinearClient, 'team').mock.mockImplementation(() => {
      return team;
    });
    mock.method(team, 'members').mock.mockImplementation(() => {
      return members;
    });
    mock.getter(mockLinearClient, 'organization').mock.mockImplementation(() => {
      return { logoUrl: 'url' };
    });

    const receivedProject = await adapter.integrateProjectData('1', '1');

    assert.equal('1', receivedProject.projectId);
  });

  it('Should throw exception when project manager id is not correct', { skip: true }, async () => {
    mock.method(mockLinearClient, 'team').mock.mockImplementation(() => {
      return team;
    });
    mock.method(team, 'members').mock.mockImplementation(() => {
      return members;
    });

    await assert.rejects(
      async () => {
        await adapter.integrateProjectData('8', 'idNull');
      },
      { message: 'Conflict. Provided Project Manager ID not correct.' }
    );
  });
});

describe('getMembersByProjectId', () => {
  it('should return project members for a given project ID', async () => {
    // Given
    const linearProjectId = 'project123';
    const mockTeam = teamData as unknown as Team;
    const mockMembers = membersData as unknown as User[];

    mock.method(mockLinearClient, 'team').mock.mockImplementationOnce(() => mockTeam);
    mock.method(team, 'members').mock.mockImplementation(() => mockMembers);

    // When
    const members = await adapter.getMembersByProjectId(linearProjectId);

    // Then
    assert.strictEqual(members.length, 0);

    // // Verificamos que se llamara al método members() del equipo (team) devuelto por el cliente Linear
    // expect(teamMock.members).toHaveBeenCalled();
    //
    // // Verificamos que los miembros (members) devueltos tengan el formato correcto de ProjectMemberDataDTO
    // expect(result).toEqual([
    //   new ProjectMemberDataDTO({ providerId: 'member1', name: 'Member 1', email: 'member1@example.com' }),
    //   new ProjectMemberDataDTO({ providerId: 'member2', name: 'Member 2', email: 'member2@example.com' }),
    // ]);
  });

  // it('should throw an exception when Linear client encounters an error', async () => {
  //  // Configuramos el cliente Linear mockeado para que devuelva un error
  //  linearClientMock.team.mockRejectedValue(new Error('Linear client error'));
  //
  //  // Datos de prueba
  //  const linearProjectId = 'project123';
  //
  //  // Afirmamos que la función lance una excepción al encontrar un error
  //  await expect(getMembersByProjectId(linearProjectId)).rejects.toThrowError('Linear client error');
  // });

  // Podemos añadir más pruebas para otros casos de prueba según sea necesario
});
