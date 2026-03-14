import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "./api-response.interface";
import { map, Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { SUCCESS_MESSAGE_KEY } from "./success-message.decorator";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor( private reflector: Reflector){};

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
        const successMessage = this.reflector.get(SUCCESS_MESSAGE_KEY, context.getHandler());

        return next.handle().pipe(
            map((data) => (
                {
                    success: true,
                    data: data,
                    message: successMessage,
                }))
        )
    }
}