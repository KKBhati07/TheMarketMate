export interface PresignRequestPayload {
	files: FilePayload[]
	directory: Directory
}

export interface FilePayload {
	file_name: string;
	content_type: string;
	directory?: Directory;
}

export interface PresignResponse {
	presigns: PresignSuccessResponse[];
	failures: PresignFailureResponse[];
}

interface PresignSuccessResponse {
	url: string;
	headers: Record<string, string>;
	object_key: string;
	expires_at: Date;
}

interface PresignFailureResponse {
	file_name: string;
	reason: string;
}

export enum Directory {
	PROFILE = 'PROFILE',
	LISTINGS = 'LISTINGS'
}
