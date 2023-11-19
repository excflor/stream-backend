import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Query,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Version('1')
  @Get('live')
  async findLiveTvList() {
    return await this.channelService.findLiveTvList();
  }

  @Version('1')
  @Get('live/:id')
  async findM3U(@Param('id') id: string, @Query() query: any) {
    return await this.channelService.findM3U(id, query);
  }

  @Version('1')
  @Post('encode')
  async encodeToken(@Body() token: string) {
    return await this.channelService.encodeToken(token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
