"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const celebrate_1 = require("celebrate");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
class ErrorResponse {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyExists"] = "alreadyExists";
    ErrorCode["GeneralError"] = "generalError";
    ErrorCode["InvalidRequest"] = "invalidRequest";
    ErrorCode["NotFound"] = "notFound";
    ErrorCode["Unauthorized"] = "unauthorized";
})(ErrorCode || (ErrorCode = {}));
class ErrorHandler {
    async handleError(err, req, res) {
        req.log.error({ err });
        if ((0, celebrate_1.isCelebrateError)(err)) {
            const errorMessage = Array.from(err.details, ([, value]) => value.message).reduce((message, nextErrorMessage) => `${message}\n${nextErrorMessage}`);
            return res
                .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
                .json(new ErrorResponse(ErrorCode.InvalidRequest, errorMessage));
        }
        if (err instanceof RangeError) {
            return res
                .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
                .json(new ErrorResponse(ErrorCode.InvalidRequest, err.message));
        }
        if (err instanceof errors_1.AlreadyExistsError) {
            return res
                .status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY)
                .json(new ErrorResponse(ErrorCode.AlreadyExists, err.message));
        }
        if (err instanceof errors_1.NotFoundError) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json(new ErrorResponse(ErrorCode.NotFound, err.message));
        }
        if (err instanceof errors_1.UnauthorizedError) {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json(new ErrorResponse(ErrorCode.Unauthorized, 'Unauthorized'));
        }
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(ErrorCode.GeneralError, 'Internal Server Error'));
    }
}
exports.errorHandler = new ErrorHandler();
//# sourceMappingURL=error-handler.js.map