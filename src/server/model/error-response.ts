export interface ErrorResponse {
  error: {
    message: string;
    error?: any; // Sent for unhandled errors resulting in 500
  };
  status?: number; // Sent for unhandled errors resulting in 500
}
