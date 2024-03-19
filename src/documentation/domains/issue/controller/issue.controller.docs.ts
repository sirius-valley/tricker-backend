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
 *   /issues/{issueId}/add-time:
 *     post:
 *       summary: Create manual time modification for an issue.
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       description: Creates a manual time modification event for adding worked time to an issue.
 *       parameters:
 *         - in: path
 *           name: issueId
 *           required: true
 *           description: The ID of the issue.
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           required: true
 *           description: Input data for manual time modification.
 *           schema:
 *             $ref: '#/components/schemas/ManualTimeModificationRequestDTO'
 *       responses:
 *         '200':
 *           description: Manual time modification created successfully.
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /issues/{issueId}/remove-time:
 *     post:
 *       summary: Creates manual time modification for an issue.
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       description: Creates a manual time modification event to subtract worked time from an issue.
 *       parameters:
 *         - in: path
 *           name: issueId
 *           required: true
 *           description: The ID of the issue.
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           required: true
 *           description: Input data for manual time modification removal.
 *           schema:
 *             $ref: '#/components/schemas/ManualTimeModificationRequestDTO'
 *       responses:
 *          '200':
 *           description: Manual time modification created successfully.
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 */
