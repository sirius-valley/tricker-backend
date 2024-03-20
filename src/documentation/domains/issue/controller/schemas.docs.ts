/**
 * @swagger
 * components:
 *   schemas:
 *     TimeTrackingEventDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the event.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the event.
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the event.
 *         issueId:
 *           type: string
 *           description: The ID of the issue associated with the event.
 *
 *     DevOptionalIssueFiltersDTO:
 *       type: object
 *       properties:
 *         stageIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         priorities:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "HIGH"
 *               - "MEDIUM"
 *               - "LOW"
 *         isOutOfEstimation:
 *           type: boolean
 *         cursor:
 *           type: string
 *           format: uuid
 *       example:
 *         stageIds:
 *           - "123e4567-e89b-12d3-a456-426614174002"
 *           - "123e4567-e89b-12d3-a456-426614174003"
 *         priorities:
 *           - "HIGH"
 *           - "MEDIUM"
 *         isOutOfEstimation: true
 *         cursor: "123e4567-e89b-12d3-a456-426614174004"
 *
 *     PMOptionalIssueFiltersDTO:
 *       type: object
 *       properties:
 *         stageIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         priorities:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "HIGH"
 *               - "MEDIUM"
 *               - "LOW"
 *         isOutOfEstimation:
 *           type: boolean
 *         cursor:
 *           type: string
 *           format: uuid
 *       example:
 *         stageIds:
 *           - "123e4567-e89b-12d3-a456-426614174005"
 *           - "123e4567-e89b-12d3-a456-426614174006"
 *         priorities:
 *           - "HIGH"
 *           - "MEDIUM"
 *         isOutOfEstimation: false
 *         cursor: "123e4567-e89b-12d3-a456-426614174007"
 *
 *     UserProjectParamsDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *       example:
 *         userId: "123e4567-e89b-12d3-a456-426614174008"
 *         projectId: "123e4567-e89b-12d3-a456-426614174009"
 *
 *     IssueViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the issue.
 *         assignee:
 *           $ref: '#/components/schemas/UserIssueDTO'
 *           description: The user assigned to the issue.
 *         stage:
 *           $ref: '#/components/schemas/StageExtendedDTO'
 *           description: The stage of the issue.
 *         name:
 *           type: string
 *           description: The name of the issue.
 *         title:
 *           type: string
 *           description: The title of the issue.
 *         priority:
 *           $ref: '#/components/schemas/Priority'
 *           description: The priority of the issue.
 *         storyPoints:
 *           type: number
 *           nullable: true
 *           description: The story points associated with the issue.
 *         isBlocked:
 *           type: boolean
 *           description: A boolean that defines if the issue is currently blocked
 *         labels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LabelDTO'
 *           description: The labels associated with the issue.
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174010"
 *         assignee:
 *           name: "John Doe"
 *           id: "123e4567-e89b-12d3-a456-426614174011"
 *           profileUrl: "https://example.com/profiles/johndoe"
 *         stage:
 *           id: "123e4567-e89b-12d3-a456-426614174012"
 *           name: "In Progress"
 *           type: "IN_PROGRESS"
 *         name: "Task 1"
 *         title: "Complete task 1"
 *         priority: "HIGH"
 *         storyPoints: 5
 *         isBlocked: false
 *         labels:
 *           - id: "123e4567-e89b-12d3-a456-426614174013"
 *             name: "Bug"
 *
 *     LabelDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the label.
 *         name:
 *           type: string
 *           description: The name of the label.
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174014"
 *         name: "Backend"
 *
 *     StageExtendedDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the stage.
 *         name:
 *           type: string
 *           description: The name of the stage.
 *         type:
 *           $ref: '#/components/schemas/StageType'
 *           description: The type of the stage.
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174015"
 *         name: "In Progress"
 *         type: "STARTED"
 *
 *     Priority:
 *       type: string
 *       enum:
 *         - NO_PRIORITY
 *         - LOW_PRIORITY
 *         - MEDIUM_PRIORITY
 *         - HIGH_PRIORITY
 *         - URGENT
 *       description: Type that represents issue priorities.
 *       example: "HIGH_PRIORITY"
 *
 *     StageType:
 *       type: string
 *       enum:
 *         - BACKLOG
 *         - UNSTARTED
 *         - STARTED
 *         - COMPLETED
 *         - CANCELED
 *         - OTHER
 *       description: Type that represents the current stage of the issue.
 *       example: "UNSTARTED"
 *
 *     UserIssueDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Assignee ID.
 *         name:
 *           type: string
 *           nullable: true
 *           description: Assignee name.
 *         profileUrl:
 *           type: string
 *           nullable: true
 *           description: Profile url.
 *       example:
 *         id: "123456"
 *         name: "John Doe"
 *         profileUrl: "https://example.com/profile/johndoe"
 *
 *     EventHistoryLogDTO:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *           example: "abc123"
 *         message:
 *           type: string
 *           example: "Issue blocked by user"
 *         comment:
 *           type: string
 *           example: "This is a comment explaining why the issue was blocked"
 *         isBlocker:
 *           type: boolean
 *           example: true
 *         time:
 *           type: string
 *           example: "13:45:22"
 *         date:
 *           type: string
 *           example: "2024-03-20"
 *
 *     IssueDetailsDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123456"
 *         assignee:
 *           $ref: "#/components/schemas/UserIssueDTO"
 *         name:
 *           type: string
 *           example: "Issue 1"
 *         title:
 *           type: string
 *           example: "First Issue"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "This is the description of the issue."
 *         priority:
 *           type: string
 *           enum:
 *             - "NO_PRIORITY"
 *             - "LOW_PRIORITY"
 *             - "MEDIUM_PRIORITY"
 *             - "HIGH_PRIORITY"
 *             - "URGENT"
 *           example: "HIGH_PRIORITY"
 *         storyPoints:
 *           type: number
 *           nullable: true
 *           example: 5
 *         isBlocked:
 *           type: boolean
 *           example: false
 *         labels:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LabelDTO"
 *
 *     IssueExtendedDTO:
 *       allOf:
 *         - $ref: "#/components/schemas/IssueDetailsDTO"
 *         - type: object
 *           properties:
 *             chronology:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/EventHistoryLogDTO"
 *
 *     IssueAddBlockerParamsDTO:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           description: The reason for adding the blocker.
 *         comment:
 *           type: string
 *           description: Additional comments about the blocker.
 *       required:
 *         - reason
 *         - comment
 *       example:
 *         reason: Blocked by card TRI-120
 *         comment: Waiting it to be finished
 *
 *     BlockerStatusModificationDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: d4dbf27b-9ed0-4d7f-b6b7-50b5c9aabcde
 *           description: Unique identifier of the modification.
 *         providerEventId:
 *           type: string
 *           nullable: true
 *           example: e12eef67-3b10-4a82-b0fb-6dfac2d9abcd
 *           description: Identifier of the provider event associated with the modification.
 *         userEmitterId:
 *           type: string
 *           nullable: true
 *           example: c8acbf32-5f3a-4e14-8f1c-28e5d0faabcd
 *           description: Identifier of the user who emitted the modification.
 *         issueId:
 *           type: string
 *           example: a6b5e9d3-fc47-4b71-bc81-d6c4f2feabcd
 *           description: Identifier of the issue that is being modified.
 *         status:
 *           type: string
 *           example: Resolved
 *           description: New status of the blocker.
 *         eventRegisteredAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-10T08:15:30Z"
 *           description: Date and time when the event was registered.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-03-10T08:20:45Z"
 *           description: Date and time when the modification was created.
 *         reason:
 *           type: string
 *           example: Resolved after investigation
 *           description: Reason for the modification.
 *         comment:
 *           type: string
 *           example: Blocker was due to misconfiguration in the database server
 *           description: Additional comment related to the modification.
 * */
