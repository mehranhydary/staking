import { useQuery, QueryConfig } from 'react-query';

import snxData from 'synthetix-data';

import QUERY_KEYS from 'constants/queryKeys';
import { useRecoilValue } from 'recoil';
import { isWalletConnectedState, networkState, walletAddressState } from 'store/wallet';
import { flatten } from 'lodash';
import { FeeClaimedHistory } from './types';

export const TRANSACTION_EVENTS = [
	'issued',
	'burned',
	'feesClaimed',
	'exchanged',
	'cleared',
	'bought',
	'deposit',
	'withdrawl',
	'removal',
];

const useFeeClaimHistoryQuery = (options?: QueryConfig<FeeClaimedHistory>) => {
	const isWalletConnected = useRecoilValue(isWalletConnectedState);
	const walletAddress = useRecoilValue(walletAddressState);
	const network = useRecoilValue(networkState);
	return useQuery<FeeClaimedHistory>(
		QUERY_KEYS.Staking.FeeClaimHistory(walletAddress ?? '', network?.id!),
		async () => {
			const [feesClaimed] = await Promise.all([
				snxData.snx.feesClaimed({ account: walletAddress }),
			]);
			const feesClaimedHistory = flatten(
				[feesClaimed].map((eventType) => {
					return eventType.map((event: any) => {
						return event;
					});
				})
			);
			return {
				feesClaimedHistory,
			};
		},
		{
			enabled: snxData && isWalletConnected,
			...options,
		}
	);
};

export default useFeeClaimHistoryQuery;
