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
 * /api/issues/user/{userId}/project/{projectId}:
 *   get:
 *     summary: Retrieve filtered and paginated issues for a user in a project. Used for general view of the issues.
 *     tags:
 *       - "Issues"
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the user associated with the issues to retrieve.
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the project associated with the issues to retrieve.
 *       - in: query
 *         name: stageIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         description: An optional array of stage IDs to filter issues by stage.
 *       - in: query
 *         name: priorities
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Priority'
 *         description: An optional array of priorities to filter issues by priority level.
 *       - in: query
 *         name: assigneeIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         description: An optional array of assignee IDs to filter issues by assignee.
 *       - in: query
 *         name: isOutOfEstimation
 *         schema:
 *           type: boolean
 *         description: An optional boolean which defines if issue have been defined or not.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: uuid
 *         description: An optional cursor to perform pagination.
 *     responses:
 *       '200':
 *         description: OK. Retrieved filtered and paginated issues successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssueViewDTO'
 *       '400':
 *         $ref: '#/components/responses/ValidationException'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedException'
 *       '404':
 *         $ref: '#/components/responses/NotFoundException'
 *       '500':
 *         $ref: '#/components/responses/InternalServerErrorException'
 */
