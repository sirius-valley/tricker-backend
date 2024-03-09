import { type IssueLabelDTO } from '@domains/issueLabel/dto';

export interface IssueLabelRepository {
  create: (issueId: string, labelId: string) => Promise<IssueLabelDTO>;
}
