
import WalletConnect from "@walletconnect/client";
import * as React from "react";
import { IClientMeta } from "@walletconnect/types";
import styled from "styled-components";


export interface IAppState {
  loading: boolean;
  scanner: boolean;
  connector: WalletConnect | null;
  uri: string;
  peerMeta: {
    description: string;
    url: string;
    icons: string[];
    name: string;
    ssl: boolean;
  };
  connected: boolean;
  chainId: number;
  accounts: string[];
  activeIndex: number;
  address: string;
  requests: any[];
  results: any[];
  payload: any;
}
export const account = ['0x14B310d9f099BB6713a2662d4747A2dcAa2C97A0'];

export const INITIAL_STATE: IAppState = {
  loading: false,
  scanner: false,
  connector: null,
  uri: "",
  peerMeta: {
    description: "",
    url: "",
    icons: [],
    name: "",
    ssl: false,
  },
  connected: false,
  chainId: 1,
  accounts: account,
  address: '0x14B310d9f099BB6713a2662d4747A2dcAa2C97A0',
  activeIndex: 0,
  requests: [],
  results: [],
  payload: null,
};

interface IPeerMetaProps {
  peerMeta: IClientMeta;
}


  export class App extends React.Component<{}> {
    public state: IAppState;

    constructor(props: any) {
      super(props);
      this.state = {
        ...INITIAL_STATE,
      };
    }
    public initWalletConnect = async () => {
      
    const { uri } = this.state;
    console.log(uri);
    this.setState({ loading: true });

    try {
      const connector = new WalletConnect({ uri });

      if (!connector.connected) {
        await connector.createSession();
      }

      await this.setState({
        loading: false,
        connector,
        uri: connector.uri,
      });

      this.subscribeToEvents();
    } catch (error) {
      this.setState({ loading: false });

      throw error;
    }
  };

  public init = async () => {
    let { activeIndex, chainId } = this.state;

    const session = getCachedSession();
    console.log("Session: " + session);
    if (!session) {
      //await getAppControllers().wallet.init(activeIndex, chainId);
    } else {
      console.log("Session: " + session);
      const connector = new WalletConnect({ session });

      const { connected, accounts, peerMeta } = connector;

      const address = accounts[0];

      activeIndex = accounts.indexOf(address);
      chainId = connector.chainId;

     // await getAppControllers().wallet.init(activeIndex, chainId);

      await this.setState({
        connected,
        connector,
        address,
        activeIndex,
        accounts,
        chainId,
        peerMeta,
      });

      this.subscribeToEvents();
    }
    //await getAppConfig().events.init(this.state, this.bindedSetState);
  };

  public approveSession = () => {
    console.log("ACTION", "approveSession");
    const { connector, chainId, address } = this.state;
    if (connector) {
      connector.approveSession({ chainId, accounts: [address] });
    }
    this.setState({ connector });
  };

  public rejectSession = () => {
    console.log("ACTION", "rejectSession");
    const { connector } = this.state;
    if (connector) {
      connector.rejectSession();
    }
    this.setState({ connector });
  };

  public killSession = () => {
    console.log("ACTION", "killSession");
    const { connector } = this.state;
    if (connector) {
      connector.killSession();
    }
    this.resetApp();
  };

  public resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
    this.init();
  };

  public subscribeToEvents = () => {
    console.log("ACTION", "subscribeToEvents");
    const { connector } = this.state;

    if (connector) {
      connector.on("session_request", (error, payload) => {
        console.log("EVENT", "session_request");

        if (error) {
          throw error;
        }

        const { peerMeta } = payload.params[0];
        this.setState({ peerMeta });
      });

      connector.on("session_update", error => {
        console.log("EVENT", "session_update");

        if (error) {
          throw error;
        }
      });

      connector.on("call_request", async (error, payload) => {
        // tslint:disable-next-line
        console.log("EVENT", "call_request", "method", payload.method);
        console.log("EVENT", "call_request", "params", payload.params);

        if (error) {
          throw error;
        }

        //await getAppConfig().rpcEngine.router(payload, this.state, this.bindedSetState);
      });

      connector.on("connect", (error, payload) => {
        console.log("EVENT", "connect");

        if (error) {
          throw error;
        }

        this.setState({ connected: true });
      });

      connector.on("disconnect", (error, payload) => {
        console.log("EVENT", "disconnect");

        if (error) {
          throw error;
        }

        this.resetApp();
      });

      if (connector.connected) {
        const { chainId, accounts } = connector;
        const index = 0;
        const address = accounts[index];
        //getAppControllers().wallet.update(index, chainId);
        this.setState({
          connected: true,
          address,
          chainId,
        });
      }

      this.setState({ connector });
    }
  };

  public onURIPaste = async (e: any) => {
    const data = e.target.value;
    const uri = typeof data === "string" ? data : "";
    if (uri) {
      await this.setState({ uri });
      await this.initWalletConnect();
    }
  };

  public getURI() {
    fetch('wss://bridge.walletconnect.org/')
    .then(response => response.json())
    .then(data => console.log(data));
  }


  public openRequest = async (request: any) => {
    const payload = Object.assign({}, request);

    const params = payload.params[0];
    if (request.method === "eth_sendTransaction") {
     // payload.params[0] = await getAppControllers().wallet.populateTransaction(params);
    }

    this.setState({
      payload,
    });
  };

  public closeRequest = async () => {
    const { requests, payload } = this.state;
    const filteredRequests = requests.filter(request => request.id !== payload.id);
    await this.setState({
      requests: filteredRequests,
      payload: null,
    });
  };

  public approveRequest = async () => {
    const { connector, payload } = this.state;

    try {
      //await getAppConfig().rpcEngine.signer(payload, this.state, this.bindedSetState);
    } catch (error) {
      console.error(error);
      if (connector) {
        connector.rejectRequest({
          id: payload.id,
          error: { message: "Failed or Rejected Request" },
        });
      }
    }

    this.closeRequest();
    await this.setState({ connector });
  };

  public rejectRequest = async () => {
    const { connector, payload } = this.state;
    if (connector) {
      connector.rejectRequest({
        id: payload.id,
        error: { message: "Failed or Rejected Request" },
      });
    }
    await this.closeRequest();
    await this.setState({ connector });
  };

}


export function getCachedSession(): any {
  const local = localStorage ? localStorage.getItem("walletconnect") : null;

  let session = null;
  if (local) {
    try {
      session = JSON.parse(local);
    } catch (error) {
      throw error;
    }
  }
  return session;
}



// // Create connector
// const connector = new WalletConnect(
//     {
//       // Required
//       uri: "wc:faaf3800-25a8-4547-b9b8-38f9e4fdcb52@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=7420046da3bcc4460586c9ca77a8760ae3337c1203de6e531a9cb0577a76d758",
      
//       // Required
//       clientMeta: {
//         description: "WalletConnect Developer App",
//         url: "https://walletconnect.org",
//         icons: ["https://walletconnect.org/walletconnect-logo.png"],
//         name: "WalletConnect",
//       },
//     },
//     // {
//     //   // Optional
//     //   url: "<YOUR_PUSH_SERVER_URL>",
//     //   type: "fcm",
//     //   token: token,
//     //   peerMeta: true,
//     //   language: 'English',
//     // }
//   );
  
//   // Subscribe to session requests
//   connector.on("session_request", (error, payload) => {
//     if (error) {
//       throw error;
//     }
  
//     // Handle Session Request
//     const { accounts, chainId } = payload.params[0];
// //});
//     // payload:
//     // {
//     //   id: 1,
//     //   jsonrpc: '2.0',
//     //   method: 'session_request',
//     //   params: [{
//     //     peerId: '15d8b6a3-15bd-493e-9358-111e3a4e6ee4',
//     //     peerMeta: {
//     //       name: "WalletConnect Example",
//     //       description: "Try out WalletConnect v1.x.x",
//     //       icons: ["https://example.walletconnect.org/favicon.ico"],
//     //       url: "https://example.walletconnect.org"
//     //     }
//     //   }]
//     // }
    
//   });
  
//   // Subscribe to call requests
//   connector.on("call_request", (error, payload) => {
//     if (error) {
//       throw error;
//     }
  
//     // Handle Call Request
  
//     /* payload:
//     {
//       id: 1,
//       jsonrpc: '2.0'.
//       method: 'eth_sign',
//       params: [
//         "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
//         "My email is john@doe.com - 1537836206101"
//       ]
//     }
//     */
//   });
  
//   connector.on("disconnect", (error, payload) => {
//     if (error) {
//       throw error;
//     }
  
//     // Delete connector
//   });

//   // Approve Session
// connector.approveSession({
//     accounts: [                 // required
//       '0x217b4eeDE8A60f7756A392dFBB14c638988D68A6'

//     ],
//     chainId: 1                  // required
//   })
  
//   // Reject Session
//   connector.rejectSession({
//     message: 'OPTIONAL_ERROR_MESSAGE'       // optional
//   })
  
  
//   // Kill Session
//   connector.killSession()


//   // Approve Call Request
// connector.approveRequest({
//     id: 1,
//     result: "0x41791102999c339c844880b23950704cc43aa840f3739e365323cda4dfa89e7a"
//   });
  
//   // Reject Call Request
//   connector.rejectRequest({
//     id: 1,                                  // required
//     error: {
//       code: 1,           // optional
//       message: "OPTIONAL_ERROR_MESSAGE"     // optional
//     }
//   });



