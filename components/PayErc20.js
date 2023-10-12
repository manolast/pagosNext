import React, { useContext, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { parseUnits } from 'viem'
import { RainbowKitProvider, Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public'
import { goerli, polygon } from '@wagmi/core/chains'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { useNetwork, useSwitchNetwork } from 'wagmi'


function ErcPayment({ address, amount, selectedCrypto }) {

  const { chain } = useNetwork()
  const { chains, error, isLoading: switchLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()


  const { error: transactionError, data, isLoading, isSuccess, write } = useContractWrite({
    address: selectedCrypto.address,
    abi: erc20ABI,
    functionName: "transfer",
    args: [address, parseUnits(amount.toString(), selectedCrypto.decimals)],
  });

  const handleWrite = () => {
    try {
      // Intenta realizar la escritura del contrato
      const result = write();

      // Si la escritura se realiza con éxito, puedes hacer algo con el resultado si es necesario
    } catch (error) {
      // Si se produce un error al escribir en el contrato, capturamos el error aquí
      console.error('Error al escribir en el contrato:', transactionError);
    }
  };


  const handleCopyAddress = () => {
    // Crea un elemento de texto oculto para copiar el texto al portapapeles
    const textArea = document.createElement('textarea');
    textArea.value = address;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      // Intenta copiar el texto al portapapeles
      document.execCommand('copy');
      alert('Dirección copiada.');
    } catch (err) {
      console.error('No se pudo copiar la dirección al portapapeles:', err);
    } finally {
      // Elimina el elemento de texto del DOM
      document.body.removeChild(textArea);
    }
  };

  const handleCopyAmount = () => {
    // Crea un elemento de texto oculto para copiar el valor de "amount" al portapapeles
    const textArea = document.createElement('textarea');
    textArea.value = amount.toString(); // Convierte el valor a una cadena

    document.body.appendChild(textArea);

    textArea.select();

    try {
      // Intenta copiar el valor de "amount" al portapapeles
      document.execCommand('copy');
      alert('El valor se copió al portapapeles.');
    } catch (err) {
      console.error('No se pudo copiar el valor al portapapeles:', err);
    } finally {
      // Elimina el elemento de texto del DOM
      document.body.removeChild(textArea);
    }
  };

  return (
    <div>
      <h2>Pago con {selectedCrypto.name}</h2>
      <p>Dirección: {address}</p>
      <button onClick={handleCopyAddress}>Copiar dirección</button>

      <p>Monto: {amount} ETH</p>
      <button onClick={handleCopyAmount}>Copiar cantidad</button>

      <ConnectButton />
      {chain && <div>Connected to {chain.name}</div>}
      {chain && selectedCrypto.chainName !== chain.name && (
        <div>
          <p>Debes conectarte a la red de {selectedCrypto.chainName} para realizar este pago</p>
          {chains.map((x) => {
            if (x.name === selectedCrypto.chainName) {
              return (
                <button
                  disabled={!switchNetwork}
                  key={x.id}
                  onClick={() => switchNetwork?.(x.id)}
                >
                  Clickea aca para cambiar
                  {isLoading && pendingChainId === x.id && ' (switching)'}
                </button>
              );
            }
            return null; // Retorna null para evitar renderizar nada en otros casos
          })}
        </div>
      )}

      <div>
        {transactionError && <p style={{ color: 'red' }}>{transactionError.message}</p>}

        <button onClick={handleWrite}>Enviar</button>

      </div>
    </div >

  );
}

export default ErcPayment;