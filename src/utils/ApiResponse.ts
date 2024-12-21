/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiResponse {
  public statusCode: number
  public data?: any
  public message: string
  public success: boolean
  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}
