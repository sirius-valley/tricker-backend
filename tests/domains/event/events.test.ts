import { createBlockEvent, filterRelationChanges, getCommentForBlockEvent } from '@domains/adapter/linear/event-util';
import { type Issue, type IssueHistory, type IssueRelationHistoryPayload } from '@linear/sdk';
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

    expect(filteredChanges.length).toBe(2);
    expect(filteredChanges[0].identifier).toBe('PRO-7');
    expect(filteredChanges[1].identifier).toBe('PRO-8');
  });

  it('should not filter changes to unrelated relations', () => {
    const changes = [{ identifier: 'PRO-1', type: 'ar' }] as IssueRelationHistoryPayload[];

    const filteredChanges = filterRelationChanges(changes);

    expect(filteredChanges.length).toBe(0);
  });

  it('should handle empty changes array', () => {
    const changes: IssueRelationHistoryPayload[] = [];

    const filteredChanges = filterRelationChanges(changes);

    expect(filteredChanges.length).toBe(0);
  });
});

const eventUtilMock = {
  reverseEnumMap: jest.fn(),
  getCommentForBlockEvent: jest.fn(),
};
jest.mock('@domains/adapter/linear/event-util', () => eventUtilMock);

describe('createBlockEvent', () => {
  it('should create a BlockEventInput for adding a block', async () => {
    const issue = issueData as unknown as Issue;
    const event = issueHistoryData[4] as unknown as IssueHistory;
    const change = event.relationChanges![0] as unknown as IssueRelationHistoryPayload;

    eventUtilMock.reverseEnumMap.mockReturnValueOnce('BLOCKED_BY');
    eventUtilMock.getCommentForBlockEvent.mockReturnValueOnce('Blocked by PRO-5');

    const result = await createBlockEvent(change, event, issue.id);

    expect(result.reason).toBe('Block by other ticket');
    expect(result.providerEventId).toBe(event.id);
    expect(result.issueId).toBe(issue.id);
    expect(result.type).toBe(TrickerBlockEventType.BLOCKED_BY);
    // expect(result.userEmitterId).toBe(event.actorId);
    expect(result.createdAt).toBe(event.createdAt);
  });
});

describe('getCommentForBlockEvent', () => {
  it('should return the comment for adding a block', () => {
    const action = 'a';
    const blockType = 'b';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    expect(result).toBe('Blocked by PRO-1');
  });

  it('should return the comment for removing a block', () => {
    const action = 'r';
    const blockType = 'b';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    expect(result).toBe('No longer blocked by PRO-1');
  });

  it('should return the comment for blocking to', () => {
    const action = 'a';
    const blockType = 'x';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    expect(result).toBe('Blocking to PRO-1');
  });

  it('should return the comment for no longer blocking to', () => {
    const action = 'r';
    const blockType = 'x';
    const identifier = 'PRO-1';

    const result = getCommentForBlockEvent(action, blockType, identifier);

    expect(result).toBe('No longer blocking to PRO-1');
  });
});
