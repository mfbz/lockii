import {
	getNeoLineWallet,
	getO3Wallet,
	getNeonWalletConnectWallet,
	getOneGateWallet,
} from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { useMemo } from 'react';
import { NeoConstants } from '../../constants';

export function useWallets() {
	return useMemo(() => {
		return [
			getNeoLineWallet(),
			getO3Wallet(),
			getNeonWalletConnectWallet({
				options: {
					chains: [NeoConstants.DEFAULT_NETWORK === 'mainnet' ? 'neo3:mainnet' : 'neo3:testnet'],
					methods: ['invokeFunction'],
					appMetadata: {
						name: 'Lockii',
						description: 'A smart lock device managed by NFTs on the Neo blockchain',
						url: 'https://www.lockii.com',
						icons: ['https://www.lockii.com/images/lockii-icon.png'],
					},
				},
				logger: 'debug',
				relayProvider: 'wss://relay.walletconnect.org',
			}),
			getOneGateWallet(),
		];
	}, []);
}
