import { useCallback } from 'react';
import { SmartLockNftContract } from '../smart-lock-nft-contract';

export function useGetTokenListOf() {
	return useCallback(async (address: string, fromIndex?: number) => {
		if (!address.length) return [];

		try {
			const tokenList = await SmartLockNftContract.getTokenListOf({ address, fromIndex });
			return tokenList;
		} catch (error) {
			console.error('An error occurred loading tokenList');
			console.error(error);
		}
		return [];
	}, []);
}
