import Link from 'next/link';
import React from 'react';
import LockiiLogo from '../../../../assets/svg/lockii-logo.svg';

export const ApplicationLogo = React.memo(function ApplicationLogo() {
	return (
		<>
			<div>
				<Link href={'/'}>
					<a className={'g-link-no-border'}>
						<LockiiLogo height={40} />
					</a>
				</Link>
			</div>

			<style jsx>{`
				div :global(a) {
					display: flex;
					align-items: center;
				}
			`}</style>
		</>
	);
});
