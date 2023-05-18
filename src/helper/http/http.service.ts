import { Injectable, BadRequestException } from '@nestjs/common';
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
        timeout: 5000
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw new BadRequestException(error);
        });
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
