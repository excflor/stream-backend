import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { HttpModule } from 'src/helper/http/http.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      global: true,
      secret: 'secrete',
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
