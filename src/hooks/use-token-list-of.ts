import { useState, useCallback, useEffect } from 'react';
import { useGetTokenListOf } from '../contracts/smart-lock-nft/hooks/use-get-token-list-of';
import { Token } from '../contracts/smart-lock-nft/interfaces/token';

export const MAX_LOAD_TOKEN = 10;

export function useTokenListOf({ address }: { address: string }) {
	const [tokenList, setTokenList] = useState<Token[]>([]);

	const getTokenList = useGetTokenListOf();

	const onGetMoreTokenList = useCallback(async () => {
		// Calculate fromIndex based on last token
		const fromIndex = tokenList.length ? tokenList.length - 1 : 0;
		// Load tokenList
		const loadedTokenList = await getTokenList(address, fromIndex > 0 ? fromIndex : 0);

		// Load a max amount of tokenList and return true to say that there are more
		if (loadedTokenList.length > MAX_LOAD_TOKEN) {
			setTokenList((_tokenList) => _tokenList.concat(loadedTokenList.slice(0, MAX_LOAD_TOKEN)));
			return true;
		}
		// Just add loaded tokenList saying that i've not anymore to load
		setTokenList((_tokenList) => _tokenList.concat(loadedTokenList));
		return false;
	}, [address, tokenList, getTokenList]);

	const onClearTokenList = useCallback(() => {
		setTokenList([]);
	}, []);

	const onReloadTokenList = useCallback(async () => {
		const loadedTokenList = await getTokenList(address, 0);
		setTokenList(loadedTokenList.length > MAX_LOAD_TOKEN ? loadedTokenList.slice(0, MAX_LOAD_TOKEN) : loadedTokenList);
	}, [address, getTokenList]);

	useEffect(() => {
		onReloadTokenList();
	}, [onReloadTokenList]);

	return { tokenList, onGetMoreTokenList, onClearTokenList, onReloadTokenList };
}
