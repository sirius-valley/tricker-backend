import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import process from 'process';
import { LinearClient, type LinearFetch, type Team, type UserConnection } from '@linear/sdk';

let mockLinearClient: LinearClient;
let adapter: LinearAdapter;
let team: Team;
let members: UserConnection | PromiseLike<UserConnection>;

describe('Linear Adapter tests', () => {
  before(() => {
    mockLinearClient = new LinearClient({ apiKey: process.env.LINEAR_SECRET });
    adapter = new LinearAdapter();
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

    const receivedProject = await adapter.adaptProjectData({ providerProjectId: 'ppid', pmEmail: 'pm@mail.com', token: 'token', memberMails: ['pm@mail.com'] });

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
        await adapter.adaptProjectData({ providerProjectId: 'ppid', pmEmail: 'pm@mail.com', token: 'token', memberMails: ['pm@mail.com'] });
      },
      { message: 'Conflict. Provided Project Manager ID not correct.' }
    );
  });
});
