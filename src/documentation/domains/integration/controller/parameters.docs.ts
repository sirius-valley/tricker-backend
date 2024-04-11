/**
 * @swagger
 * components:
 *   parameters:
 *     IssueProviderURLParams:
 *       type: object
 *       properties:
 *         issueProviderName:
 *           type: string
 *       example:
 *         issueProviderName: "linear"
 *
 *     LinearMembersPreIntegrationParams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         issueProviderName:
 *           type: string
 *       required:
 *         - id
 *         - issueProviderName
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         issueProviderName: "linear"
 *
 */
