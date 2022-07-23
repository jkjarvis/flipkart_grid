import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import { contractAddress } from "../../config";
import Warranty from "../../artifacts/contracts/WarrantyNFT.sol/Warranty.json";

export default function MakeRepair() {
  const [repairs, setRepairs] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  const { token } = router.query;
  const [tokenId, setToken] = useState(token);

  useEffect(() => {
    loadRepairs(tokenId);
  });

  async function loadRepairs(token) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const warrantyContract = new ethers.Contract(
      contractAddress,
      Warranty.abi,
      signer
    );
    console.log("token: ", token);
    const data = await warrantyContract
      .checkRepairs(0)
      .catch((e) => console.log(e));
    console.log("data: ", data);
    const repairs = await Promise.all(
      data.map(async (i) => {
        let repair = {
          date: new Date(i.date.toNumber() * 1000).toISOString(),
          description: i.description,
        };
        return repair;
      })
    );
    console.log(repairs);
    setRepairs(repairs);

    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !repairs.length)
    return <h1 className="py-10 px-20 text-3xl">No Repairs done yet!</h1>;

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {repairs.map((repair, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Date - {repair.date}
                </p>
                <p className="text-2xl font-bold text-white">
                  Description - {repair.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
