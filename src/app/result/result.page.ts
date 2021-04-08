import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  constructor(private router: Router, public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigateByUrl('tabs/dapps');
    }

  openURL(){

    return this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem("url"));
  
  }
}
