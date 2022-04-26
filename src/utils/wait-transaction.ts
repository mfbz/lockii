import { rpc } from '@cityofzion/neon-js';
import { sleep } from './sleep';

// Returns true if found executed, false if executed with error and throws if txid not found
export async function waitTransaction(
	rpcAddress: string,
	txId: string,
	scriptHash: string,
	eventName: string,
	readFrequency = 1000,
	timeout = 30000,
) {
	const start = Date.now();
	const rpcClient = new rpc.RPCClient(rpcAddress);

	let applicationLog;
	do {
		// Throw an error if the timeout has passed
		if (Date.now() - start > timeout) throw new Error();

		try {
			applicationLog = await rpcClient.getApplicationLog(txId);
		} catch (e) {
			// Hehe :)
		}
		await sleep(readFrequency);
	} while (!applicationLog);

	// Return selected one
	return (
		applicationLog.executions
			.reduce((result, current) => result.concat(current.notifications), [] as any)
			.find((n: any) => n.contract === scriptHash && n.eventname === eventName) !== undefined
	);
}
