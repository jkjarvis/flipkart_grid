import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";

import { contractAddress } from "../config";

import styles from '../styles/CreateMinter.module.scss';

import Warrenty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function CreateMinter() {
  const [formInput, updateFormInput] = useState({
    minterAddress: "",
  });
  const router = useRouter();

  async function createMinter() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(contractAddress, Warrenty.abi, signer);
    let transaction = await contract
      .grantMinterRole(formInput.minterAddress)
      .catch((e) => console.log(e));

    await transaction.wait();

    router.push("/");
  }

  return (
    <div className={styles.container}>
        <input
          placeholder="Serial Number"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, minterAddress: e.target.value })
          }
        />
        <button
          onClick={createMinter}
          className={styles.mintButton}
        >
          Create Minter
        </button>
    </div>
  );
}
