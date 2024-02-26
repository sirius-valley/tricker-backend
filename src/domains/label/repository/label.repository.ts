import { type LabelDTO } from '@domains/label/dto';

export interface LabelRepository {
  create: (name: string) => Promise<LabelDTO>;
  getByName: (name: string) => Promise<LabelDTO | null>;
}
