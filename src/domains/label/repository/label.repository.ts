import { type LabelDTO } from '@domains/label/dto';

export interface LabelRepository {
  create: (name: string, providerId: string, projectId: string) => Promise<LabelDTO>;
}
