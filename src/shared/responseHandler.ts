import { Response } from 'express';

interface ApiResponse {
  Success: boolean;
  HttpStatusCode: number;
  Errors: string[];
  Value?: any;
}

export function sendSuccess(res: Response, value: any = {}, code = 200): void {
  const response: ApiResponse = {
    Success: true,
    HttpStatusCode: code,
    Errors: [],
    Value: value
  };
  res.status(code).json(response);
}

export function sendError(res: Response, errors: string[] = ['Error interno'], code = 500): void {
  const response: ApiResponse = {
    Success: false,
    HttpStatusCode: code,
    Errors: errors
  };
  res.status(code).json(response);
}
