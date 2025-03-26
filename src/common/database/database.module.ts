import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../../helper-modules/app-config/app-config.module';
import { AppConfigService } from '../../helper-modules/app-config/app-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        try {
          const uri = appConfigService.getDdbUrl();
          return { uri };
        } catch (error) {
          // Properly handle configuration errors
          console.error('Error loading MongoDB URI from configuration:', error);
          throw error;
        }
      },
    }),
  ],
})
export class DatabaseModule extends MongooseModule {}
