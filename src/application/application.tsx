import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import React from 'react';
import { ApplicationHeader } from './components/application-header';
import { ApplicationLayout } from './components/application-layout';
import { useWallets } from './hooks/use-wallets';

export const Application = React.memo(function Application({ children }: { children: React.ReactNode }) {
	const wallets = useWallets();

	return (
		<>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider centered={false} featuredWallets={4}>
					<ApplicationLayout>
						<ApplicationHeader />
						<div className={'a-application-wrapper'}>{children}</div>
					</ApplicationLayout>
				</WalletModalProvider>
			</WalletProvider>

			<style jsx>{`
				.a-application-wrapper {
					width: 100%;
					min-height: 100vh;
					display: flex;
					flex-direction: column;
				}
			`}</style>
		</>
	);
});
