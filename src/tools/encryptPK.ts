import { walletData } from ".";
import { Wallet, utils } from "ethers";
import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";
import { isHexString } from "@ethersproject/bytes";
import { scrypt } from "crypto";

export async function encrypt(
  pk: string | utils.BytesLike | utils.SigningKey,
  password: string
): Promise<walletData> {
  let lock = false;
  try {
    const wallet = new Wallet(pk);
    let jsonResult;
    if (isAccount(wallet)) {
      jsonResult = await wallet.encrypt(password);
    } else {
      throw new Error("Encrypt, Private key is not a valid wallet");
    }
    let result: walletData = {
      address: wallet.address,
      walletType: "EVM",
      encryptedJson: jsonResult,
    };
    return result;
  } catch (error) {
    throw error;
  } finally {
    lock = false;
  }
}

export function isAccount(value: any): value is ExternallyOwnedAccount {
  return (
    value != null && isHexString(value.privateKey, 32) && value.address != null
  );
}
