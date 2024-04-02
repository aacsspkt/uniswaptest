import { BigNumber, ethers } from "ethers";

import { ChainId, Currency, Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
	AlphaRouter,
	parseAmount,
	SWAP_ROUTER_02_ADDRESSES,
	SwapOptionsSwapRouter02,
	SwapType,
} from "@uniswap/smart-order-router";

import { ERC20_ABI, WETH } from "./constants";
import { Ether } from "./ethers";
import { getProvider } from "./utils";

interface SwapOptions {
	slippage: number;
	deadline: number;
}

export async function swap(
	signer: ethers.Signer,
	inToken: Token,
	outToken: Token,
	inAmount: string,
	recipient: string,
	tradeType: TradeType,
	options: SwapOptions,
) {
	const chainId = ChainId.SEPOLIA;
	const provider = getProvider();
	const SWAP_ROUTER_ADDRESS = SWAP_ROUTER_02_ADDRESSES(chainId);

	const from = await signer.getAddress();
	console.log("from:", from);

	let inputToken: Currency = inToken;
	let outputToken: Currency = outToken;
	console.log("outtoken:", outputToken.address);

	if (inToken.address.toLowerCase() === WETH[chainId].address.toLowerCase()) {
		inputToken = Ether.onChain(chainId);
	}

	const amount = parseAmount(inAmount, inputToken);
	console.log("amount exact:", amount.toExact());

	const router = new AlphaRouter({
		chainId,
		provider,
	});

	const swapConfig: SwapOptionsSwapRouter02 = {
		recipient,
		slippageTolerance: new Percent(Math.floor(options.slippage * 10_000), 10_000),
		deadline: options.deadline,
		type: SwapType.SWAP_ROUTER_02,
	};
	console.log("swapconfig:", swapConfig);

	const route = await router.route(amount, outputToken, tradeType, swapConfig);
	console.log("route:", route);

	if (!route) {
		throw new Error("Could not find route.");
	}

	// approve token
	if (!inputToken.isNative) {
		const tokenContract = new ethers.Contract(inToken.address, ERC20_ABI, provider);
		// Check if the allowance is already enough
		const allowance = await tokenContract.allowance(from, SWAP_ROUTER_ADDRESS);

		const parsedAmt = ethers.utils.parseUnits(amount.toExact(), inToken.decimals);
		if (allowance.lt(parsedAmt)) {
			const transaction = await tokenContract.connect(signer).approve(
				SWAP_ROUTER_ADDRESS,
				parsedAmt.sub(allowance).toString(),
				// {
				// 	maxFeePerGas: MAX_FEE_PER_GAS,
				// 	maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
				// }
			);
			await transaction.wait();
		}
	}

	const transaction = {
		data: route.methodParameters?.calldata,
		to: SWAP_ROUTER_ADDRESS,
		value: route?.methodParameters?.value
			? BigNumber.from(route.methodParameters.value)
			: undefined,
		from,
		// maxFeePerGas: BigNumber.from(MAX_FEE_PER_GAS),
		// maxPriorityFeePerGas: BigNumber.from(MAX_PRIORITY_FEE_PER_GAS),
	};

	return signer.sendTransaction(transaction);
}
