import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from './helper/http/http.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [HttpModule, ChannelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
