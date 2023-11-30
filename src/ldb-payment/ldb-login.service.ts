import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import * as axios from 'axios';

@Injectable()
export class LoginService {
  private ldbUrlLogin: string;
  private ldbUsername: string;
  private ldbPassword: string;

  constructor() {
    this.ldbUrlLogin = process.env.LDB_URL_LOGIN;
    this.ldbUsername = process.env.LDB_USERNAME;
    this.ldbPassword = process.env.LDB_PASSWORD;
  }

  async loginWithLDB(): Promise<any> {
    try {
        const response = await axios.default.post(
            this.ldbUrlLogin,
            null,
            {
              auth: {
                username: this.ldbUsername,
                password: this.ldbPassword,
              },
              params: {
                grant_type: 'client_credentials',
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            }
        );

        if (response.status === 200) {
            const accessToken = response.data.access_token;

            return accessToken;
        }
        return;
    } catch (error) {
      if (axios.default.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          const responseBody = error.response.data;
          throw new HttpException(responseBody, statusCode);
        } else if (error.request) {
          throw new HttpException('No response received from the server.', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          throw new HttpException('Error in making the request.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}