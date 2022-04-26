import Head from 'next/head';
import React from 'react';
import { Application } from '../application';

// Use require instead of import, and order matters
require('../styles/global.css');
require('@rentfuse-labs/neo-wallet-adapter-ant-design/styles.css');

export default function _App({ Component, pageProps }: any) {
	return (
		<Application>
			<Head>
				<link rel="shortcut icon" href="favicon/favicon.ico" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" />

				<title>Lockii</title>
				<meta name="description" content="A smart lock device managed by NFTs on the Neo blockchain" />
			</Head>

			<Component {...pageProps} />
		</Application>
	);
}
