import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useCallback } from 'react';
import { SmartLockNftContract } from '../smart-lock-nft-contract';

export function useExecuteSetLocked() {
	const { address, invoke } = useWallet();

	return useCallback(
		async (tokenId: string, locked: boolean) => {
			if (!address) return;

			try {
				await SmartLockNftContract.setLocked({ tokenId, locked }, address, invoke);
			} catch (error) {
				console.error('An error occurred executing set locked');
				console.error(error);
			}
		},
		[address, invoke],
	);
}
