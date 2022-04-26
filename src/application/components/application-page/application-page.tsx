import { Layout } from 'antd';
import React from 'react';

export const ApplicationPage = React.memo(function ApplicationPage({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Layout.Content className={'a-content'}>
				<div className={'a-content-wrapper'}>
					<div className={'a-inner'}>
						<div className={'a-inner-wrapper'}>{children}</div>
					</div>
				</div>
			</Layout.Content>

			<style jsx>{`
				div :global(.a-content) {
					width: 100%;
					height: 100%;
				}

				.a-content-wrapper {
					width: 100%;
				}

				.a-inner {
					width: 100%;
					padding: 24px 48px 24px 48px;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: visible;
				}

				.a-inner-wrapper {
					width: 100%;
				}
			`}</style>
		</>
	);
});
