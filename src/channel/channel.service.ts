import { HttpService } from './../helper/http/http.service';
import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly httpRequest: HttpService) {}

  create(createChannelDto: CreateChannelDto) {
    return 'This action adds a new channel';
  }

  async findAll() {
    const channelParams = {
      method: 'GET',
      url: 'https://api3.hbogoasia.com/v1/asset/playbackurl?territory=IDN&contentId=040443X0&sessionToken=DBfG-BwMy-p5UC-W9La-kL8k-vpGb-vV&channelPartnerID=Telkomsel_HBO&operatorId=SIN&lang=en'
    }

    const getChannel: any = await this.httpRequest.Request(channelParams);
    return getChannel.data
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
