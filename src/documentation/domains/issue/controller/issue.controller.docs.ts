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
 *
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
 *
 *   /api/issue/{issueId}/flag/add:
 *     post:
 *       summary: Flag an issue as blocked.
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: "path"
 *           name: "issueId"
 *           description: "The ID of the issue to flag."
 *           required: true
 *           type: "string"
 *           example: "b6b04c2d-5e2c-4dcb-8ce3-2d5d98d10ade"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/IssueAddBlockerParamsDTO"
 *             example:
 *               reason: "Blocked by card b6b04c2d-5e2c-4dcb-8ce3-2d5d98d10eru"
 *               comment: "Waiting for resolution"
 *       responses:
 *         200:
 *           description: "Issue successfully flagged as blocked."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/IssueExtendedDTO"
 *           examples:
 *             application/json:
 *               id: a3d3c9ff-7b46-4d2d-bd73-e3a6ec6c2547
 *               assignee:
 *                 id: 1f94d52d-aa8c-4bb9-85d6-0c3453c06738
 *                 name: John Doe
 *                 profileUrl: https://example.com/profile/1
 *               name: TRI-120
 *               title: Issue Title
 *               description: Description of the issue.
 *               priority: HIGH_PRIORITY
 *               storyPoints: 5
 *               isBlocked: true
 *               labels:
 *                 - id: 8713b333-6b7d-41b8-b39a-ebb9bcfa0b31
 *                   name: Bug
 *                 - id: 96d44c11-b28b-46ab-a17d-3e04f672f18f
 *                   name: Feature
 *               chronology:
 *                 - eventId: e859ce2f-1d08-4a89-bbf2-01922c438c3d
 *                   message: Issue blocked by user
 *                   comment: This is a comment explaining why the issue was blocked
 *                   isBlocker: true
 *                   time: 13:45:22
 *                   date: '2024-03-20'
 *                 - eventId: b04a231e-25e0-4aef-8dd9-69f3b0b5e059
 *                   message: Issue unblocked by user
 *                   comment: This is a comment explaining why the issue was unblocked
 *                   isBlocker: false
 *                   time: 14:30:10
 *                   date: '2024-03-21'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *   /api/issue/{issueId}/flag/remove:
 *     delete:
 *       summary: "Remove the blocked flag from an issue."
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: "path"
 *           name: "issueId"
 *           description: "The ID of the issue to unflag."
 *           required: true
 *           type: "string"
 *           example: "12345"
 *       responses:
 *         204:
 *           description: "Issue successfully unflagged."
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */
