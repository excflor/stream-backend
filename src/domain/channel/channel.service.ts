import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ConfigService } from '@nestjs/config/dist';
import { HttpService } from 'src/helper/http/http.service';
import { JwtService } from '@nestjs/jwt';

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

  async encodeToken(token: string) {
    try {
      const payload = {
        userId: 'yirose3988_std@cabose.com',
        sessionId:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50U2Vzc2lvbklkIjoiYzZmM2I1ZDktM2MxZi00YThkLThlMjctOTZhMzI4MzMwNmQ0IiwiY3VycmVudERldmljZVR5cGUiOiJBIiwiY3VycmVudFBsYXRmb3JtSWQiOiI0MDI4YzY4NTc0NTM3ZmNkMDE3NGFmNjc1NmE5NDI4OCIsInRpbWV6b25lIjoiQXNpYS9KYWthcnRhIiwiYXV0aG9yaXR5IjoiUk9MRV9VU0VSIiwiZXhwIjoxNzAwNDU0ODg5LCJ1c2VySWQiOiI0MDI4NDhlNDhiYjQwNGE5MDE4YmRkZjlhNDhiMDExZCIsImRldmljZUlkIjoiMTIzNDU2Nzg5MCIsImlhdCI6MTcwMDM2ODQ4OSwidXNlcm5hbWUiOiJ5aXJvc2UzOTg4X3N0ZEBjYWJvc2UuY29tIn0.Q2SRRe2Q9vAOcn5oLEm3kssdFEJjV9M6WD0CpIIiz4Y',
        merchant: 'giitd_transvision',
      };
      const options = {
        // expiresIn: '24h',
        noTimestamp: true,
      };
      const token = await this.jwtService.signAsync(payload, options);
      const [encodedHeader, encodedPayload, encodedSignature] =
        token.split('.');

      return encodedPayload;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
