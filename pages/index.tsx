import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import EthereumPayment from '../components/Payeth';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { goerli, polygon } from '@wagmi/core/chains'
import ErcPayment from '../components/PayErc20';
import { RainbowKitProvider, Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { QueryClient, QueryClientProvider } from 'react-query';
import BtcPayment from '../components/BtcPayment';
import Payment from '../components/Pay';


type CryptoConfig = {
  [key: string]: {
    name: string;
    address: string;
    decimals: number;
    chainName: string;
    tipo: string;
    img: string;
  };
};

const cryptoConfig: CryptoConfig = {
  Bitcoin: {
    name: 'Bitcoin',
    address: 'NA',
    decimals: 0,
    chainName: 'Bitcoin',
    tipo: 'otro',
    img: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png"
  },
  Ethereum: {
    name: 'Ethereum',
    address: 'NA',
    decimals: 0,
    chainName: 'Ethereum',
    tipo: 'native',
    img: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png'
  },
  USDT: {
    name: 'Tether',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    chainName: 'Ethereum',
    tipo: 'erc',
    img: "https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png"
  },
  USDC: {
    name: 'USDCoin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    chainName: 'Ethereum',
    tipo: 'erc',
    img: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png'
  },
  DAI: {
    name: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    chainName: 'Ethereum',
    tipo: 'erc',
    img: 'https://dynamic-assets.coinbase.com/90184cca292578d533bb00d9ee98529b889c15126bb120582309286b9129df9886781b30c85c21ee9cae9f2db6dc11e88633c7361fdd1ba5046ea444e101ae15/asset_icons/ebc24b163bf1f58a9732a9a1d2faa5b2141b041d754ddc2260c5e76edfed261e.png'
  },
  DOGE: {
    name: 'Dogecoin',
    address: 'NA',
    decimals: 0,
    chainName: 'Dogecoin',
    tipo: 'otro',
    img: 'https://dynamic-assets.coinbase.com/3803f30367bb3972e192cd3fdd2230cd37e6d468eab12575a859229b20f12ff9c994d2c86ccd7bf9bc258e9bd5e46c5254283182f70caf4bd02cc4f8e3890d82/asset_icons/1597d628dd19b7885433a2ac2d7de6ad196c519aeab4bfe679706aacbf1df78a.png'
  },
  SHIBA: {
    name: 'SHIBA INU',
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    decimals: 18,
    chainName: 'Ethereum',
    tipo: 'erc',
    img: 'https://dynamic-assets.coinbase.com/c14c8dc36c003113c898b56dfff649eb0ff71249fd7c8a9de724edb2dedfedde5562ba4a194db8433f2ef31a1e879af0727e6632751539707b17e66d63a9013b/asset_icons/a7309384448163db7e3e9fded23cd6ecf3ea6e1fb3800cab216acb7fc85f9563.png'
  },
  LITECOIN: {
    name: 'Litecoin',
    address: 'NA',
    decimals: 0,
    chainName: 'Litecoin',
    tipo: 'otro',
    img: 'https://dynamic-assets.coinbase.com/f018870b721574ef7f269b9fd91b36042dc05ebed4ae9dcdc340a1bae5b359e8760a8c224bc99466db704d10a3e23cf1f4cd1ff6f647340c4c9c899a9e6595cd/asset_icons/984a4fe2ba5b2c325c06e4c2f3ba3f1c1fef1f157edb3b8ebbfe234340a157a5.png'
  },
  APE: {
    name: 'APECOIN',
    address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    decimals: 18,
    chainName: 'Ethereum',
    tipo: 'erc',
    img: 'https://dynamic-assets.coinbase.com/71d2a21895c80ade641c5e18d1cf2f7fa9c9ab47775ee6e771c98d51bd97419c9041dfb7c661f125a7f663ab7653534c16dca476dacb340197750ce378926c36/asset_icons/c23c607a3e4479ff21f66cfece0e096d673f847c46b873329ac1760dd72dc0a2.png'
  },
  BCH: {
    name: 'Bitcoin Cash',
    address: 'NA',
    decimals: 0,
    chainName: 'Bitcoin Cash',
    tipo: 'otro',
    img: 'https://dynamic-assets.coinbase.com/93a4303d1b0410b79bb1feac01020e4e7bdf8e6ece68282d0af2c7d0b481c5f5c44c0cec1d7071ae8f84674dbd139e290d50a038a6a4c1bbc856ec0871b5f3e2/asset_icons/3af4b33bde3012fd29dd1366b0ad737660f24acc91750ee30a034a0679256d0b.png'
  },
  MATIC: {
    name: 'Matic',
    address: 'NA',
    decimals: 0,
    chainName: 'Polygon',
    tipo: 'native',
    img: 'https://dynamic-assets.coinbase.com/085ce26e1eba2ccb210ea85df739a0ca2ef782747e47d618c64e92b168b94512df469956de1b667d93b2aa05ce77947e7bf1b4e0c7276371aa88ef9406036166/asset_icons/57f28803aad363f419a950a5f5b99acfd4fba8b683c01b9450baab43c9fa97ea.png'
  },
  USDCPol: {
    name: 'USDC (Polygon)',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    decimals: 6,
    chainName: 'Polygon',
    tipo: 'erc',
    img: 'https://static-assets.coinbase.com/p2p/l2/asset_network_combinations/v3/usdc-polygon.png',
  },
  // LINKGoerli: {
  //   name: 'Link Goerli',
  //   address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  //   decimals: 18,
  //   chainName: 'Goerli',
  //   tipo: 'erc',
  //   img: 'NA'
  // },


};
type InfoBackend = {
  [key: string]: {
    amount: string,
    address: string,
  };
};


let infoBackend: InfoBackend = {};
Object.keys(cryptoConfig).map((cryptoKey) => {
  const sape = {
    amount: '1',
    address: '0xd9279F6D53a3F77830f9692f396B386C88ff9Acc'
  }
  infoBackend[cryptoKey] = { ...sape };
})


const Home: NextPage = () => {
  let new_charge;
  if (typeof window !== "undefined") {
    new_charge = (window as any).new_charge || {};
  }
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedCryptoConfig, setSelectedCryptoConfig] = useState<any | null>(null); // Estado para la configuración

  const handleCryptoSelection = (cryptoName: string) => {
    setSelectedCrypto(cryptoName);

    const config = cryptoConfig[cryptoName];
    setSelectedCryptoConfig(config);
  };

  const updateSelectedCrypto = (crypto: string) => {
    setSelectedCrypto(crypto);
  };

  const updateSelectedCryptoConfig = (config: any) => {
    setSelectedCryptoConfig(config);
  };


  const address = '0xd9279F6D53a3F77830f9692f396B386C88ff9Acc';
  const amount = 1.5;
  const queryClient = new QueryClient();

  // const evmCryptos = {
  //   'USDC':{
  //     name: 'usdc',
  //     address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //     decimals:6,
  //     chainid: 1
  //   }
  // }


  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, goerli],
    [
      alchemyProvider({ apiKey: '4_X4s7nBn9QjanSt9RnBUKN29Dg3rmxI' }),
      publicProvider()
    ]);

  const { connectors } = getDefaultWallets({
    appName: 'sape',
    projectId: '5cf6f60255e644e7ef5f619a00ad4dc6',
    chains
  });

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors,
  });

  return (

    <div className={styles.container}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>RainbowKit App</title>
          <meta
            content="Generated by @rainbow-me/create-rainbowkit"
            name="description"
          />
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <main>
          <div className='container mt-5'>
            <div className="card card-cp">
              <div className="card-body">
                <img id="logo" src="https://static.wixstatic.com/media/d21184_5e901b6448424fcfb60b8b0779552538~mv2.png/v1/fill/w_744,h_744,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/d21184_5e901b6448424fcfb60b8b0779552538~mv2.png" />
              </div>
            </div>


            {!selectedCrypto &&
              <>
                <div style={{ textAlign: 'center' }}>
                  <br />
                  <p id="subtitulo">Seleccioná tu criptomoneda</p>
                </div>
                <div>
                  {/* {Object.keys(cryptoConfig).map((cryptoKey, index) => (
                      <div className='crypto-card'>
                        <button
                          key={cryptoKey}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCryptoSelection(cryptoKey);
                          }}
                          style={{
                            backgroundColor:
                              selectedCrypto === cryptoKey ? 'lightblue' : 'white',
                          }}
                        >
                          <img src={cryptoConfig[cryptoKey].img} alt={cryptoKey} />
                          {cryptoConfig[cryptoKey].name}
                        </button>
                      </div>
                    ))} */}
                  {Object.keys(cryptoConfig).map((cryptoKey, index) => {
                    // Verificar si el índice actual es par para agrupar los botones en pares
                    if (index % 2 === 0) {
                      return (
                        <div className='crypto-card' key={cryptoKey}>
                          <button
                            id={`${cryptoKey}-btn`}
                            className='btn btn-primary'
                            type='button'
                            onClick={(e) => {
                              e.preventDefault();
                              handleCryptoSelection(cryptoKey);
                            }}
                          >
                            <img className='logo' src={cryptoConfig[cryptoKey].img} alt={cryptoKey} />
                            {cryptoConfig[cryptoKey].name}
                          </button>
                          {index + 1 < Object.keys(cryptoConfig).length && (
                            <button
                              id={`${Object.keys(cryptoConfig)[index + 1]}-btn`}
                              className='btn btn-primary'
                              type='button'
                              onClick={(e) => {
                                e.preventDefault();
                                handleCryptoSelection(Object.keys(cryptoConfig)[index + 1]);
                              }}
                            >
                              <img
                                className='logo'
                                src={cryptoConfig[Object.keys(cryptoConfig)[index + 1]].img}
                                alt={Object.keys(cryptoConfig)[index + 1]}
                              />
                              {cryptoConfig[Object.keys(cryptoConfig)[index + 1]].name}
                            </button>
                          )}
                        </div>
                      );
                    }
                    return null; // Devolver nulo para los índices impares y evitar divs vacíos
                  })}
                </div>
              </>
            }
            <WagmiConfig config={config}>
              <RainbowKitProvider chains={chains}>
                <div id='contenido-dinamico mt-4'>
                  {selectedCrypto &&
                    <>
                      <Payment infoBackend={infoBackend} selectedCryptoConfig={selectedCryptoConfig} selectedCrypto={selectedCrypto} updateSelectedCrypto={updateSelectedCrypto}
                        updateSelectedCryptoConfig={updateSelectedCryptoConfig} new_charge={new_charge} />

                    </>}
                </div>
              </RainbowKitProvider>
            </WagmiConfig>
          </div>
        </main>

        <footer className={styles.footer}>
        </footer>

      </QueryClientProvider>

    </div >
  );
};

export default Home;
