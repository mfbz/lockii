import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { Avatar, Modal, Button, Card, List, Typography, Spin } from 'antd';
import Head from 'next/head';
import { ApplicationPage } from '../application';
import Icon from '@ant-design/icons';
import { useTokenListOf } from '../hooks/use-token-list-of';
import { MdOutlineHideSource, MdOutlineLockOpen, MdOutlineLock } from 'react-icons/md';
import { useExecuteSetLocked } from '../contracts/smart-lock-nft/hooks/use-execute-set-locked';
import { useCallback, useState } from 'react';

export default function IndexPage() {
	const { address, connected } = useWallet();
	const { tokenList } = useTokenListOf({ address: address || '' });

	const [loadingVisible, setLoadingVisible] = useState(false);
	const executeSetLocked = useExecuteSetLocked();
	const onSetLocked = useCallback(
		async (tokenId: string, locked: boolean) => {
			setLoadingVisible(true);
			await executeSetLocked(tokenId, locked);
			setLoadingVisible(false);
		},
		[executeSetLocked],
	);

	return (
		<>
			<ApplicationPage>
				<Head>
					<title>Lockii</title>
				</Head>

				<div className={'p-index-wrapper'}>
					{address && connected ? (
						<div className={'p-index-list'}>
							<List
								dataSource={tokenList}
								rowKey={(item) => item.id}
								renderItem={(item) => {
									return (
										<List.Item style={{ marginBottom: 24 }}>
											<Card style={{ boxShadow: item.locked ? '0 2px 12px #ff4d4f' : '0 2px 12px #52c41a' }}>
												<div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row' }}>
													<div
														style={{
															width: 100,
															height: '100%',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}
													>
														<Avatar
															size={80}
															icon={<Icon component={MdOutlineHideSource} style={{ fontSize: 64, color: '#0d0d16' }} />}
															style={{ background: item.locked ? '#ff4d4f' : '#52c41a' }}
														/>
													</div>
													<div
														style={{
															flex: 1,
															height: '100%',
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
														}}
													>
														<Typography.Text strong={true} style={{ marginTop: 0 }}>
															{item.id}
														</Typography.Text>

														<Button
															type={'primary'}
															icon={
																<Icon
																	component={item.locked ? MdOutlineLockOpen : MdOutlineLock}
																	style={{ color: '#0d0d16' }}
																/>
															}
															size={'large'}
															onClick={() => onSetLocked(item.id, !item.locked)}
														>
															{item.locked ? 'Unlock' : 'Lock'}
														</Button>
													</div>
												</div>
											</Card>
										</List.Item>
									);
								}}
								locale={{
									emptyText: (
										<div
											style={{
												width: '100%',
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<Icon component={MdOutlineHideSource} style={{ fontSize: 80 }} />
											<Typography.Title level={4} style={{ marginTop: 0 }}>
												{'No devices found'}
											</Typography.Title>
										</div>
									),
								}}
							/>
						</div>
					) : (
						<div className={'p-index-hero'}>
							<Typography.Title>{'Smart lock made easy'}</Typography.Title>
							<Typography.Title level={4} style={{ marginTop: 0 }}>
								{'Your new Neo blockchain powered IoT device'}
							</Typography.Title>
						</div>
					)}
				</div>

				<Modal visible={loadingVisible} width={260} centered={true} closable={false} maskClosable={false} footer={null}>
					<Spin />
				</Modal>
			</ApplicationPage>

			<style jsx>{`
				.p-index-wrapper {
					width: 100%;
					height: 100%;
				}

				.p-index-list {
					width: 100%;
					height: 100%;
				}

				.p-index-hero {
					width: 100%;
					height: 100%;
					font-size: 24px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
			`}</style>
		</>
	);
}
