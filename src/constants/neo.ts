export type NetworkType = 'mainnet' | 'testnet';

export interface NetworkDataMap {
	[index: string]: {
		rpcUrl: string;
		networkMagic: number;
		nativeContracts: {
			[index: string]: string;
		};
		lockiiContracts: {
			[index: string]: string;
		};
	};
}

// Contains all needed data divided depending on network type
const NETWORK_DATA_MAP = {
	mainnet: {
		rpcUrl: 'https://mainnet1.neo.coz.io:443',
		networkMagic: 860833102,
		nativeContracts: {
			neoToken: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gasToken: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
		lockiiContracts: {
			smartLock: '',
		},
	},
	testnet: {
		rpcUrl: 'https://testnet1.neo.coz.io:443',
		networkMagic: 877933390,
		nativeContracts: {
			neoToken: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
			gasToken: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
		},
		lockiiContracts: {
			smartLock: '0xc1b99a1a4332212b7ae1b52f154996b1dadd2331',
		},
	},
} as NetworkDataMap;

export class NeoConstants {
	public static DEFAULT_NETWORK = 'testnet';
	public static NETWORK_DATA = NETWORK_DATA_MAP[NeoConstants.DEFAULT_NETWORK];
}
