import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export function getProvider() {
	const url = process.env.RPC_URL || "";

	if (url === "") {
		throw new Error("Missing env variable RPC_URL");
	}

	return new ethers.providers.JsonRpcProvider(url);
}

export function getWallet(provider: ethers.providers.Provider) {
	const privateKey = process.env.SECRET_KEY;

	if (!privateKey || privateKey === "") {
		throw new Error("Missing env variable SECRET_KEY");
	}

	return new ethers.Wallet(privateKey, provider);
}

export enum TransactionState {
	Failed = "Failed",
	New = "New",
	Rejected = "Rejected",
	Sending = "Sending",
	Sent = "Sent",
}
