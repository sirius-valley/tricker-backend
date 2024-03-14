/**
 * @swagger
 * components:
 *   schemas:
 *     RoleDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *       required:
 *         - "id"
 *         - "name"
 *       example:
 *         id: "1"
 *         name: "Project Manager"
 *     ProjectDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         providerId: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *           description: project icon url
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - "id"
 *         - "providerId"
 *         - "name"
 *         - "createdAt"
 *         - "deletedAt"
 *       example:
 *         id: "123"
 *         providerId: 'linear_12568'
 *         name: "Example Project"
 *         image: "http://exampleImage.com.example"
 *         createdAt: "2024-02-12T00:00:00Z"
 *         deletedAt: "2024-02-12T12:00:00Z"
 *     OrganizationDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "1"
 *         name: "Organization Name"
 *     LabelDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         id: "1"
 *         name: "Label Name"
 *     IssueDataDTO:
 *       type: object
 *       properties:
 *         providerIssueId:
 *           type: string
 *         authorEmail:
 *           type: string
 *           nullable: true
 *         assigneeEmail:
 *           type: string
 *           nullable: true
 *         providerProjectId:
 *           type: string
 *         name:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         priority:
 *           type: string
 *           enum:
 *             - NO_PRIORITY
 *             - LOW_PRIORITY
 *             - MEDIUM_PRIORITY
 *             - HIGH_PRIORITY
 *             - URGENT
 *         storyPoints:
 *           type: number
 *           nullable: true
 *         stage:
 *           type: string
 *           nullable: true
 *       example:
 *         providerIssueId: "123"
 *         authorEmail: "author@example.com"
 *         assigneeEmail: "assignee@example.com"
 *         providerProjectId: "456"
 *         name: "Issue Name"
 *         title: "Issue Title"
 *         description: "Issue Description"
 *         priority: "MEDIUM_PRIORITY"
 *         storyPoints: 5
 *         stage: "To Do"
 *     ProjectDataDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoleDTO'
 *         projectName:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         stages:
 *           type: array
 *           items:
 *             type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - projectId
 *         - members
 *         - projectName
 *         - stages
 *         - labels
 *       example:
 *         projectId: "1"
 *         members:
 *           - user1
 *           - user2
 *         projectName: "Example Project"
 *         image: "http://example.com/image.jpg"
 *         stages:
 *           - "To Do"
 *           - "In Progress"
 *         labels:
 *           - "bug"
 *           - "feature"
 *     MembersIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectData:
 *           $ref: '#/components/schemas/ProjectDataDTO'
 *       required:
 *         - projectData
 *         - projectId
 *         - emitterId
 *         - db
 *     ProjectIdIntegrationInputDTO:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *       required:
 *         - projectId
 *       example:
 *         projectId: "1"
 *     ProjectPreIntegratedDTO:
 *       type: object
 *       properties:
 *         providerProjectId:
 *           type: string
 *           description: The ID of the project in the provider's system.
 *         name:
 *           type: string
 *           description: The name of the project.
 *         image:
 *           type: string
 *           nullable: true
 *           description: The URL of the project's image, if available.
 *       example:
 *         providerProjectId: "123"
 *         name: "Example Project"
 *         image: "http://example.com/image.jpg"
 *     ProjectsPreIntegratedInputDTO:
 *       type: object
 *       properties:
 *         providerName:
 *           type: string
 *           description: The name of the provider.
 *         apiKey:
 *           type: string
 *           description: The API key for accessing the provider's services.
 *         pmProviderId:
 *           type: string
 *           description: The ID of the project manager in the provider's system.
 *       example:
 *         providerName: "Linear"
 *         apiKey: "xxxxxxxxxxxxxxxxxxxx"
 *         pmProviderId: "456"
 *     ProjectMemberDataDTO:
 *       type: object
 *       properties:
 *         providerId:
 *           type: string
 *           description: The ID of the project member in the provider's system.
 *         name:
 *           type: string
 *           description: The name of the project member.
 *         email:
 *           type: string
 *           description: The email of the project member.
 *       example:
 *         providerId: "789"
 *         name: "John Doe"
 *         email: "john@example.com"
 *     AuthorizedMemberDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Provider specific ID of the member.
 *           example: memberId123
 *         email:
 *           type: string
 *           format: email
 *           description: Email associated with the member.
 *           example: user1@example.com
 *       required:
 *         - id
 *         - email
 *     AuthorizationRequest:
 *       type: object
 *       properties:
 *         apiToken:
 *           type: string
 *           description: Provider specific API token/key to access the provider API.
 *           example: token123
 *         projectId:
 *           type: string
 *           description: Provider specific project ID associated with the integration authorization.
 *           example: projectId123
 *         integratorId:
 *           type: string
 *           description: Provider specific ID of the user trying to integrate the project.
 *           example: userId123
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AuthorizedMemberDTO'
 *           description: Array of provider specific member details.
 *         organizationName:
 *           type: string
 *           description: Name of the current organization trying to integrate the project.
 *           example: SIRIUS
 *         issueProviderName:
 *           type: string
 *           description: Name of the selected issue provider for integration.
 *           example: LINEAR
 *       required:
 *         - apiToken
 *         - projectId
 *         - integratorId
 *         - members
 *         - organizationName
 *         - issueProviderName
 *     LinearMembersPreIntegrationParams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *     LinearMembersPreIntegrationBody:
 *       type: object
 *       properties:
 *         apiToken:
 *           type: string
 *       required:
 *         - apiToken
 *       example:
 *         apiToken: "your-api-token-here"
 *     ProviderKeyDTO:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: The API key of the provider.
 *         provider:
 *           type: string
 *           description: The name of the provider.
 *       required:
 *         - key
 *         - provider
 *       example:
 *         key: "your-api-key-here"
 *         provider: "linear"
 * paths:
 *   /api/integration/linear/projects:
 *     post:
 *       summary: Retrieves projects from Linear provider.
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProviderKeyDTO'
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
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /api/integration/linear/{projectId}/accept:
 *     get:
 *       summary: Integrate a project into Linear
 *       tags:
 *         - "Integration Linear"
 *       parameters:
 *         - in: path
 *           name: projectId
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the project we will integrate
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
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /api/integration/linear/{projectId}/decline:
 *     get:
 *       summary: Decline integration of a project with Linear provider.
 *       tags:
 *         - Integration Linear
 *       parameters:
 *         - in: path
 *           name: projectId
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the project to decline integration.
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
 *         '500':
 *           $ref: '#/components/responses/InternalServerErrorException'
 *   /api/integration/linear/project/{id}/members:
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
 *   /api/integration/linear/authorization:
 *     post:
 *       summary: Create a pending authorization for project integration.
 *       tags:
 *         - Integration Linear
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationRequest'
 *       responses:
 *         '201':
 *           description: Authorization request created successfully.
 */
