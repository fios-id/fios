import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { FIOS_ABI, FIOS_CONTRACT_ADDRESS } from "@/contracts/abi";
import { parseEther } from "viem";
import { useMemo } from "react";

export interface UserDocument {
  cid: string;
  status: AttestationStatus;
  rejectionReason: string;
}

export enum AttestationStatus {
  Pending,
  Approved,
  Rejected,
}

export const useUserDocuments = (address: `0x${string}`) => {
  // Read functions
  const { data: _userDocuments, isLoading } = useReadContract({
    address: FIOS_CONTRACT_ADDRESS,
    abi: FIOS_ABI,
    functionName: "getUserDocuments",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  return useMemo(() => {
    if (!_userDocuments) return { documents: [], isLoading };
    const [cid, status, attester] = _userDocuments;
    const documents = [];
    for (let i = 0; i < cid.length; i++) {
      documents.push({
        cid: cid[i],
        status: status[i],
        attester: attester[i],
      });
    }
    return { documents, isLoading };
  }, [_userDocuments]);
};

export function useFiosContract() {
  const { address } = useAccount();

  const { documents: userDocuments } = useUserDocuments(address!);

  const { data: _pendingDocuments } = useReadContract({
    address: FIOS_CONTRACT_ADDRESS,
    abi: FIOS_ABI,
    functionName: "getMyPendingDocuments",
    query: {
      enabled: !!address,
    },
  });

  const { data: isAttester } = useReadContract({
    address: FIOS_CONTRACT_ADDRESS,
    abi: FIOS_ABI,
    functionName: "isAttester",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const pendingDocuments = useMemo(() => {
    if (!_pendingDocuments) return [];
    const [addresses, indices, cids] = _pendingDocuments;
    const documents = [];
    for (let i = 0; i < addresses.length; i++) {
      documents.push({
        address: addresses[i],
        index: indices[i],
        cid: cids[i],
      });
    }
    return documents;
  }, [_pendingDocuments]);

  // Write functions
  const { writeContractAsync } = useWriteContract();

  const submitDocument = async (cid: string) =>
    await writeContractAsync({
      address: FIOS_CONTRACT_ADDRESS,
      abi: FIOS_ABI,
      functionName: "submitDocument",
      args: [cid],
    });

  const becomeAttester = async () =>
    await writeContractAsync({
      address: FIOS_CONTRACT_ADDRESS,
      abi: FIOS_ABI,
      functionName: "becomeAttester",
      args: [],
      value: parseEther("0.001"),
    });

  const approveDocument = async (address: `0x${string}`, index: bigint) =>
    await writeContractAsync({
      address: FIOS_CONTRACT_ADDRESS,
      abi: FIOS_ABI,
      functionName: "approveDocument",
      args: [address, index],
    });

  const rejectDocument = async (
    address: `0x${string}`,
    index: bigint,
    reason: string
  ) =>
    await writeContractAsync({
      address: FIOS_CONTRACT_ADDRESS,
      abi: FIOS_ABI,
      functionName: "rejectDocument",
      args: [address, index, reason],
    });

  const { data: statistics } = useReadContract({
    address: FIOS_CONTRACT_ADDRESS,
    abi: FIOS_ABI,
    functionName: "getStatistics",
  });

  const [totalDocuments, totalApproved, totalAttesters] = statistics ?? [
    0, 0, 0,
  ];

  return {
    userDocuments,
    pendingDocuments,
    submitDocument,
    becomeAttester,
    isAttester,
    approveDocument,
    rejectDocument,
    statistics: {
      totalDocuments,
      totalApproved,
      totalAttesters,
    },
  };
}
