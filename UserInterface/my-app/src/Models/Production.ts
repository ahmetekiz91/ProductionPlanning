export interface Production {
  Id: number;
  CDate?: string;
  StartDate?: string;
  EndDate?: string;
  CustomerID?: number;
  MachineId?: number;
  ItemId?: number;
  StoreID?:number;
  UnitID?:number;
  ProductionAmount?: number;
  Poid?: number;
  ProductionFicheId?: number;
  Ordid?: number;
  IsTransferredToWarehouse?: boolean;
  SalesFicheID?: number;
  Humidity?: number;
  Temperature?: number;
  Grammage?: number;
  UpdatedByUserID?: number;
  UpdateDate?: string;
  BatchNo?: string;
  
}
/*
        public DateTime? StartDate { get; private set; }
        public DateTime? EndDate { get; private set; }
        public int? MachineId { get; private set; }
        public int? ItemId { get; private set; }
        public decimal? ProductionAmount { get; private set; }
        public int? Poid { get; private set; }
        public int? ProductionFicheId { get; private set; }
        public int? Ordid { get; private set; }
        public bool IsTransferredToWarehouse { get; private set; }
        public int? SalesFicheId { get; private set; }
        public decimal? Humidity { get; private set; }
        public decimal? Temperature { get; private set; }
        public decimal? Grammage { get; private set; }
        public int? StoreID { get; set; }
        public string? BatchNo { get; set; }
        public int? UnitID { get; set; }
*/