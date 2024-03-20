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
 *           description: "Timer paused succesfully"
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
 *           description: "Entity not found"
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
 *   /api/issue/dev/{userId}/project/{projectId}:
 *     post:
 *       summary: Retrieve and paginate filtered issues for the developer general view of the issues
 *       tags:
 *         - "Issue"
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: The developer ID associated with the issue retrieved
 *           schema:
 *             type: string
 *             format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         - in: path
 *           name: projectId
 *           required: true
 *           description: The project ID associated with the issue retrieved
 *           schema:
 *             type: string
 *             format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DevOptionalIssueFiltersDTO'
 *             example:
 *               stageIds:
 *                 - "123e4567-e89b-12d3-a456-426614174002"
 *                 - "123e4567-e89b-12d3-a456-426614174003"
 *               priorities:
 *                 - "HIGH"
 *                 - "MEDIUM"
 *               isOutOfEstimation: true
 *               cursor: "123e4567-e89b-12d3-a456-426614174004"
 *       responses:
 *         '200':
 *           description: An array of IssueViewDTO representing the filtered and paginated issues
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IssueViewDTO'
 *               example:
 *                 - id: "123e4567-e89b-12d3-a456-426614174005"
 *                   assignee:
 *                     name: "John Doe"
 *                     id: "123e4567-e89b-12d3-a456-426614174006"
 *                     profileUrl: "https://example.com/profiles/johndoe"
 *                   stage:
 *                     id: "123e4567-e89b-12d3-a456-426614174007"
 *                     name: "In Progress"
 *                     type: "IN_PROGRESS"
 *                   name: "Task 1"
 *                   title: "Complete task 1"
 *                   priority: "HIGH"
 *                   storyPoints: 5
 *                   labels:
 *                     - id: "123e4567-e89b-12d3-a456-426614174008"
 *                       name: "Backend"
 *                 - id: "123e4567-e89b-12d3-a456-426614174009"
 *                   assignee: null
 *                   stage: null
 *                   name: "Task 2"
 *                   title: "Complete task 2"
 *                   priority: "MEDIUM"
 *                   storyPoints: null
 *                   labels: []
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /api/issue/pm/{userId}/project/{projectId}:
 *     post:
 *       summary: Retrieve filtered and paginated issues for the project manager general view of the issues.
 *       tags: [Issue]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: The ID of the project manager.
 *           schema:
 *             type: string
 *             format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         - in: path
 *           name: projectId
 *           required: true
 *           description: The ID of the project.
 *           schema:
 *             type: string
 *             format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PMOptionalIssueFiltersDTO'
 *       responses:
 *         '200':
 *           description: Successfully retrieved filtered and paginated issues.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/IssueViewDTO'
 *           examples:
 *             example:
 *               - id: "1"
 *                 assignee:
 *                   id: "1"
 *                   name: "John Doe"
 *                   profileUrl: "https://example.com/profile/1"
 *                 stage:
 *                   id: "1"
 *                   name: "Backlog"
 *                   type: "BACKLOG"
 *                 name: "Issue 1"
 *                 title: "First Issue"
 *                 priority: "HIGH_PRIORITY"
 *                 storyPoints: 5
 *                 labels:
 *                   - id: "101"
 *                     name: "Frontend"
 *                   - id: "102"
 *                     name: "Backend"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /api/issue/{issueId}/add-time:
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
 *   /api/issue/{issueId}/remove-time:
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
 *            description: Manual time modification created successfully.
 *          '400':
 *            description: "Data validation error"
 *            content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/ValidationException'
 *          '401':
 *            $ref: '#/components/responses/UnauthorizedException'
 *          '404':
 *            description: "Entity not found"
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/responses/NotFoundException'
 *          '409':
 *            description: "Inconsistent data"
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: "#/components/responses/ConflictException"
 */
