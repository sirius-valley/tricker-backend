import type { Issue, IssueHistory, IssueRelationHistoryPayload } from '@linear/sdk';
import { BlockEventInput, ChangeScalarEventInput, type EventInput, LinearActionTypeConvention, LinearBlockTypeConvention } from '@domains/event/dto';
import { reverseEnumMap } from '@utils/enums';

export const processIssueEvents = async (issue: Issue): Promise<EventInput[]> => {
  const history = (await issue.history()).nodes;
  const events: EventInput[] = [];
  for (const event of history) {
    const filteredRelationChanges = filterRelationChanges(event);
    for (const change of filteredRelationChanges) {
      const { type, identifier } = change;
      const [action, blockType] = type;

      const blockEvent = createBlockEvent(action, blockType, identifier, event, issue);
      events.push(blockEvent);
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

export const filterRelationChanges = (event: IssueHistory): IssueRelationHistoryPayload[] => {
  if (event.relationChanges !== undefined) {
    if (event.relationChanges.length !== 0) {
      return [];
    }
    return event.relationChanges.filter((change) => {
      const blockType = change.type[1];
      return blockType === LinearBlockTypeConvention.BLOCKED_BY || blockType === LinearBlockTypeConvention.BLOCKING_TO;
    });
  } else {
    return [];
  }
};

export const createBlockEvent = (action: string, blockType: string, identifier: string, event: IssueHistory, issue: Issue): BlockEventInput => {
  const reason = action === LinearActionTypeConvention.ADD ? (blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Block by other ticket` : 'Blocking other ticket') : `-`;

  const type = action === LinearActionTypeConvention.ADD ? reverseEnumMap(LinearBlockTypeConvention, blockType) : 'NO_STATUS';

  return new BlockEventInput({
    reason,
    comment: getCommentForBlockEvent(action, blockType, identifier),
    createdAt: event.createdAt,
    issueId: issue.id,
    providerEventId: event.id,
    type, // do not know how to get rid of ! op
    userEmitterId: event.actorId! ?? event.botActor?.id, // always going to be one of those
  });
};

export const getCommentForBlockEvent = (action: string, blockType: string, identifier: string): string => {
  if (action === LinearActionTypeConvention.ADD) {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `Blocked by ${identifier}` : `Blocking to ${identifier}`;
  } else {
    return blockType === LinearBlockTypeConvention.BLOCKED_BY ? `No longer blocked by ${identifier}` : `No longer blocking to ${identifier}`;
  }
};
