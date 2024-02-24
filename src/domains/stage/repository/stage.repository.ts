import { type StageDTO } from '@domains/stage/dto';

export interface StageRepository {
  getByName: (name: string) => Promise<null | StageDTO>;
  create: (name: string) => Promise<StageDTO>;
}
