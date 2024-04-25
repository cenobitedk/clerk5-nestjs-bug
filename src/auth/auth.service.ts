// import { Request } from 'express';

import { ClerkClient, createClerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public clerkClient: ClerkClient;
  constructor() {
    this.clerkClient = createClerkClient({
      secretKey: 'INSERT_CLERK_SECRET',
    });
  }

  /**
   * Authenticate request.
   *
   * @param request request object
   * @returns true or throw UnauthorizedException.
   */
  async authenticateRequest(request: Request): Promise<boolean | undefined> {
    try {
      const isValidAccessWithSession = (
        await this.clerkClient.authenticateRequest(request)
      ).isSignedIn;

      this.logger.verbose(
        `${request.url} - Access with session: ${isValidAccessWithSession}`,
      );

      if (!isValidAccessWithSession) {
        this.logger.debug(`${request.url} - Unauthorized`);
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      console.log('error', error);
    }
  }
}
