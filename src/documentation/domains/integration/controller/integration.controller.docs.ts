/**
 * @swagger
 * paths:
 *   /api/integration/{issueProviderName}/projects:
 *     post:
 *       summary: Retrieves projects from the issue provider selected.
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKeyDTO'
 *       parameters:
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *       responses:
 *         '200':
 *           description: Project data retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProjectPreIntegratedDTO'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
 *   /api/integration/{issueProviderName}/{projectId}/accept:
 *     get:
 *       summary: Integrate a project into Linear
 *       tags:
 *         - "Integration Linear"
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: projectId
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the project we will integrate
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *       responses:
 *         '201':
 *           description: Project integrated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ProjectDTO'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
 *   /api/integration/{issueProviderName}/{projectId}/decline:
 *     get:
 *       summary: Decline integration of a project with Linear provider.
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: projectId
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the project to decline integration.
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *         - in: query
 *           name: token
 *           schema:
 *             type: string
 *           required: true
 *           description: The token associated with the project to decline integration.
 *       responses:
 *         '204':
 *           description: No Content.
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 *
 *   /api/integration/{issueProviderName}/project/{id}/members:
 *     post:
 *       summary: Get members of a project
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the project
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LinearMembersPreIntegrationBody'
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProjectMemberDataDTO'
 *
 *   /api/integration/{issueProviderName}/authorization:
 *     post:
 *       summary: Create a pending authorization for project integration.
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationRequest'
 *       responses:
 *         '201':
 *           description: Authorization request created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: boolean
 *                 name: pmIsAdmin
 *                 description: This boolean informs if the Project manager is also an Organization Administrator
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '409':
 *           $ref: '#/components/responses/ConflictException'
 *
 *   /api/integration/{issueProviderName}/{projectId}/information:
 *     get:
 *       summary: Get pending information of a project for linear integration.
 *       tags:
 *         - Integration Linear
 *       parameters:
 *         - in: path
 *           name: projectId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: The ID of the project for which information is requested.
 *         - in: path
 *           name: issueProviderName
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the issue provider that going to be used for integration.
 *         - in: query
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 *           description: The token associated with the project for linear integration.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Pending project information.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PendingProjectInfoDTO'
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */
