export class StatusError extends Error {
	public statusCode: number;
	public statusMessage?: string;
	public isPermanentError: boolean;

	constructor(message: string, statusCode: number, statusMessage?: string) {
		super(message);
		this.name = 'StatusError';
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.isPermanentError = typeof this.statusCode === 'number' && this.statusCode >= 400 && this.statusCode < 500;
	}
}
