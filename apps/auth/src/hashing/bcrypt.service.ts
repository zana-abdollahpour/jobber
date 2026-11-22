import { Injectable } from '@nestjs/common';
import {
  genSalt,
  hash as bcryptHash,
  compare as bcryptCompare,
} from 'bcryptjs';

import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return await bcryptHash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcryptCompare(data, encrypted);
  }
}
