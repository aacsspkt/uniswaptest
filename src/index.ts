import { ethers } from "ethers";

import { ChainId, Token, TradeType } from "@uniswap/sdk-core";

import { WETH } from "./constants";
import ERC20_ABI from "./ERC20Abi.json";
import { swap } from "./swap";
import { getProvider, getWallet } from "./utils";

async function main() {
	const provider = getProvider();
	const wallet = getWallet(provider);
	console.log("wallet publickey:", wallet.address);

	const recipient = "0xe410798397E63595346699C61c1BB4Bc782e5857";
	// const inToken = new Token(
	// 	ChainId.SEPOLIA,
	// 	"0x6c16C2F19d0eb0091f2216aDdA712da7622F9c62",
	// 	18,
	// 	"MYMEME",
	// 	"My Meme",
	// );
	const inToken = WETH[11155111];
	const inAmount = "0.01";
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

	console.log("\n" + JSON.stringify(tx));

	const receipt = await tx.wait();

	console.log("\n" + JSON.stringify(receipt));

	const iface = new ethers.utils.Interface(ERC20_ABI);
	const events = receipt.logs
		.filter((log) => log.address.toLowerCase() === outToken.address.toLowerCase())
		.map((log) => {
			try {
				return iface.parseLog(log);
			} catch (err) {
				return;
			}
		});
	console.log("events:", events);

	const rightEvent = events.find((ev) => {
		console.log("ev", ev);
		console.log("ev name", ev?.name);
		console.log("ev args", ev?.args);
		console.log("ev args", ev?.args[0], ev?.args[1], ev?.args[2]);
		return ev?.name === "Transfer" && ev?.args[1].toLowerCase() == recipient.toLowerCase();
	});
	console.log("revents:", rightEvent);

	if (rightEvent) {
		console.log("from:", rightEvent.args[0]);
		console.log("value:", ethers.utils.formatUnits(rightEvent.args[2], outToken.decimals));
	}
}

main();
