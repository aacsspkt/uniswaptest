import { ChainId, Token, TradeType } from "@uniswap/sdk-core";

import { swap } from "./swap";
import { getProvider, getWallet } from "./utils";

async function main() {
	const provider = getProvider();
	const wallet = getWallet(provider);
	console.log("wallet publickey:", wallet.address);

	const recipient = "0xe410798397E63595346699C61c1BB4Bc782e5857";
	const inToken = new Token(
		ChainId.SEPOLIA,
		"0x6c16C2F19d0eb0091f2216aDdA712da7622F9c62",
		18,
		"MYMEME",
		"My Meme",
	);
	const inAmount = "1";
	const outToken = new Token(
		ChainId.SEPOLIA,
		"0xA2d62ee73BA9F9c791F6F4A73889fA28301C16ea",
		18,
		"MYUSDC",
		"My USDC",
	);

	const tx = await swap(wallet, inToken, outToken, inAmount, recipient, TradeType.EXACT_INPUT, {
		deadline: Math.floor(Date.now() / 1000 + 1800),
		slippage: 0.5,
	});

	console.log("tx:", tx);
}

main();
