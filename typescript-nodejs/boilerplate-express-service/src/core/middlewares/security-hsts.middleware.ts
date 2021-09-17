import * as express from 'express';
import * as helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

/**
 * helmet.hsts sets the Strict-Transport-Security header which tells browsers to prefer HTTPS over insecure HTTP
 * By default, this is included withing the SecurityMiddleware. But here we are customizing the hsts middleware.
 */
@Middleware({ type: 'before' })
@Service()
export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true
        })(req, res, next);
    }

}
