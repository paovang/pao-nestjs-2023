import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MulterConfigModule implements MulterOptionsFactory {
  constructor(
    private readonly _configService: ConfigService
  ){}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: this._configService.get<string>('UPLOADS_DESTINATION'),
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    };
  }
}