import { Request, Response } from 'express';
import { CreateAccountService, CreateUserService } from '../services';
import { ResponseWriter } from '../utils';

class CreateAccountController {
  private CreateAccountService = CreateAccountService;

  private CreateUserService = CreateUserService;

  private responseWriter = ResponseWriter;

  public async handle(request: Request, response: Response): Promise<void> {
    try {
      // console.log('request ', request.body);
      const userData = await new this.CreateUserService().execute(request.body);
      const data = await new this.CreateAccountService().execute(userData.data);

      this.responseWriter.success(response, 201, data);
    } catch (error) {
      this.responseWriter.error(response, error as Error);
    }
  }
}

export { CreateAccountController };
