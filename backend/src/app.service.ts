import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getEndpoints(): any {
    const filepath = path.resolve(process.cwd(), 'src/api/endpoints.json')
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  }
}
