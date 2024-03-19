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
 *     ManualTimeModificationRequestDTO:
 *       type: object
 *       properties:
 *         timeAmount:
 *           type: number
 *           format: integer
 *           description: The amount of time to be added or subtracted, in seconds.
 *           example: 3600
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the manual time modification in ISO 8601 format.
 *           example: 2024-03-19T12:00:00Z
 *         reason:
 *           type: string
 *           description: The reason for the manual time modification.
 *           example: "Meeting with client"
 *       required:
 *         - timeAmount
 *         - date
 *         - reason
 * */
