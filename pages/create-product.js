import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import { create } from "ipfs-http-client";

import { contractAddress } from "../config";

import Warrenty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

const client = create("https://ipfs.infura.io:5001");

export default function CreateProduct() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    serialNumber: "",
    name: "",
    description: "",
    warrantyDays: "",
    customerAddress: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log("url: ", url);
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadToIPFS() {
    const { serialNumber, name, description, warrantyDays, customerAddress } =
      formInput;
    if (
      !name ||
      !description ||
      !serialNumber ||
      !fileUrl ||
      !warrantyDays ||
      !customerAddress
    )
      return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      serialNumber,
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function mintNFTToCustomer() {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(contractAddress, Warrenty.abi, signer);
    let transaction = await contract
      .safeMint(
        formInput.customerAddress,
        url,
        formInput.serialNumber,
        formInput.warrantyDays
      )
      .catch((e) => alert(e));
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
            updateFormInput({ ...formInput, serialNumber: e.target.value })
          }
        />
        <input
          placeholder="Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Warranty Days"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, warrantyDays: e.target.value })
          }
        />
        <input
          placeholder="Customer Wallet Address"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, customerAddress: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={mintNFTToCustomer}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
