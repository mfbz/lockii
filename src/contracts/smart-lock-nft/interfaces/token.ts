export interface Token {
	// The unique identifier of the token
	id: string;
	// The owner of the token
	owner: string;
	// The locked state of the token
	locked: boolean;
}
