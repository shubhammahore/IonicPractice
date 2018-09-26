import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
@Component ({
    selector: 'page-buyout',
    templateUrl: 'buyout.html'
})
export class BuyoutPage{
    productData: {name:string, quantity:number};

    constructor(private navParams:NavParams){
        this.productData=this.navParams.data;
    }
    onGoBuy(){
        
    }
}