import Icon from '@ant-design/icons';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { Avatar, Button, Card, List, Modal, Spin, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { MdOutlineHideSource, MdOutlineLock, MdOutlineLockOpen } from 'react-icons/md';
import { ApplicationPage } from '../application';
import { useExecuteSetLocked } from '../contracts/smart-lock-nft/hooks/use-execute-set-locked';
import { useTokenListOf } from '../hooks/use-token-list-of';
import LockiiIcon from '../assets/svg/lockii-icon.svg';
import useDimensions from 'react-cool-dimensions';

export default function IndexPage() {
	const { observe, width } = useDimensions();

	const { address, connected } = useWallet();
	const { tokenList, onReloadTokenList } = useTokenListOf({ address: address || '' });

	const [loadingVisible, setLoadingVisible] = useState(false);
	const executeSetLocked = useExecuteSetLocked();
	const onSetLocked = useCallback(
		async (tokenId: string, locked: boolean) => {
			setLoadingVisible(true);
			await executeSetLocked(tokenId, locked);
			await onReloadTokenList();
			setLoadingVisible(false);
		},
		[executeSetLocked, onReloadTokenList],
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
											<Card
												style={{
													width: '100%',
													border: item.locked ? '4px solid #ff4d4f' : '4px solid #52c41a',
													borderRadius: 24,
												}}
											>
												<div style={{ width: '100%', height: 40, display: 'flex', flexDirection: 'row' }}>
													<div
														style={{
															height: '100%',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}
													>
														<Avatar
															size={48}
															icon={
																<Icon
																	component={!item.locked ? MdOutlineLockOpen : MdOutlineLock}
																	style={{ fontSize: 32, color: '#0d0d16' }}
																/>
															}
															style={{
																background: item.locked ? '#ff4d4f' : '#52c41a',
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
															}}
														/>
													</div>

													<div
														style={{
															flex: 1,
															height: '100%',
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															marginLeft: 24,
														}}
													>
														<div style={{ display: 'flex', flexDirection: 'column' }}>
															<Typography.Text style={{ marginTop: 0 }}>{'Device id'}</Typography.Text>
															<Typography.Text strong={true} style={{ marginTop: 0 }}>
																{item.id}
															</Typography.Text>
														</div>

														<Button
															type={'default'}
															icon={
																<Icon
																	component={item.locked ? MdOutlineLockOpen : MdOutlineLock}
																	style={{ color: '#0d0d16' }}
																/>
															}
															size={'large'}
															onClick={() => onSetLocked(item.id, !item.locked)}
															style={{ borderRadius: 20 }}
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

							<div ref={observe} style={{ width: '100%', position: 'absolute', bottom: -width / 1.5, margin: 0 }}>
								<LockiiIcon width={'100%'} />
							</div>
						</div>
					)}
				</div>

				<Modal visible={loadingVisible} width={120} centered={true} closable={false} maskClosable={false} footer={null}>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Icon component={LockiiIcon} spin={true} style={{ fontSize: 60 }} />
					</div>
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
