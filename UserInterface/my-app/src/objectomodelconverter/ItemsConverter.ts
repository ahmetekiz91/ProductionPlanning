import { Items } from "../Models/Items";

export class ItemsConverter {
    static convertToItem(formobject: any): Items {
        const { slots } = formobject;
        
        const safeParse = (value: any) => {
            try {
                return value ? JSON.parse(value) : undefined;
            } catch {
                return undefined;
            }
        };
        
        const getString = (value: any) => value !== undefined ? value.toString() : "";
        const getInt = (value: any) => parseInt(value) || 0;
        const getFloat = (value: any) => parseFloat(value) || 0.0;
        const getBoolean = (value: any) => ["yes", "true", "1"].includes(value?.toString().toLowerCase());

        const item: Items = {
            Id: safeParse(slots.Id?.value),
            Name_: getString(safeParse(slots.Name_?.value)),
            BrandID: getInt(safeParse(slots.BrandID?.value)),
            GTIP: getString(safeParse(slots.GTIP?.value)),
            Height: getFloat(safeParse(slots.Height?.value)),
            CurrencyID: getInt(safeParse(slots.CurrencyID?.value)),
            IGID: getInt(safeParse(slots.IGID?.value)),
            IsActive: getBoolean(safeParse(slots.IsActive?.value)),
            IsTemplate: getBoolean(safeParse(slots.IsTemplate?.value)),
            Isparent: getBoolean(safeParse(slots.Isparent?.value)),
            ItemOfferGroup: safeParse(slots.ItemOfferGroup?.value),
            Length: getFloat(safeParse(slots.Length?.value)),
            NamePARENT: getString(safeParse(slots.NamePARENT?.value)),
            PCSAmount: getFloat(safeParse(slots.PCSAmount?.value)),
            SalesPrice: getFloat(safeParse(slots.SalesPrice?.value)),
            StoreID: getInt(safeParse(slots.StoreID?.value)),
            UnitID: getInt(safeParse(slots.UnitID?.value)),
            UnitPerBox: getFloat(safeParse(slots.UnitPerBox?.value)),
            Variant: getString(safeParse(slots.Variant?.value)),
            Weight: getFloat(safeParse(slots.Weight?.value)),
            WidthLengthHeight: getString(safeParse(slots.WidthLengthHeight?.value)),
            CompanyItemCode: getString(safeParse(slots.CompanyItemCode?.value)),
            Width: getFloat(safeParse(slots.Width?.value)),
            EAN: getString(safeParse(slots.EAN?.value)),
        };

        return item;
    }
}


// import { Items } from "../Models/Items";

// export class ItemsConverter
// {
//     static convertToItem(formobject: any): Items 
//     {
//         const { slots } = formobject;
//         const Name_ = slots.Name_ ? JSON.parse(slots.Name_.value): undefined;
//         const BrandID = slots.BrandID ? JSON.parse(slots.BrandID.value): undefined;
//         const GTIP   = slots.GTIP ? JSON.parse(slots.GTIP.value): undefined;
//         const Height = slots.Height ? JSON.parse(slots.Height.value): undefined;
//         const CurrencyID = slots.CurrencyID ? JSON.parse(slots.CurrencyID.value): undefined;
//         const IGID = slots.IGID ? JSON.parse(slots.IGID.value): undefined;
//         const IsActive = slots.IsActive ? JSON.parse(slots.IsActive.value): undefined;
//         const IsTemplate = slots.IsTemplate ? JSON.parse(slots.IsTemplate.value): undefined;
//         const Isparent = slots.Isparent ? JSON.parse(slots.Isparent.value): undefined;
//         const ItemOfferGroup = slots.ItemOfferGroup ? JSON.parse(slots.ItemOfferGroup.value): undefined;
//         const Length = slots.Length ? JSON.parse(slots.Length.value): undefined;
//         const NamePARENT = slots.NamePARENT ? JSON.parse(slots.NamePARENT.value): undefined;
//         const PCSAmount = slots.PCSAmount ? JSON.parse(slots.PCSAmount.value): undefined;
//         const SalesPrice = slots.SalesPrice ? JSON.parse(slots.SalesPrice.value): undefined;
//         const StoreID = slots.StoreID ? JSON.parse(slots.StoreID.value): undefined;
//         const UnitID = slots.UnitID ? JSON.parse(slots.UnitID.value): undefined;
//         const UnitPerBox = slots.UnitPerBox ? JSON.parse(slots.UnitPerBox.value): undefined;
//         const Variant = slots.Variant ? JSON.parse(slots.Variant.value): undefined;
//         const Weight = slots.Weight ? JSON.parse(slots.Weight.value): undefined;
//         const WidthLengthHeight = slots.WidthLengthHeight ? JSON.parse(slots.WidthLengthHeight.value): undefined;
//         const CompanyItemCode = slots.CompanyItemCode ? JSON.parse(slots.CompanyItemCode.value): undefined;
//         const Id = slots.Id ? JSON.parse(slots.Id.value): undefined;
//         const Width = slots.Width ? JSON.parse(slots.Width.value): undefined;
//         const EAN = slots.EAN ? JSON.parse(slots.EAN.value): undefined;
        
//         const item: Items = {
//           Id: Id,
//           Name_: Name_!=undefined ?Name_.toString():"",
//           BrandID: parseInt(BrandID)||0,
//           GTIP: GTIP != undefined? GTIP.toString():"",
//           Height: parseFloat(Height)||0.0,
//           CurrencyID: parseInt(CurrencyID)||0,
//           IGID: parseInt(IGID)||0,
//           IsActive: IsActive=="yes"?true:false,
//           IsTemplate: IsTemplate=="yes"?true:false,
//           Isparent: Isparent=="yes"?true:false,
//           ItemOfferGroup: ItemOfferGroup,
//           Length:  parseFloat(Length)||0.0,
//           NamePARENT: NamePARENT!=undefined?NamePARENT.toString():"",
//           PCSAmount:  parseFloat(PCSAmount)||0.0,
//           SalesPrice: parseFloat(SalesPrice)||0.0,
//           StoreID:  parseInt(StoreID)||0,
//           UnitID:  parseInt(UnitID)||0,
//           UnitPerBox: parseFloat(Weight)||0.0,
//           Variant :   Variant != undefined? GTIP.toString():"",
//           Weight: parseFloat(Weight)||0.0,
//           WidthLengthHeight: WidthLengthHeight!=undefined? WidthLengthHeight.toString():"",
//           CompanyItemCode: CompanyItemCode!=undefined? CompanyItemCode.toString():"",
//           Width: parseFloat(Width)||0.0,
//           EAN: EAN!=undefined? EAN.toString():"",
//         };
    
//         return item;
//       }
// }


