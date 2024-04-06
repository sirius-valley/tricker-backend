import type { IssueHistory, IssueRelationHistoryPayload, User } from '@linear/sdk';
import { BlockEventData, ChangeScalarEventData, type EventData, LinearActionTypeConvention, LinearBlockTypeConvention } from '@domains/event/dto';
import { reverseEnumMap } from '@utils/enums';
import { type processIssueEventsInput } from '@domains/adapter/dto';

/**
 * Processes issue events and adapts them for consumption.
 * @param input The input containing issue history and related data.
 * @returns An array of processed event inputs.
 */
export const processIssueEvents = async (input: processIssueEventsInput): Promise<EventData[]> => {
  const events: EventData[] = [];
  for (const event of input.history) {
    const actor = await event.actor;

    if (event.relationChanges !== undefined) {
      const filteredRelationChanges = filterRelationChanges(event.relationChanges);
      for (const change of filteredRelationChanges) {
        const blockEvent = await createBlockEvent(change, event, actor);
        events.push(blockEvent);
      }
    }

    if (event.toStateId !== undefined || event.fromStateId !== undefined) {
      const changeEvent = new ChangeScalarEventData({
        createdAt: event.createdAt,
        field: 'state',
        from: input.stages.find((stage) => event.fromStateId === stage.id)?.name,
        to: input.stages.find((stage) => event.toStateId === stage.id)?.name,
        providerEventId: event.id,
        userEmitterEmail: actor !== undefined ? actor.email : null,
      });
      events.push(changeEvent);
    }

    if (event.toAssigneeId !== undefined || event.fromAssigneeId !== undefined) {
      const changeEvent = new ChangeScalarEventData({
        createdAt: event.createdAt,
        field: 'assignee',
        from: input.members.find((member) => event.fromAssigneeId === member.id)?.email,
        to: input.members.find((member) => event.toAssigneeId === member.id)?.email,
        providerEventId: event.id,
        userEmitterEmail: actor !== undefined ? actor.email : null,
      });
      events.push(changeEvent);
    }
  }
  return events;
};

export const filterRelationChanges = (changes: IssueRelationHistoryPayload[]): IssueRelationHistoryPayload[] => {
  return changes.filter((change) => {
    const blockType = change.type;
    return blockType.includes(LinearBlockTypeConvention.BLOCKED_BY) || blockType.includes(LinearBlockTypeConvention.BLOCKING_TO);
  });
};

export const getCommentForBlockEvent = (action: string, blockType: string, identifier: string): string => {
  if (action === LinearActionTypeConvention.ADD_IMPLICIT || action === LinearActionTypeConvention.ADD_EXPLICIT) {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Blocked by ${identifier}` : `Blocking to ${identifier}`;
  } else {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `No longer blocked by ${identifier}` : `No longer blocking to ${identifier}`;
  }
};

export const createBlockEvent = async (change: IssueRelationHistoryPayload, event: IssueHistory, actor: User | undefined): Promise<BlockEventData> => {
  const { type, identifier } = change;
  const [action, blockType] = type.startsWith(LinearBlockTypeConvention.BLOCKING_TO) || type.startsWith(LinearBlockTypeConvention.BLOCKED_BY) ? type.split('').reduce((reversed, char) => char + reversed, '') : type;

  const reason = action === LinearActionTypeConvention.ADD_EXPLICIT || action === LinearActionTypeConvention.ADD_IMPLICIT ? (blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Blocked by other ticket` : 'Blocking other ticket') : `Blocking issue completed`;

  const dbType = action === LinearActionTypeConvention.ADD_IMPLICIT || action === LinearActionTypeConvention.ADD_EXPLICIT ? reverseEnumMap(LinearBlockTypeConvention, blockType) : 'NO_STATUS';

  return new BlockEventData({
    reason,
    comment: getCommentForBlockEvent(action, blockType, identifier),
    createdAt: event.createdAt,
    providerEventId: event.id,
    type: dbType,
    userEmitterEmail: actor !== undefined ? actor.email : null,
  });
};
