import { type StageService } from '@domains/stage/service/stage.service';
import { type StageRepository } from '@domains/stage/repository/stage.repository';
import { type StageDTO } from '@domains/stage/dto';

export class StageServiceImpl implements StageService {
  constructor(private readonly stageRepository: StageRepository) {}

  async getOrCreate(name: string): Promise<StageDTO> {
    let stage: StageDTO | null = await this.stageRepository.getByName(name);
    if (stage === null) {
      stage = await this.stageRepository.create(name);
    }

    return stage;
  }
}
