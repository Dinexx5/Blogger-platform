import { HttpException } from '@nestjs/common/exceptions/http.exception';

export class TooManyRequestsException extends HttpException {
  constructor() {
    super({}, 429);
  }
}
