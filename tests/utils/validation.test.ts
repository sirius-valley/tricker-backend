import { type Request, type Response } from 'express';
import { validateRequest, validateUserIsProjectManager, ValidationException, userProjectRoleRepository, roleRepository, ForbiddenException, NotFoundException } from '@utils';
import { IsString, IsNumber } from 'class-validator';
import { mockDevRoleDTO, mockPMRoleDTO, mockUserProjectRoleDTO } from '../domains/issue/mockData';
import { type UserProjectParamsDTO } from '@domains/issue/dto';

class TargetClass {
  @IsString()
  city: string;

  constructor(city: string) {
    this.city = city;
  }
}

class ExtendedTargetClass extends TargetClass {
  @IsNumber()
  num: number;

  constructor(city: string, num: number) {
    super(city);
    this.num = num;
  }
}

describe('validations tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should successfully validate class', async () => {
    const req = {
      body: {
        city: 'city',
      },
    } as unknown as Request;

    const res = {} as unknown as Response;
    const next = jest.fn();

    await validateRequest(TargetClass, 'body')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toBeInstanceOf(TargetClass);
    expect(req.body.city).toBe('city');
  });

  it('Should throw exception when validating class', async () => {
    const req = {
      body: {
        city: 1,
      },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    await expect(validateRequest(ExtendedTargetClass, 'body')(req, res, next)).rejects.toThrow(ValidationException);
    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe('validateUserIsProjectManager middleware', () => {
  const req: Request<UserProjectParamsDTO> = {
    params: {
      userId: 'user123',
      projectId: 'Project777',
    },
  } as unknown as Request<UserProjectParamsDTO>;

  const res = {} as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully validate user is a Project Manager', async (): Promise<void> => {
    // given
    jest.spyOn(userProjectRoleRepository, 'getByProjectIdAndUserId').mockResolvedValue(mockUserProjectRoleDTO);
    jest.spyOn(roleRepository, 'getById').mockResolvedValue(mockPMRoleDTO);

    // when
    await validateUserIsProjectManager()(req, res, next);

    // then
    expect(next).toHaveBeenCalled();
  });

  it('should throw NotFoundException when userProjectRole has not been found', async (): Promise<void> => {
    // given - when
    jest.spyOn(userProjectRoleRepository, 'getByProjectIdAndUserId').mockResolvedValue(null);
    // then
    expect.assertions(1);
    await expect(validateUserIsProjectManager()(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when Role has not been found', async (): Promise<void> => {
    // given - when
    jest.spyOn(userProjectRoleRepository, 'getByProjectIdAndUserId').mockResolvedValue(mockUserProjectRoleDTO);
    jest.spyOn(roleRepository, 'getById').mockResolvedValue(null);
    // then
    expect.assertions(1);
    await expect(validateUserIsProjectManager()(req, res, next)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when user is not a Project Manager', async (): Promise<void> => {
    // given
    jest.spyOn(userProjectRoleRepository, 'getByProjectIdAndUserId').mockResolvedValue(mockUserProjectRoleDTO);
    // when
    jest.spyOn(roleRepository, 'getById').mockResolvedValue(mockDevRoleDTO);
    // then
    expect.assertions(1);
    await expect(validateUserIsProjectManager()(req, res, next)).rejects.toThrow(ForbiddenException);
  });
});
