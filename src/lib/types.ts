export type ChatMode = 'ask' | 'fit';
export type RequestType = 'message' | 'pdf_upload' | 'image_upload' | 'jd_paste';

export type MessageContentPart =
	| { type: 'text'; text: string }
	| { type: 'image_url'; image_url: { url: string } };

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string | MessageContentPart[];
}

export interface ChatRequest {
	messages: ChatMessage[];
	mode: ChatMode;
	jobDescription?: string;
	requestType?: RequestType;
}

export type GuardResult =
	| { ok: true }
	| { ok: false; status: 400 | 403 | 429 | 503; body: GuardError };

export interface GuardError {
	error: string;
	resetsAt?: string;
}

export interface LogEntry {
	ts: string;
	ip: string;
	mode: ChatMode;
	type: RequestType;
	request: string;
	response: string;
	tokens: { input: number; output: number };
	durationMs: number;
}

export interface AbuseEvent {
	ts: string;
	ip: string;
	rule: string;
	snippet: string;
}

export interface AdminStats {
	requestsToday: number;
	uniqueIpsToday: number;
	blockedCount: number;
	abuseEventsLast24h: number;
	topIps: Array<{ ip: string; count: number; lastSeen: string }>;
}
