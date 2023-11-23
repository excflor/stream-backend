import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ConfigService } from '@nestjs/config/dist';
import { HttpService } from 'src/helper/http/http.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly httpRequest: HttpService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    return 'This action adds a new channel';
  }

  async findLiveTvList() {
    const channelParams = {
      method: 'GET',
      url: this.configService.get<string>('HBO_LIVETV_URL'),
    };

    const getChannel: any = await this.httpRequest.Request(channelParams);

    return getChannel.data;
  }

  async findM3U(channelId: string, query: any) {
    const sessionToken = query.sessionToken;
    const channelParams = {
      method: 'GET',
      url: `${this.configService.get<string>(
        'HBO_LIVEPLAYBACK_URL',
      )}&channelId=${channelId}&sessionToken=${this.configService.get<string>(
        'HBO_SESSION_TOKEN',
      )}&channelPartnerID=Telkomsel_HBO&operatorId=SIN&lang=en`,
    };

    const getM3U: any = await this.httpRequest.Request(channelParams);
    if (!getM3U.data?.url) {
      throw new BadRequestException('failed to get m3u url');
    }

    const m3uParams = {
      method: 'GET',
      url: getM3U.data.url,
    };

    const getM3UData: any = await this.httpRequest.Request(m3uParams);
    if (!getM3UData.data) {
      throw new BadRequestException('failed to get m3u data');
    }

    return getM3UData.data;
  }

  async loginCubmu() {
    try {
      const loginPayload = [
        {
          url: '/v2/auth/login',
        },
        {
          app_id: 'cubmu',
          tvs_platform_id: 'standalone',
          email: 'andre.ndr31@gmail.com',
          password:
            'xxeHhVbmwxZFdwcGJrQXpNWHRUVUV4SlZGUkZVbjB4TnpBd05EZzJOVEF5',
        },
      ];

      const loginResponse = await this.httpRequest.Request({
        method: 'POST',
        url: 'https://www.cubmu.com/api/hmac',
        data: loginPayload,
      });

      if (loginResponse.data?.statusCode !== '200')
        throw new BadRequestException('error get access token');

      const accessToken = loginResponse.data.result.access_token;
      const platformId = loginResponse.data.result.platform_id;
      const email = loginResponse.data.result.email;

      const params = new URLSearchParams({
        email: email,
        password: 'Unl1dWppbkAzMQ==',
        deviceId: '1234567890',
        platformId: platformId,
      });

      const url = `https://servicebuss.transvision.co.id/tvs/login/external?${params.toString()}`;
      const transService = await this.httpRequest.Request({
        method: 'POST',
        url: url,
      });

      if (!transService.data?.access_token)
        throw new BadRequestException('error get session id');

      const sessionId = transService.data.access_token;

      return { sessionId, email };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async encodeToken(req: TokenDto) {
    try {
      const payload = {
        userId: req.email,
        sessionId: req.sessionId,
        merchant: 'giitd_transvision',
      };
      const options = {
        noTimestamp: true,
      };
      const token = await this.jwtService.signAsync(payload, options);
      const [encodedHeader, encodedPayload, encodedSignature] =
        token.split('.');

      return encodedPayload;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getToken() {
    try {
      const login = await this.loginCubmu();
      if (!login.email || !login.sessionId)
        throw new BadRequestException('login failed');

      const encodedToken = await this.encodeToken(login);
      const token = encodedToken ?? '';

      return token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Vidio
  async getPallyconToken() {
    try {
      const header = {
        origin: 'https://www.vidio.com',
        'pallycon-customdata-v2':
          'eyJkcm1fdHlwZSI6IldpZGV2aW5lIiwic2l0ZV9pZCI6Ik1RRFQiLCJ1c2VyX2lkIjoiMTQ3MTk2NTk3IiwiY2lkIjoiNjgyMzBiZGRlNjU0IiwicG9saWN5IjoiNWt4a1MyRytIbEhSb2Fnb1AwYU53ZjFiWXQxMEplWUoyaEJWejc4bGQyZ0JQckFFZTlnQ09vTm5tdUlJYkZ6MHRoSnhZa2hyaFNZeWhIanFLcWxvb3ZnbHVHd2lPTjNxMjdpQXVLU0F6cW96UnFaenppdTM5ZS95MEFYd3lLZnUiLCJ0aW1lc3RhbXAiOiIyMDIzLTExLTIyVDE2OjEzOjQ3WiIsImhhc2giOiJUbHJPQzB1MWMrWTF0TXBVY3BYdzdKK0lxd2JuNkxxMVdWVlRmQ0RKQ0I4PSIsImtleV9yb3RhdGlvbiI6ZmFsc2V9',
        referer: 'https://www.vidio.com/',
      };

      const getLicense = await this.httpRequest.Request({
        headers: header,
        method: 'POST',
        url: 'https://license-global.pallycon.com/ri/licenseManager.do',
      });
      if (!getLicense) throw new BadRequestException('error get license');

      const license = getLicense.data;

      return license;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getIndosiar() {
    try {
      const getToken = await this.httpRequest.Request({
        method: 'POST',
        url: 'https://www.vidio.com/live/205/tokens',
      });
      if (!getToken.data.token)
        throw new HttpException('error get token', 400, {
          cause: new Error('error token'),
        });

      const token = getToken.data.token;

      const master = await this.httpRequest.Request({
        method: 'GET',
        url: `https://etslive-app.vidio.com/live/205/master.m3u8?${token}`,
      });

      const regex = /https:\/\/etslive-2-vidio-com\.akamaized\.net\/[^ \n]+/;
      const match = master.data.match(regex);

      return match[0];
    } catch (error) {
      throw new HttpException('error try catch', 400, {
        cause: new Error(error.message),
      });
    }
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
