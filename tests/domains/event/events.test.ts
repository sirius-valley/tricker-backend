import { filterRelationChanges, getCommentForBlockEvent } from '@domains/adapter/linear/event-util';
import { type IssueRelationHistoryPayload } from '@linear/sdk';

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
