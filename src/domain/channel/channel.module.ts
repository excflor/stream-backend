import { HttpModule } from './../helper/http/http.module';
import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

@Module({
  imports: [HttpModule],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
