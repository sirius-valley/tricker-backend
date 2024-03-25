/**
 * @swagger
 * paths:
 *   /api/issue/{issueId}/resume:
 *     post:
 *       summary: Resume timer for an issue
 *       tags:
 *         - Issue
 *       security:
 *         - bearerAuth: []
 *       description: Resume the timer for a specific issue.
 *       parameters:
 *         - name: issueId
 *           in: path
 *           required: true
 *           description: The ID of the issue to resume the timer for.
 *           schema:
 *             type: string
 *       responses:
 *         '201':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/TimeTrackingDTO'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '409':
 *           $ref: '#/components/responses/ConflictException'
 *   /api/issue/{issueId}/pause:
 *     post:
 *       summary: Pause timer for an issue
 *       tags:
 *         - Issue
 *       description: Pause the timer for a specific issue.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - $ref: '#/components/parameters/IssueIdParamDTO'
 *       responses:
 *         '201':
 *           description: "Timer paused succesfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/TimeTrackingDTO'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '409':
 *           $ref: '#/components/responses/ConflictException'
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
 *             $ref: '#/components/parameters/IssueIdParamDTO'
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
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ManualTimeModificationRequestDTO'
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
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ManualTimeModificationRequestDTO'
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
 *                 $ref: "#/components/schemas/BlockerStatusModificationDTO"
 *           examples:
 *             application/json:
 *               id: d4dbf27b-9ed0-4d7f-b6b7-50b5c9aabcde
 *               providerEventId: e12eef67-3b10-4a82-b0fb-6dfac2d9abcd
 *               userEmitterId: c8acbf32-5f3a-4e14-8f1c-28e5d0faabcd
 *               issueId: a6b5e9d3-fc47-4b71-bc81-d6c4f2feabcd
 *               status: Resolved
 *               eventRegisteredAt: "2024-03-10T08:15:30Z"
 *               createdAt: "2024-03-10T08:20:45Z"
 *               reason: "Resolved after investigation"
 *               comment: "Blocker was due to misconfiguration in the database server"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '403':
 *           $ref: '#/components/responses/ForbiddenException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *         '409':
 *           $ref: '#/components/responses/ConflictException'
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
 *           example: "275a2419-ef61-4bee-95d8-572f80ec5b03"
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
 *         '409':
 *           $ref: '#/components/responses/ConflictException'
 *
 *   /api/issue/{issueId}:
 *     get:
 *       summary: Get details of a specific issue with chronology.
 *       tags:
 *         - "Issue"
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: issueId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: The UUID of the issue to retrieve details for.
 *       responses:
 *         '200':
 *           description: Successful response. Returns the details of the issue with chronology.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IssueExtendedDTO'
 *               example:
 *                 id: "789e0123-fghi-45jk-lmno-123456789012"
 *                 assignee:
 *                   userId: "789"
 *                   name: "John Doe"
 *                   profileUrl: "https://example.com/profiles/johndoe"
 *                 name: "Issue 1"
 *                 title: "First Issue"
 *                 description: "This is the description of the issue."
 *                 priority: "HIGH_PRIORITY"
 *                 storyPoints: 5
 *                 isBlocked: false
 *                 labels:
 *                   - id: "123e4567-e89b-12d3-a456-426614174015"
 *                     name: "Bug"
 *                   - id: "789e0123-fghi-45jk-lmno-123456789012"
 *                     name: "Feature"
 *                 chronology:
 *                   - eventId: "123e4567-e89b-12d3-a456-426614174015"
 *                     message: "Issue blocked by user"
 *                     comment: "This is a comment explaining why the issue was blocked"
 *                     isBlocker: true
 *                     date: "2024-02-12T00:00:00Z"
 *                   - eventId: "789e0123-fghi-45jk-lmno-123456789012"
 *                     message: "Issue unblocked by admin"
 *                     comment: "Admin removed the block on the issue"
 *                     isBlocker: false
 *                     date: "2024-02-13T00:00:00Z"
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */
