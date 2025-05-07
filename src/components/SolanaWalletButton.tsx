"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { useSolanaAuth } from "@/hooks/useSolanaAuth";
import { useState } from "react";

interface SolanaWalletButtonProps {
  onLogin?: () => void;
  className?: string;
}

export default function SolanaWalletButton({
  onLogin,
  className = "",
}: SolanaWalletButtonProps) {
  const { publicKey, connected, connecting, wallet } = useWallet();
  const { loginWithWallet, isVerifying, logoutWallet } = useSolanaAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginWithWallet = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithWallet();
      if (onLogin) onLogin();
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not connected to wallet, show the wallet connect button
  if (!connected) {
    return (
      <div className={`wallet-adapter-dropdown ${className}`}>
        <WalletMultiButton className="wallet-adapter-button-trigger bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed" />
      </div>
    );
  }

  // If connected but not authenticated
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-center mb-2 bg-gray-100 rounded-lg p-2 text-sm">
        <span className="mr-2">Connected:</span>
        <span className="font-mono bg-gray-200 rounded px-2 py-1 truncate max-w-[120px]">
          {publicKey?.toString().slice(0, 4)}...
          {publicKey?.toString().slice(-4)}
        </span>
      </div>

      <Button
        onClick={handleLoginWithWallet}
        disabled={isVerifying || isLoggingIn}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isVerifying || isLoggingIn
          ? "Authenticating..."
          : "Sign Message to Login"}
      </Button>

      <Button
        onClick={logoutWallet}
        variant="neutral"
        className="py-2 px-4 rounded-xl transition-all hover:bg-red-100 text-sm w-full"
      >
        Disconnect Wallet
      </Button>
    </div>
  );
}
