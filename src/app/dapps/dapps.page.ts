import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dapps',
  templateUrl: 'dapps.page.html',
  styleUrls: ['dapps.page.scss'],
})
export class dappsPage {
  public nameofurl:string;
  public url:string;
  constructor(private router: Router) {}

  uploadURL(){
    this.url=this.nameofurl;
    localStorage.setItem('url', this.url);
    this.router.navigateByUrl('/result');
  }

  dappURL(url: string){
    localStorage.setItem('url', url);
    this.router.navigateByUrl('/result');
  }
}
