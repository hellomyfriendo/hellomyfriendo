"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const errors_1 = require("../../errors");
class Auth {
    constructor(args) {
        this.args = args;
        this.requireAuth = async (req, res, next) => {
            try {
                const token = this.getToken(req);
                if (!token) {
                    throw new errors_1.UnauthorizedError('"Bearer" token is required in "Authorization" header');
                }
                const tokenPayload = await this.verify(token);
                if (!tokenPayload) {
                    throw new errors_1.UnauthorizedError("Couldn't get the token's payload");
                }
                req.user = {
                    id: tokenPayload.sub
                };
                return next();
            }
            catch (err) {
                return next(err);
            }
        };
        this.optionalAuth = async (req, res, next) => {
            try {
                const token = this.getToken(req);
                if (!token) {
                    return next();
                }
                const tokenPayload = await this.verify(token);
                if (!tokenPayload) {
                    throw new errors_1.UnauthorizedError("Couldn't get the token's payload");
                }
                req.user = {
                    id: tokenPayload.sub
                };
                return next();
            }
            catch (err) {
                return next(err);
            }
        };
        this.getToken = (req) => {
            const authorizationHeader = req.header('Authorization') || req.header('authorization');
            if (!authorizationHeader) {
                return;
            }
            const token = authorizationHeader.split('Bearer ')[1];
            return token;
        };
        this.oAuth2Client = args.oAuth2Client;
        this.oAuth2ClientID = args.oAuth2ClientID;
    }
    async verify(idToken) {
        const ticket = await this.oAuth2Client.verifyIdToken({
            idToken,
            audience: this.oAuth2ClientID,
        });
        return ticket.getPayload();
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map