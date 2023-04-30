import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const validationPipeBadRequest = new ValidationPipe({
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const keys = Object.keys(e.constraints);
      keys.forEach((key) => {
        errorsForResponse.push({
          message: e.constraints[key],
          field: e.property,
        });
      });
    });
    throw new BadRequestException(errorsForResponse);
  },
});
