"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { useSolanaAuth } from "@/hooks/useSolanaAuth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import styles from "./SolanaWalletButton.module.css";

interface SolanaWalletButtonProps {
  onLogin?: () => void;
  className?: string;
}

export default function SolanaWalletButton({
  onLogin,
  className = "",
}: SolanaWalletButtonProps) {
  const { publicKey, connected, connecting } = useWallet();
  const { loginWithWallet, isVerifying, logoutWallet } = useSolanaAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isLoading = isVerifying || isLoggingIn || connecting;

  const handleLoginWithWallet = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithWallet();
      if (onLogin) onLogin();
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!connected) {
    return (
      <div className={`${className} w-full flex items-center justify-center`}>
        <div className={styles.customWalletButton}>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-3 w-full ${className}`}>
      <div className="flex items-center justify-center w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
        <span className="text-slate-600 dark:text-slate-300 mr-2">
          Connected:
        </span>
        <span className="font-mono bg-slate-200 dark:bg-slate-700 rounded px-2 py-0.5 truncate max-w-[130px] text-slate-800 dark:text-slate-200">
          {publicKey?.toString().slice(0, 4)}...
          {publicKey?.toString().slice(-4)}
        </span>
      </div>

      <div className="flex flex-row gap-2 w-full">
        <Button
          onClick={handleLoginWithWallet}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex-grow flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            "Sign Message to Login"
          )}
        </Button>

        <Button
          onClick={logoutWallet}
          variant="neutral"
          className="py-2 px-3 rounded-xl transition-all hover:bg-red-100 text-sm min-w-[120px]"
        >
          Disconnect Wallet
        </Button>
      </div>
    </div>
  );
}
