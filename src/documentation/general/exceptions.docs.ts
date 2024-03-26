/**
 * @swagger
 * components:
 *   responses:
 *     ConflictException:
 *       description: "Conflict exception"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               code:
 *                 type: "number"
 *                 description: "The HTTP error code"
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *           example:
 *             message: "Conflict. User already exists"
 *             code: 409
 *     UnauthorizedException:
 *       description: "Unauthorized. You must log in to access this content."
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               code:
 *                 type: "number"
 *                 description: "Error code"
 *               errors:
 *                 type: "object"
 *                 properties:
 *                   error_code:
 *                   type: "string"
 *                   description: "Error code"
 *           example:
 *             message: "Unauthorized. You must log in to access this content."
 *             code: 401
 *             errors:
 *               error_code: "UNAUTHORIZED_ERROR"
 *     ValidationException:
 *       description: "Validation Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               code:
 *                 type: "number"
 *               errors:
 *                 type: "array"
 *                 description: "Validation errors"
 *                 items:
 *                   type: "object"
 *           example:
 *             message: "Validation Error"
 *             code: 400
 *             errors:
 *               - property: token
 *                 children: []
 *                 constraints:
 *                   isNotEmpty: "token should not be empty"
 *     NotFoundException:
 *       description: "Not found exception"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *           example:
 *             message: "Not found. Couldn't find PendingAuthProject"
 *             code: 404
 *     InternalServerErrorException:
 *       description: "Internal Server Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               errors:
 *                 type: "object"
 *                 description: "Additional details or errors associated with the exception"
 *           example:
 *             message: "Internal Server Error"
 *             errors: {}
 *     LinearIntegrationException:
 *       description: "Linear Integration Error"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               errors:
 *                 type: "object"
 *                 description: "Additional details or errors associated with the exception"
 *           example:
 *             message: "Linear Integration Error"
 *             errors: {}
 *     ForbiddenException:
 *       description: "Forbidden exception"
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "The error message"
 *               code:
 *                 type: number
 *                 description: Error code
 *           example:
 *             message: "Forbidden. You are not allowed to perform this action"
 *             code: 403
 * */
