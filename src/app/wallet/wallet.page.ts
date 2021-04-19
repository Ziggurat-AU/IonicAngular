import { Component, OnInit } from '@angular/core';
import WalletConnect from '@walletconnect/client';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss'],
})
export class walletPage implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initialConnection();
  }

  initialConnection() {}

  connectToWalletConnect() {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
    });
    if (!connector.connected) {
      alert(connector.connected);
      // create new session
      // connector.createSession().then(() => {
      //   // get uri for QR Code modal
      //   const uri = connector.uri;
      //   // display QR Code modal
      //   WalletConnectQRCodeModal.open(uri, () => {
      //     console.log('QR Code Modal closed');
      //   });
      // });
    }
  }
}
