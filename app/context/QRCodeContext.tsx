"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";
import QRCode from "qrcode";

type QRCodeContextType = {
  qrCodeURL: string | null;
  generateQRCode: (data: string) => Promise<void>;
  hash: string | null;
};

const QRCodeContext = createContext<QRCodeContextType>({
  qrCodeURL: null,
  generateQRCode: async () => {},
  hash: null,
});

export const QRCodeProvider = ({ children }: PropsWithChildren) => {
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  const generateQRCode = useCallback(async (txnHash: string) => {
    try {
      const url = `https://explorer.aptoslabs.com/txn/${txnHash}?network=testnet`;
      const qrCode = await QRCode.toDataURL(url);
      setHash(txnHash);
      setQrCodeURL(qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }, []);

  return (
    <QRCodeContext.Provider value={{ qrCodeURL, generateQRCode, hash }}>
      {children}
    </QRCodeContext.Provider>
  );
};

export const useQRCode = () => useContext(QRCodeContext);
