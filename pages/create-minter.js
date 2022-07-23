import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";

import { contractAddress } from "../config";

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
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Serial Number"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, minterAddress: e.target.value })
          }
        />
        <button
          onClick={createMinter}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Minter
        </button>
      </div>
    </div>
  );
}
