import { Layout } from 'antd';
import React from 'react';

export const ApplicationPage = React.memo(function ApplicationPage({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Layout.Content className={'a-content'}>
				<div className={'a-content-wrapper'}>{children}</div>
			</Layout.Content>

			<style jsx>{`
				:global(.a-content) {
					width: 100%;
					height: 100%;
				}

				.a-content-wrapper {
					width: 100%;
					height: 100%;
					padding: 24px 48px 24px 48px;
				}
			`}</style>
		</>
	);
});
