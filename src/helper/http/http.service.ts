import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService {
  constructor() {}

  async Request(params: any) {
    try {
      return axios({
        method: params.method,
        url: params.url,
        data: params.data,
        headers: params.headers,
        timeout: 30000,
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          throw new BadRequestException(error);
        });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
