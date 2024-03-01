// import {before, beforeEach, describe, mock} from 'node:test';
// import {type RoleRepository} from '@domains/role/repository';
// import {LinearAdapter} from '@domains/adapter/linear/linear.adapter';
// import {RoleRepositoryMock} from '../../role/mockRepository/role.repository.mock';
// import process from 'process';
// import {LinearClient, type LinearFetch, type Team, type UserConnection} from '@linear/sdk';
//
// let mockRepository: RoleRepository;
// let mockLinearClient: LinearClient;
// let adapter: LinearAdapter;
// let team: Team;
// let members: UserConnection | Promise<UserConnection>;
//
// describe('Linear Adapter tests', () => {
//     before(() => {
//         mockRepository = new RoleRepositoryMock();
//         mockLinearClient = new LinearClient({apiKey: process.env.LINEAR_SECRET});
//         adapter = new LinearAdapter();
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         members = {nodes: [{id: '1'}, {id: '2'}]};
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         team = {
//             async members(): LinearFetch<UserConnection> {
//                 return members;
//             },
//             name: 'Tricker',
//         };
//     });
//
//     beforeEach(() => {
//         mock.restoreAll();
//     });
//
//     // it('Should successfully integrate data', {skip: true}, async () => {
//     //     mock.method(mockLinearClient, 'team').mock.mockImplementation(() => {
//     //         return team;
//     //     });
//     //     mock.method(team, 'members').mock.mockImplementation(() => {
//     //         return members;
//     //     });
//     //     mock.getter(mockLinearClient, 'organization').mock.mockImplementation(() => {
//     //         return {logoUrl: 'url'};
//     //     });
//     //
//     //     const receivedProject = await adapter.integrateProjectData('1', '1');
//     //
//     //     assert.equal('1', receivedProject.projectId);
//     // });
//     //
//     // it('Should throw exception when project manager id is not correct', {skip: true}, async () => {
//     //     mock.method(mockLinearClient, 'team').mock.mockImplementation(() => {
//     //         return team;
//     //     });
//     //     mock.method(team, 'members').mock.mockImplementation(() => {
//     //         return members;
//     //     });
//     //
//     //     await assert.rejects(
//     //         async () => {
//     //             await adapter.integrateProjectData('8', 'idNull');
//     //         },
//     //         {message: 'Conflict. Provided Project Manager ID not correct.'}
//     //     );
//     // });
// });
