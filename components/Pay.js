import React, { useContext, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { parseEther } from 'viem'
import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { RainbowKitProvider, Chain, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public'
import { goerli, polygon } from '@wagmi/core/chains'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { parseUnits } from 'viem'

import {
    erc20ABI,
    useContractWrite,
    usePrepareContractWrite,
} from "wagmi";



function Payment({ infoBackend, selectedCryptoConfig, selectedCrypto, updateSelectedCrypto, updateSelectedCryptoConfig, new_charge }) {
    const ticker = selectedCrypto;

    let amount;
    let address = new_charge.ethereum_address || '0x0'

    switch (selectedCryptoConfig.name) {
        case 'Bitcoin':
            address = new_charge.bitcoin_address;
            amount = new_charge.btc_price;
            break;
        case 'Bitcoin Cash':
            address = new_charge.bitcoincash_address;
            amount = new_charge.bch_price;
            break;
        case 'Litecoin':
            address = new_charge.litecoin_address;
            amount = new_charge.ltc_price;
            break;
        case 'Dogecoin':
            address = new_charge.dogecoin_address;
            amount = new_charge.dogecoin_price;
            break;
        case 'USDCoin':
            amount = new_charge.usdc_price;
            break;
        case 'Tether':
            amount = new_charge.usdt_price;
            break;
        case 'DAI':
            amount = new_charge.dai_price;
            break;
        case 'SHIBA INU':
            amount = new_charge.shib_price;
            break;
        case 'APECOIN':
            amount = new_charge.ape_price;
            break;
        case 'USDC (Polygon)':
            amount = new_charge.pusdc_price;
            break;
        case 'Ethereum':
            amount = new_charge.eth_price;
            break;
        case 'Matic':
            amount = new_charge.pmatic_price;
            break;
        default:
            address = new_charge.ethereum_address;
            amount = 1000000000000000;
            break;
    }


    const resetSelection = () => {
        updateSelectedCrypto(null);
        updateSelectedCryptoConfig(null);
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
        textArea.value = amount; // Convierte el valor a una cadena

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

    const { chain: connectedChain } = useNetwork()
    const { chains, error, isLoading: switchLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    const { error: sendEthError, data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
        to: address,
        value: parseEther(amount),
    })
    const handleSendTransaction = () => {
        try {
            // Intenta enviar la transacción
            const result = sendTransaction();

            // Si la transacción se envía con éxito, puedes hacer algo con el resultado si es necesario
        } catch (error) {
            // Si se produce un error al enviar la transacción, capturamos el error aquí
            console.log("ocurrio un error al enviar");
        }
    };
    const { error: transactionError, data: writeData, isLoading: writeLoading, isSuccess: writeIsSuccess, write } = useContractWrite({
        address: selectedCryptoConfig.address,
        abi: erc20ABI,
        functionName: "transfer",
        args: [address, parseUnits(amount.toString(), selectedCryptoConfig.decimals)],
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


    return (
        <div id='elementos-dinamicos'>
            <p className='descripcion'>{new_charge.descripcion || "Tu pago con " + selectedCryptoConfig.name}</p>
            <img src={'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + address}></img>
            <p>Depositá las criptomonedas desde tu wallet de preferencia</p>
            {/* <h2>Pago con {selectedCryptoConfig.name}</h2> */}
            <p>Address: <span className='copyable' style={{
                color: '#ca0d9f',
                cursor: 'pointer'
            }}>{address}</span></p>
            {/* <button onClick={handleCopyAddress}>Copiar dirección</button> */}

            <p>Importe: <span className='copyable' style={{
                color: '#ca0d9f',
                cursor: 'pointer'
            }}>{amount}</span> {ticker}</p>
            {/* <button onClick={handleCopyAmount}>Copiar cantidad</button> */}


            {(selectedCryptoConfig.tipo === 'native' || selectedCryptoConfig.tipo === 'erc') &&
                <>
                    {!connectedChain && <p>O conecta tu wallet para pagar</p>}
                    <ConnectButton label='Conectá tu Wallet' />
                    {connectedChain && <div>Estas conectado a {connectedChain.name}</div>}
                    {connectedChain && selectedCryptoConfig.chainName !== connectedChain.name && (
                        <div>
                            <p>Debes conectarte a la red de {selectedCryptoConfig.chainName} para realizar este pago</p>
                            {chains.map((x) => {
                                if (x.name === selectedCryptoConfig.chainName) {
                                    return (
                                        <button
                                            disabled={!switchNetwork}
                                            key={x.id}
                                            onClick={() => switchNetwork?.(x.id)}
                                            className='btn btn-primary'
                                            type='button'
                                        >
                                            Clickea aca para cambiar
                                            {isLoading && pendingChainId === x.id && ' (switching)'}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </>
            }
            {selectedCryptoConfig.tipo === 'native' &&
                <>
                    <div>
                        {sendEthError && <p style={{ color: 'red' }}>Ocurrio un error al enviar la transacción. Verificá tener fondos suficientes en tu wallet.</p>}

                        {(connectedChain && connectedChain.name == selectedCryptoConfig.chainName) && <button onClick={handleSendTransaction} className='my-3'>Enviar transacción</button>}
                    </div>
                </>
            }
            {
                selectedCryptoConfig.tipo === 'erc' &&
                <>
                    <div>
                        {transactionError && <p style={{ color: 'red' }}>Ocurrio un error al enviar la transacción. Verificá tener fondos suficientes en tu wallet.</p>}

                        {(connectedChain && connectedChain.name == selectedCryptoConfig.chainName) && <button onClick={handleWrite} className='my-2'>Enviar transacción</button>}
                    </div>
                </>
            }

            <button onClick={resetSelection} id='regresar' className='mt-2'>Elegir otra crypto</button>

        </div>

    );
}

export default Payment;