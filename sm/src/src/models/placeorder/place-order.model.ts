export class PlaceOrder{
    InfoArray:InfoOrder;
    AccountId:string;
    SessionId:string;
    TransactionToken:string;
    NotiFlag:string;
    FormType:string;
    isRemoteCheckIn:string;
    PaymentPaypal:string;
    PaymentMethod:string;
    IsPayment:string;
    NoOrder:string;
constructor(){
    this.InfoArray=new InfoOrder();
}
}

export class InfoOrder{
    FormId:string;
    UserId:string;
    UserDeviceId:string;
    TerminalId:string;
    TerminalName:string;
    Image:string;
    Device_Stats:string;
    TerminalImage:string;
    DeviceARN:string;
    OS:string;
    ItemsArray:Array<SessionItem>=[];
    Total:string;
    CheckedIn:string;
    TransactionToken:string;
    totalItems:string;
    ProfileName:string;
    NoOrder:string;
   
}

export class SessionItem{
    section_Id:string;
    section_Email:string;
    FId:string;
    Fname:string;
    Qty:string;
    price:string;
    itemTag:string;
    notes:string;
}

export class DeviceInfo{
    DeviceSDK:string;
    Device_Details:string;
    Android_OS:string;
    Latitude:string;
    Longitude:string;
    Network_Class:string;
    Network_Wifi:string;
    Battery_Percentage:string;
    Network_Type:string;
    App_Name:string;
    App_Version:string;
    App_ver_Code:string;

}



export class UpdatePayment{
    WrioCode:string;
    TokenId:number;
    LogId:string;
    PaymentMethod:string;
}



export class PaymentOption{
    TerminalId:number;
    PaymentMethod:string;
    PaymentName:string;
    Message: string;
    Key1: string;
    Key2: string;
    URL:string;
    CallbackURL:string;
}