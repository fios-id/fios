import { useState } from "react";
import { useSignMessage } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import kavach from "@lighthouse-web3/kavach";

interface UploadResult {
  success: boolean;
  data?: {
    hash: string;
    name: string;
    size: string;
    url: string;
  };
  error?: string;
}

export function useLighthouse() {
  const [isLoading, setIsLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const getAuthToken = async (address: string): Promise<string> => {
    try {
      const {
        data: { message },
      } = await lighthouse.getAuthMessage(address);
      if (!message) {
        throw new Error("Lighthouse.getAuthMessage returned null message");
      }
      const signedMessage = await signMessageAsync({ message });
      const { JWT, error } = await kavach.getJWT(address, signedMessage);
      if (error) {
        throw new Error("Failed to get JWT token");
      }
      return JWT;
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw new Error("Failed to authenticate with Lighthouse");
    }
  };

  const uploadFile = async (
    file: File,
    address: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> => {
    if (!process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY) {
      throw new Error("NEXT_PUBLIC_LIGHTHOUSE_API_KEY is not set");
    }

    try {
      setIsLoading(true);
      const token = await getAuthToken(address);

      const progressCallback = ({ progress }: { progress: number }) => {
        onProgress?.(progress * 100);
      };

      const output = await lighthouse.uploadEncrypted(
        [file],
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
        address,
        token,
        progressCallback
      );

      const [uploadedFile] = output.data;

      return {
        success: true,
        data: {
          hash: uploadedFile.Hash,
          name: uploadedFile.Name,
          size: uploadedFile.Size,
          url: `https://gateway.lighthouse.storage/ipfs/${uploadedFile.Hash}`,
        },
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    isLoading,
  };
}
