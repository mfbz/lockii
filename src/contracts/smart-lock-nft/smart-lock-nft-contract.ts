import Neon, { wallet } from '@cityofzion/neon-js';
import { WitnessScope } from '@rentfuse-labs/neo-wallet-adapter-base';
import { NeoConstants } from '../../constants';
import { toInvocationArgument, toDecodedValue } from '../../utils/converter';
import { waitTransaction } from '../../utils/wait-transaction';
import { Token } from './interfaces/token';

export class SmartLockNftContract {
	static setLocked = async (
		{ tokenId, locked }: { tokenId: string; locked: boolean },
		signer: string,
		onInvoke: (props: any) => Promise<any>,
	) => {
		const result = await onInvoke({
			scriptHash: NeoConstants.NETWORK_DATA.lockiiContracts.smartLock,
			operation: 'setLocked',
			args: [toInvocationArgument('ByteArray', tokenId), toInvocationArgument('Boolean', locked)],
			signers: [
				{
					account: wallet.getScriptHashFromAddress(signer),
					scopes: WitnessScope.CalledByEntry,
				},
			],
		});

		if (!result.data?.txId) {
			throw new Error('Invalid transaction id');
		}

		const response = await waitTransaction(
			NeoConstants.NETWORK_DATA.rpcUrl,
			result.data?.txId,
			NeoConstants.NETWORK_DATA.lockiiContracts.smartLock,
			'OnLockedChanged',
		);
		if (!response) {
			throw new Error('Transaction not found');
		}
	};

	static getLocked = async ({ tokenId }: { tokenId: string }) => {
		const result = await SmartLockNftContract.getContract().testInvoke('getLocked', [
			toInvocationArgument('ByteArray', tokenId) as any,
		]);
		return toDecodedValue('boolean', result.stack[0].value);
	};

	static getTokenListOf = async ({ address, fromIndex }: { address: string; fromIndex?: number }) => {
		const result = await SmartLockNftContract.getContract().testInvoke('getTokenListOf', [
			toInvocationArgument('Hash160', address) as any,
			toInvocationArgument('Integer', fromIndex !== undefined ? fromIndex : 0) as any,
		]);
		return SmartLockNftContract.parseTokenList(result.stack[0]);
	};

	private static getContract = () => {
		return new Neon.experimental.SmartContract(
			Neon.u.HexString.fromHex(NeoConstants.NETWORK_DATA.lockiiContracts.smartLock),
			{
				networkMagic: NeoConstants.NETWORK_DATA.networkMagic,
				rpcAddress: NeoConstants.NETWORK_DATA.rpcUrl,
			},
		);
	};

	private static parseToken = ({ type, value }: { type: any; value?: any }) => {
		return {
			id: toDecodedValue('bytestring', value[0].value),
			owner: toDecodedValue('address', value[1].value),
			locked: toDecodedValue('boolean', value[2].value),
		} as Token;
	};

	private static parseTokenList = ({ type, value }: { type: any; value?: any }) => {
		const tokenList = [];
		for (const element of value) {
			const token = SmartLockNftContract.parseToken(element);
			if (token !== null) {
				tokenList.push(token);
			}
		}
		return tokenList;
	};
}
