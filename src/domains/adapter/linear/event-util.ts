import type { IssueHistory, IssueRelationHistoryPayload } from '@linear/sdk';
import { BlockEventInput, ChangeScalarEventInput, type EventInput, LinearActionTypeConvention, LinearBlockTypeConvention } from '@domains/event/dto';
import { reverseEnumMap } from '@utils/enums';
import { Logger } from '@utils';
import { type processIssueEventsInput } from '@domains/adapter/dto';

/**
 * Processes issue events and adapts them for consumption.
 * @param input The input containing issue history and related data.
 * @returns An array of processed event inputs.
 */
export const processIssueEvents = async (input: processIssueEventsInput): Promise<EventInput[]> => {
  const events: EventInput[] = [];
  for (const event of input.history) {
    if (event.relationChanges !== undefined) {
      const filteredRelationChanges = filterRelationChanges(event.relationChanges);
      for (const change of filteredRelationChanges) {
        const blockEvent = createBlockEvent(change, event, input.linearIssueId);
        events.push(await blockEvent);
      }
    }

    if (event.toStateId !== undefined || event.fromStateId !== undefined) {
      const changeEvent = new ChangeScalarEventInput({
        createdAt: event.createdAt,
        field: 'state',
        from: input.stages.find((stage) => event.fromStateId === stage.id)?.name,
        to: input.stages.find((stage) => event.toStateId === stage.id)?.name,
        issueId: input.linearIssueId,
        providerEventId: event.id,
        // userEmitterEmail: event.actorId! ?? event.botActor?.id, // always going to be one of those
        userEmitterEmail: (await event.actor)?.email,
      });
      events.push(changeEvent);
    }

    if (event.toAssigneeId !== undefined || event.fromAssigneeId !== undefined) {
      const changeEvent = new ChangeScalarEventInput({
        createdAt: event.createdAt,
        field: 'assignee',
        from: input.members.find((member) => event.fromAssigneeId === member.id)?.name,
        to: input.members.find((member) => event.toAssigneeId === member.id)?.name,
        issueId: input.linearIssueId,
        providerEventId: event.id,
        userEmitterEmail: (await event.actor)?.email, // always going to be one of those
      });
      events.push(changeEvent);
    }
  }
  Logger.complete(`Events from linear issue ${input.linearIssueId} have been adapted -- ${new Date().toString()}`);
  return events;
};

export const filterRelationChanges = (changes: IssueRelationHistoryPayload[]): IssueRelationHistoryPayload[] => {
  return changes.filter((change) => {
    const blockType = change.type[1];
    return blockType === LinearBlockTypeConvention.BLOCKED_BY || blockType === LinearBlockTypeConvention.BLOCKING_TO;
  });
};

export const getCommentForBlockEvent = (action: string, blockType: string, identifier: string): string => {
  if (action === LinearActionTypeConvention.ADD) {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Blocked by ${identifier}` : `Blocking to ${identifier}`;
  } else {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `No longer blocked by ${identifier}` : `No longer blocking to ${identifier}`;
  }
};

export const createBlockEvent = async (change: IssueRelationHistoryPayload, event: IssueHistory, issueId: string): Promise<BlockEventInput> => {
  const { type, identifier } = change;
  const [action, blockType] = type;

  const reason = action === LinearActionTypeConvention.ADD ? (blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Block by other ticket` : 'Blocking other ticket') : `-`;

  const dbType = action === LinearActionTypeConvention.ADD ? reverseEnumMap(LinearBlockTypeConvention, blockType) : 'NO_STATUS';

  return new BlockEventInput({
    reason,
    comment: getCommentForBlockEvent(action, blockType, identifier),
    createdAt: event.createdAt,
    issueId,
    providerEventId: event.id,
    type: dbType, // do not know how to get rid of ! op
    userEmitterEmail: (await event.actor)?.email, // always going to be one of those
  });
};
