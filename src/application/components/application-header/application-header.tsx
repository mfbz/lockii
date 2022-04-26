import { WalletDisconnectButton, WalletMultiButton } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { Layout } from 'antd';
import React from 'react';
import { ApplicationLogo } from './components/application-logo';

export const HEADER_HEIGHT = 120;

export const ApplicationHeader = React.memo(function ApplicationHeader() {
	const { connected } = useWallet();

	return (
		<>
			<Layout.Header className={'a-header'}>
				<div className={'a-header-wrapper'}>
					<div className={'a-header-content'}>
						<ApplicationLogo />

						<div className={'a-header-nav'}>
							<div className={'a-header-extra'}>
								{!connected ? <WalletMultiButton size={'middle'} /> : <WalletDisconnectButton size={'middle'} />}
							</div>
						</div>
					</div>
				</div>
			</Layout.Header>

			<style jsx>{`
				:global(.a-header) {
					width: 100%;
					padding: 0px;
					background: #ffffff;
				}

				.a-header-wrapper {
					width: 100%;
					display: flex;
					flex-direction: column;
				}

				.a-header-content {
					width: 100%;
					height: ${HEADER_HEIGHT}px;
					padding: 0px 48px 0px 48px;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.a-header-nav {
					height: 100%;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
				}

				.a-header-nav-wrapper {
					height: 100%;
					margin-left: 24px;
					margin-right: 24px;
				}

				.a-header-extra {
					height: 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
				}
			`}</style>
		</>
	);
});
