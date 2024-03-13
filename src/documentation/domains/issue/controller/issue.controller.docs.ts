/**
 * @swagger
 * paths:
 *   /api/issue/{issueId}/pause:
 *     get:
 *       summary: Pause Timer for an Issue
 *       tags:
 *         - Issue
 *       description: Pause the timer for a specific issue.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - $ref: '#/components/parameters/IssuePauseParams'
 *       responses:
 *         '200':
 *           description: "Successful operation"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/TimeTrackingEventDTO'
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
 *   /api/issue/{issueId}/worked-time:
 *     get:
 *       summary: Retrieve worked seconds for a specific issue.
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: issueId
 *           schema:
 *             $ref: '#/components/parameters/IssueWorkedTimeParamsDTO'
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
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *           components:
 */
