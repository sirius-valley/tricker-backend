import { type IssueLabelDTO, type IssueLabelInput } from '@domains/issueLabel/dto';

export interface IssueLabelRepository {
  create: (input: IssueLabelInput) => Promise<IssueLabelDTO>;
}
