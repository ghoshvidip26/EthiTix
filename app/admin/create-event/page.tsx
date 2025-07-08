"use client";
import { useState } from "react";
import {
  Aptos,
  AptosConfig,
  Network,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";

declare global {
  interface Window {
    aptos?: any;
  }
}

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export default function CreateEvent() {
  return <div></div>;
}
