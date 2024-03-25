/**
 * @swagger
 * components:
 *   schemas:
 *     DevProjectFiltersDTO:
 *       type: object
 *       properties:
 *         stages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StageExtendedDTO'
 *         priorities:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         stages:
 *           - id: "1"
 *             name: "Backlog"
 *             type: "BACKLOG"
 *           - id: "2"
 *             name: "In Progress"
 *             type: "IN_PROGRESS"
 *         priorities:
 *           - "HIGH_PRIORITY"
 *           - "MEDIUM_PRIORITY"
 *
 *     PMProjectFiltersDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/DevProjectFiltersDTO'
 *       properties:
 *         assignees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AssigneeFilterDataDTO'
 *       example:
 *         stages:
 *           - id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "Backlog"
 *             type: "BACKLOG"
 *           - id: "123e4567-e89b-12d3-a456-426614174103"
 *             name: "In Progress"
 *             type: "IN_PROGRESS"
 *         priorities:
 *           - "HIGH_PRIORITY"
 *           - "MEDIUM_PRIORITY"
 *         assignees:
 *           - id: "123e4567-e89b-12d3-a456-426614174000"
 *             name: "John Doe"
 *           - id: "123e4567-e89b-12d3-a456-426614174306"
 *             name: "Jane Smith"
 *
 *     AssigneeFilterDataDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         name: "John Doe"
 */
