import { stringList } from "aws-sdk/clients/datapipeline";

export class Terminal {
    TerminalName: string;
    IsPrivate: boolean;
    Status: string;
    Description: string;
    Image: string;
    TerminalLogo: string;
    FormId: string;
    WrioCode: string;
    TermType:string;
    TerminalAccessKey:string;
}


export class TerminalDetail {
    Id: string;
    SessionId:string;
    TerminalName: string;
    BusinessName:string;
    AccountId: string;
    Image: string;
    FormName:string;
    BusinessDescription:string;    
    TerminalId:number;
    FT:string;
    TerminalImageLinks:Array<string>=[];
    WebLink:string;
    DeliveryCharges:number;
    Name:string;
    EmailId:string;
    MobileNo:number;
    Address:string;
    City:string;
    WrioCode: string;
    Zip:number;
    State:string;
    Country:string;
    TerminalAccessKey:string;
    CheckedIn:string;
    TransactionToken:string;
    Pay:string;
    FormField:Array<FormField>=[];
    Sections: Array<Section> = [];
    MarkNoOrder:Array<NoOrder>=[];
    TimeSlots:Array<TimeSlots>=[];
    ServiceGroups:Array<ServiceGroups>=[];
    Disclaimer: string;
    CurrencySymbol:string;
    AllowNoOrder:boolean;
    CN:string;
    AskComment:string;
    CommentMessage:string;
    OrderAssure:boolean;
    OrderAssureMessage:string;
}


export class FormField {
    id:string;
    M:string;
    FN:string;
    DT:string;
    KT:string;
    SQ: number;
    Values:Array<Value>=[];
}


export class Value {
    DV:string;
    Data:string;
}

export class Section {
    SectionID: string;
    SectionName: string;
    SQ: number;
    Available_QTY:number;
    Image: string;
    Visible: boolean;
    SectionTotal: number;
    QTY: number;
    Items: Array<Item> = [];
    constructor() {
        this.SectionTotal = 0;
        this.Visible = false;
    }
}

export class Item {
    Id: string;
    section_Id: string;
    section_Email:string;
    Barcode: string;
    FN: string;
    Image: string;
    Price: number;
    QTY: number;
    Tag:string;
    UnitOfSale: string;
    Ref1_Label:string;
    Ref1_Desc:string;
    Ref2_Label:string;
    Ref2_Desc:string;
   
}


export class NoOrder{
    section_Id: string;
    section_Email:string;
    FId: string;
    Fname: string;
    price: string;
    Qty: string;
}

export class TimeSlots{
    SlotDate:string;
    SlotDay:string;
    Slotes:Array<Slot>=[];
}
export class Slot{
    Time:any;
    IsAvailable: boolean;
    Id:string;
}

export class GetValueSlotData{
    GroupId:string;
    FormId:string;
    SlotDate:string;
}


export class ServiceGroups{
    Name:string;
    Description:string;
    Id:string;
}

