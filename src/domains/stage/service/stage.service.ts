import { type StageDTO } from '@domains/stage/dto';

export interface StageService {
  getOrCreate: (name: string) => Promise<StageDTO>;
}
