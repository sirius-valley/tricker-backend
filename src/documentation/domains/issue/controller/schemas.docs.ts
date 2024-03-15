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
 *     UserProjectParamsDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The user ID associated with the issue retrieved.
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: The project ID associated with the issue retrieved.
 *       required:
 *         - userId
 *         - projectId
 *       example:
 *         userId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 *         projectId: "b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q"
 *     OptionalIssueFiltersDTO:
 *       type: object
 *       properties:
 *         stageIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An optional array of stage IDs to filter issues by stage.
 *         priorities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Priority'
 *           description: An optional array of priorities to filter issues by priority level.
 *         assigneeIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An optional array of assignee IDs to filter issues by assignee.
 *         isOutOfEstimation:
 *           type: boolean
 *           description: An optional boolean which defines if issue have been defined or not.
 *         cursor:
 *           type: string
 *           format: uuid
 *           description: An optional issue id which defines the cursor in the pagination.
 *       example:
 *         stageIds:
 *           - "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r"
 *           - "d5e6f7g8-h9i0-j1k2-l3m4n5o6p7q8r9"
 *         priorities:
 *           - HIGH
 *           - LOW
 *         assigneeIds:
 *           - "e5f6g7h8-i9j0-k1l2m3n4o5p6q7r8"
 *         isOutOfEstimation: false
 *         cursor: "f5g6h7i8-j9k0-l1m2n3o4p5q6r7"
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
 *         labels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LabelDTO'
 *           description: The labels associated with the issue.
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
 * */
