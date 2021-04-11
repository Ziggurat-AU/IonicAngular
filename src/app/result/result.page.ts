
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
import * as Rx from "rxjs/Rx";
import { Subject } from "rxjs/Rx";


const CHAT_URL = "wss://bridge.walletconnect.org/";
export interface Message {
  author: string;
  message: string;
}


@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})

@Injectable({
  providedIn: 'root'
})
export class ResultPage implements OnInit  {
  public messages: Subject<Message>;

  constructor( private router: Router, public sanitizer: DomSanitizer){
    this.messages = <Subject<Message>>this.connect(CHAT_URL).map(
      (response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        console.log('data: ');
        console.log(response.data);
        return {
          author: data.author,
          message: data.message
        };
      }
    );
  }
  
  ngOnInit() {
    this.testWebSocket();

  }

  testWebSocket() {
    console.log("testwebsocket ");
    let websocket = new WebSocket(CHAT_URL);

    websocket.onmessage = function(e){
      if(e.data === String ){
        //create a JSON object
        var jsonObject = JSON.parse(e.data);
        var username = jsonObject.name;
        var message = jsonObject.message;
      
        console.log('Received data string');
     }
      var server_msg = e.data;
      console.log('server msg: ');
      console.log(server_msg);
    };

    
  }

  goback(){
    this.router.navigateByUrl('tabs/dapps');
    }

  openURL(){

    return this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem("url"));
  
  }
  
  URI(e: any){
    console.log("URI func");
    console.log(e);
    // this.http.get('wss://bridge.walletconnect.org/').subscribe(responseData => console.log(responseData));

  }

  //const subject = webSocket('wss://bridge.walletconnect.org/');
  
  // subject.subscribe(
  //    msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
  //    err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //    () => console.log('complete') // Called when connection is closed (for whatever reason).
  //  );
  private subject: Rx.Subject<MessageEvent>;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
          console.log('observer: ');
          console.log(data);
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }


  private message = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  sendMsg() {

    console.log("new message from client to websocket: ", this.message);
    this.messages.next(this.message);
    this.message.message = "";
    
  }
}


