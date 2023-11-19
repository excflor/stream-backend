import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ConfigService } from '@nestjs/config/dist';
import { HttpService } from 'src/helper/http/http.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly httpRequest: HttpService,
    private configService: ConfigService,
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

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
