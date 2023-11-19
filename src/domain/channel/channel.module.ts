import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { HttpModule } from 'src/helper/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
