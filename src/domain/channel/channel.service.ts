import { Injectable, BadRequestException } from '@nestjs/common';
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
      if (!login.email || !login.sessionId) throw new BadRequestException('login failed');

      const encodedToken = await this.encodeToken(login)
      const token = encodedToken ?? ''

      return token
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
