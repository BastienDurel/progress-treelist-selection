type Nullable<T> = T | undefined | null;
type DataListOf<T> = {
  total: number,
  data: T[]
};
type DataList = DataListOf<any>;

interface PdvFilter {
    id?: number;
    nom?: string;
    enseigne?: string;
    adresse?: string;
    cp?: string;
    ville?: string;
    actif?: boolean;
    client?: string;
    regions?: string[];
    departements?: string[];
    //// SORTING
    sort?: any[],
  }
  interface ClientPdv {
    id: number;
    client?: string;
    nom?: string;
    enseigne?: string;
    adr1?: string;
    adr2?: string;
    cp?: string;
    ville?: string;
    tel1?: string;
    tel2?: string;
    tel1?: string;
    tel2?: string;
    email?: string;
    typePDV?: string;
  }
  interface Pdv extends ClientPdv {
    actif: boolean;
    pdvs: ClientPdv[];
  }
  interface PdvT extends Pdv {
    selected: boolean;
    expanded: boolean;
  }


  export interface PdvStateFilters {
    pdvNom?: string;
    pdvAddress?: string;
    pdvCP?: string;
    pdvActif?: boolean;
    pdvEnseigne?: string;
    pdvId?: number;
    pdvClient?: string;
  };
  export interface GridStateStore {
    resizable: boolean;
    reorderable: boolean;
    sortable: boolean;
    skip: number;
    take: number;
    filters: PdvStateFilters;
    filtersHash?: string;
    columns: GridColumnProps[] | null;
    total: number;
    key: number;
    data?: any[];
  }
  