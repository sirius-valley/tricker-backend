/**
 * @swagger
 * components:
 *   schemas:
 *     TimeTrackingDTO:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: The ID of the time tracking event.
 *          issueId:
 *            type: string
 *            description: The ID of the issue associated with the event.
 *          startTime:
 *            type: string
 *            format: date-time
 *            description: The start time of the event.
 *          endTime:
 *            type: string
 *            format: date-time
 *            nullable: true
 *            description: The end time of the event, or null if not ended yet.
 *        example:
 *          id: "5ebe2152-2f9b-492f-874c-c77ccb1efe20"
 *          issueId: "648b2997-b731-468d-bce7-d213d3f7da93"
 *          startTime: "2024-03-19T12:00:00Z"
 *          endTime: null
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
 * */
