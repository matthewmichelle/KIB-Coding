import { Module } from '@nestjs/common';
import { JwtUtilsService } from './jwt-utils.service';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.getJwtSecret(),
      }),
    }),
  ],
  providers: [JwtUtilsService],
  exports: [JwtUtilsService],
})
export class JwtUtilsModule {}
