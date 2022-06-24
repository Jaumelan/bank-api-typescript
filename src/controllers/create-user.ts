import { Request, Response } from 'express';
import { CreateUserService } from '../services';
import { ResponseWriter } from '../utils';

class CreateUserController {
  private createUserService = CreateUserService;
  private responseWriter= ResponseWriter;

  public handle (request: Request, response: Response): void {
    try {
        //console.log(request.body);
        const data = new this.createUserService().execute(request.body);
        
        this.responseWriter.success(response, data);
    } catch (error) {
        this.responseWriter.error(response, error as Error);
    }
    }
}

export { CreateUserController };