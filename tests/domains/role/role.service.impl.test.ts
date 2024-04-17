import { type RoleService, RoleServiceImpl } from '@domains/role/service';
import { roleRepositoryMock } from '../mock/mock';
import { mockDevRoleDTO, mockPMRoleDTO } from '../issue/mockData';
import { type RoleDTO } from '@domains/role/dto';

describe('role service tests', () => {
  let roleService: RoleService;

  beforeEach(() => {
    roleService = new RoleServiceImpl(roleRepositoryMock);
    jest.resetAllMocks();
  });

  describe('getRoles method', () => {
    it('should get all roles in the database', async () => {
      // given
      roleRepositoryMock.getRoles.mockResolvedValue([mockDevRoleDTO, mockPMRoleDTO]);
      const expected: RoleDTO[] = [mockDevRoleDTO, mockPMRoleDTO];

      // when
      const received: RoleDTO[] = await roleService.getRoles();

      // then
      expect.assertions(2);
      expect(roleRepositoryMock.getRoles).toHaveBeenCalledTimes(1);
      expect(received.length).toEqual(expected.length);
    });
  });
});
