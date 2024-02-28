import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { createBlockEvent, filterRelationChanges, getCommentForBlockEvent } from '@domains/adapter/linear/event-util';
import { type Issue, type IssueHistory, type IssueRelationHistoryPayload } from '@linear/sdk';
import { reverseEnumMap } from '@utils/enums';
import issueData from './data/issue-data.json';
import issueHistoryData from './data/issue-history-data.json';
import { TrickerBlockEventType } from '@domains/event/dto';

describe('filterRelationChanges', () => {
  it('should filter changes to blocked_by relations', () => {
    const changes = [
      { identifier: 'PRO-7', type: 'rb' },
      { identifier: 'PRO-1', type: 'ar' },
      { identifier: 'PRO-8', type: 'rb' },
    ] as IssueRelationHistoryPayload[];

    const filteredChanges = filterRelationChanges(changes);

    assert.strictEqual(filteredChanges.length, 2);
    assert.strictEqual(filteredChanges[0].identifier, 'PRO-7');
    assert.strictEqual(filteredChanges[1].identifier, 'PRO-8');
  });

  it('should not filter changes to unrelated relations', () => {
    const changes = [{ identifier: 'PRO-1', type: 'ar' }] as IssueRelationHistoryPayload[];

    const filteredChanges = filterRelationChanges(changes);

    assert.strictEqual(filteredChanges.length, 0);
  });

  it('should handle empty changes array', () => {
    const changes: IssueRelationHistoryPayload[] = [];

    const filteredChanges = filterRelationChanges(changes);

    assert.strictEqual(filteredChanges.length, 0);
  });
});

describe('createBlockEvent', () => {
  it('should create a BlockEventInput for adding a block', () => {
    const issue = issueData as unknown as Issue;
    const event = issueHistoryData[4] as unknown as IssueHistory;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const change = event.relationChanges[0] as unknown as IssueRelationHistoryPayload;

    mock.fn(reverseEnumMap).mock.mockImplementationOnce(() => {
      return 'BLOCKED_BY';
    });

    mock.fn(getCommentForBlockEvent).mock.mockImplementationOnce(() => {
      return 'Blocked by PRO-5';
    });

    const result = createBlockEvent(change, event, issue);

    assert.strictEqual(result.reason, 'Block by other ticket');
    assert.strictEqual(result.providerEventId, event.id);
    assert.strictEqual(result.issueId, issue.id);
    assert.strictEqual(result.type, TrickerBlockEventType.BLOCKED_BY);
    assert.strictEqual(result.userEmitterId, event.actorId);
    assert.strictEqual(result.createdAt, event.createdAt);
  });
});

describe('getCommentForBlockEvent', () => {
  it('should return the comment for adding a block', () => {
    const action = 'a';
    const blockType = 'b';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    assert.strictEqual(result, 'Blocked by PRO-1');
  });

  it('should return the comment for removing a block', () => {
    const action = 'r';
    const blockType = 'b';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    assert.strictEqual(result, 'No longer blocked by PRO-1');
  });

  it('should return the comment for blocking to', () => {
    const action = 'a';
    const blockType = 'x';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    assert.strictEqual(result, 'Blocking to PRO-1');
  });

  it('should return the comment for no longer blocking to', () => {
    const action = 'r';
    const blockType = 'x';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    assert.strictEqual(result, 'No longer blocking to PRO-1');
  });
});
