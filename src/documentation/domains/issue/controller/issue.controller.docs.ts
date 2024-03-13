/**
 * @swagger
 * components:
 *   schemas:
 *     TimeTrackingEvent:
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
 *   parameters:
 *     IssueIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The ID of the issue to pause the timer for.
 *     IssueWorkedTimeParamsDTO:
 *       in: path
 *       name: issueId
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: The issue id to retrieve its worked time.
 * paths:
 *   /api/issue/{id}/pause:
 *     get:
 *       summary: Pause Timer for an Issue
 *       tags:
 *         - Issue
 *       description: Pause the timer for a specific issue.
 *       parameters:
 *         - $ref: '#/components/parameters/IssueIdParam'
 *       responses:
 *         '200':
 *           description: "Successful operation"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/TimeTrackingEvent'
 *         '400':
 *           description: "Data validation error"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/ValidationException'
 *         '404':
 *           description: "Inconsistent data"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/NotFoundException'
 *         '409':
 *           description: "Inconsistent data"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/responses/ConflictException"
 *   /api/{issueId}/worked-time:
 *     get:
 *       summary: Retrieve worked seconds for a specific issue.
 *       tags:
 *         - "Issue"
 *       parameters:
 *         - in: path
 *           name: issueId
 *           schema:
 *             $ref: '#/components/schemas/IssueWorkedTimeParamsDTO'
 *           required: true
 *           description: The ID of the issue to retrieve worked seconds for
 *       responses:
 *         '200':
 *           description: Issue worked seconds retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: number
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 */
