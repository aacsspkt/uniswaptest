import { ChainId, Token } from "@uniswap/sdk-core";

export const ERC20_ABI = [
	// Read-Only Functions
	"function balanceOf(address owner) view returns (uint256)",
	"function decimals() view returns (uint8)",
	"function symbol() view returns (string)",

	// Authenticated Functions
	"function transfer(address to, uint amount) returns (bool)",
	"function approve(address _spender, uint256 _value) returns (bool)",

	// function to get allowance
	"function allowance(address _owner, address _spender) view returns (uint256)",

	// Events
	"event Transfer(address indexed from, address indexed to, uint amount)",
];

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 10000;

export const WETH = {
	[ChainId.SEPOLIA]: new Token(
		ChainId.SEPOLIA,
		"0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
		18,
		"WETH",
		"Wrapped Eth",
	),
	[ChainId.MAINNET]: new Token(
		ChainId.MAINNET,
		"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		18,
		"WETH",
		"Wrapped Eth",
	),
};
