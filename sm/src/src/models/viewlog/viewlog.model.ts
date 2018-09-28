export class ViewLog{
    FormId:string;
    UserId:string;
    UserDeviceId:string;
    TerminalId:string;
    TerminalName:string;
    TerminalImage:string;
    TokenId:string;
    ItemsArray:Array<SessionItem>=[];
    Total:number;
    CheckedIn:string;
    TransactionToken:string;
    totalItems:string;
    ProfileName:string;
    CheckInTime:string;
    "Check In Time":"";
}

export class SessionItem{
    section_Id:string;
    section_Email:string;
    FId:string;
    Fname:string;
    Qty:string;
    price:string;
}