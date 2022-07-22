import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Link from "next/link";

import { contractAddress } from "../config";
import Warranty from "../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const warrantyContract = new ethers.Contract(
      contractAddress,
      Warranty.abi,
      signer
    );

    const data = await warrantyContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await warrantyContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let item = {
          name: meta.data.name,
          serialNumber: i.serialNumber,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          warrantyExpiry: new Date(
            i.warrantyExpiry.toNumber() * 1000
          ).toISOString(),
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Name - {nft.name}
                </p>
                <p className="text-2xl font-bold text-white">
                  Serial Number - {nft.serialNumber}
                </p>
                <p className="text-2xl font-bold text-white">
                  Owner - {nft.owner}
                </p>
                <p className="text-2xl font-bold text-white">
                  Warranty Expiry - {nft.warrantyExpiry}
                </p>
                <Link href={`/check-repair/${JSON.stringify(nft.tokenId)}`}>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded">
                    Check Repairs
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
