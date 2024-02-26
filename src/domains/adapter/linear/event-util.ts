import type { Issue, IssueHistory, IssueRelationHistoryPayload } from '@linear/sdk';
import { BlockEventInput, ChangeScalarEventInput, type EventInput, LinearActionTypeConvention, LinearBlockTypeConvention } from '@domains/event/dto';
import { reverseEnumMap } from '@utils/enums';

export const processIssueEvents = async (issue: Issue): Promise<EventInput[]> => {
  const history = (await issue.history()).nodes;
  const events: EventInput[] = [];
  for (const event of history) {
    if (event.relationChanges !== undefined) {
      const filteredRelationChanges = filterRelationChanges(event.relationChanges);
      for (const change of filteredRelationChanges) {
        const blockEvent = createBlockEvent(change, event, issue);
        events.push(blockEvent);
      }
    }

    if (event.toStateId !== undefined || event.fromStateId !== undefined) {
      const changeEvent = new ChangeScalarEventInput({
        createdAt: event.createdAt,
        field: 'state',
        from: event.fromStateId,
        to: event.toStateId,
        issueId: issue.id,
        providerEventId: event.id,
        userEmitterId: event.actorId! ?? event.botActor?.id, // always going to be one of those
      });
      events.push(changeEvent);
    }

    if (event.toAssigneeId !== undefined || event.fromAssigneeId !== undefined) {
      const changeEvent = new ChangeScalarEventInput({
        createdAt: event.createdAt,
        field: 'assignee',
        from: event.fromAssigneeId,
        to: event.toAssigneeId,
        issueId: issue.id,
        providerEventId: event.id,
        userEmitterId: event.actorId! ?? event.botActor?.id, // always going to be one of those
      });
      events.push(changeEvent);
    }
  }
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

export const createBlockEvent = (change: IssueRelationHistoryPayload, event: IssueHistory, issue: Issue): BlockEventInput => {
  const { type, identifier } = change;
  const [action, blockType] = type;

  const reason = action === LinearActionTypeConvention.ADD ? (blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Block by other ticket` : 'Blocking other ticket') : `-`;

  const dbType = action === LinearActionTypeConvention.ADD ? reverseEnumMap(LinearBlockTypeConvention, blockType) : 'NO_STATUS';

  return new BlockEventInput({
    reason,
    comment: getCommentForBlockEvent(action, blockType, identifier),
    createdAt: event.createdAt,
    issueId: issue.id,
    providerEventId: event.id,
    type: dbType, // do not know how to get rid of ! op
    userEmitterId: event.actorId! ?? event.botActor?.id, // always going to be one of those
  });
};
