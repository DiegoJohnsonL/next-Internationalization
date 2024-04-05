export class ApiError extends Error {
    status: number;
    object?: any;
    
    constructor(message: string, status: number, object?: any) {
        super(message);
        this.status = status;
        this.object = object;
    }
}