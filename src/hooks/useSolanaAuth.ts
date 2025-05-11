"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface SolanaAuthUser {
  walletAddress: string;
  name?: string;
}

export const useSolanaAuth = () => {
  const {
    publicKey,
    connected,
    disconnect,
    connect,
    signMessage,
    connecting,
    wallet,
  } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<SolanaAuthUser | null>(null);
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const clearAuthData = useAuthStore((state) => state.clearAuthData);

  // Check if there's already a wallet session when component mounts
  useEffect(() => {
    const checkExistingSession = async () => {
      if (connected && publicKey) {
        setUser({ walletAddress: publicKey.toString() });
      }
    };

    checkExistingSession();
  }, [connected, publicKey]);

  const loginWithWallet = async (destination = "quiz") => {
    try {
      if (!wallet) {
        toast.error("Please connect a wallet first", {
          className: toastStyles.error,
        });
        return;
      }

      if (connecting) {
        return;
      }

      if (!connected) {
        try {
          await connect();
        } catch (err) {
          console.error("Failed to connect wallet:", err);
          toast.error("Failed to connect wallet", {
            className: toastStyles.error,
          });
          return;
        }
      }

      if (!publicKey || !signMessage) {
        toast.error("Wallet doesn't support message signing", {
          className: toastStyles.error,
        });
        return;
      }

      setIsVerifying(true);

      // Generate a challenge for the user to sign
      const challenge = await fetchAuthChallenge(publicKey.toString());

      // Convert challenge string to Uint8Array to be signed
      const message = new TextEncoder().encode(challenge);

      // Sign the message
      const signature = await signMessage(message);

      // Verify the signature on the server
      const { token, user } = await verifySignature(
        publicKey.toString(),
        challenge,
        Array.from(signature)
      );

      // Save auth data
      setAuthData(token, {
        id: publicKey.toString(),
        walletAddress: publicKey.toString(),
        ...user,
      });

      // Set cookie for SSR auth
      document.cookie = `token=${token}; path=/; max-age=604800`;

      toast.success("Successfully authenticated with wallet", {
        className: toastStyles.success,
      });

      setUser({
        walletAddress: publicKey.toString(),
        name: user?.name,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.replace(`/${destination}`);
    } catch (error) {
      console.error("Wallet login failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to authenticate with wallet";
      toast.error(errorMessage, {
        className: toastStyles.error,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const logoutWallet = async () => {
    try {
      await disconnect();
      setUser(null);
      clearAuthData();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isAuthenticated = () => {
    return !!user?.walletAddress;
  };

  return {
    user,
    loginWithWallet,
    logoutWallet,
    isAuthenticated,
    isVerifying,
    publicKey,
    connected,
    connecting,
    wallet,
  };
};

// Helper functions for server communication
async function fetchAuthChallenge(walletAddress: string): Promise<string> {
  try {
    const response = await axios.post("/api/auth/solana/challenge", {
      walletAddress,
    });
    return response.data.challenge;
  } catch (error) {
    console.error("Failed to fetch challenge:", error);
    throw new Error("Failed to generate authentication challenge");
  }
}

async function verifySignature(
  walletAddress: string,
  challenge: string,
  signature: number[]
) {
  try {
    const response = await axios.post("/api/auth/solana/verify", {
      walletAddress,
      challenge,
      signature,
    });
    return response.data;
  } catch (error) {
    console.error("Signature verification failed:", error);
    throw new Error("Failed to verify wallet signature");
  }
}
