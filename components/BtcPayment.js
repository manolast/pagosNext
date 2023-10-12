import React, { useContext, useEffect } from 'react';



function BtcPayment({ address, amount, selectedCrypto }) {

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

            <p>Monto: {amount} {selectedCrypto.name}</p>
            <button onClick={handleCopyAmount}>Copiar cantidad</button>

        </div >

    );
}

export default BtcPayment;