import { Response } from 'express';
import { APIResponse } from '../models';

class ResponseWriter {
  public static error(response: Response, error: Error): void {
    const [status, errorMessages] = error.message.split(': ');

    if (status === '400') {
      //  console.log("response ", errorMessages);
      const errors = errorMessages
        .split('|')
        .filter((errorMessage: string) => errorMessage !== '');

      response.status(400).json({
        data: null,
        message: errors,
      } as APIResponse);
    } else {
      response.status(500).json({
        data: null,
        message: ['Ocorreu um erro inesperado.'],
      } as APIResponse);
    }
  }

  public static success(response: Response, data: any): void {
    response.status(200).json({
      data,
      message: [],
    } as APIResponse);
  }
}

export { ResponseWriter };
