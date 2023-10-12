import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '../styles/styles.css'



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
