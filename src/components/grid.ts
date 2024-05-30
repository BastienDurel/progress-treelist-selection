import { GridColumnProps } from '@progress/kendo-vue-grid';
import { TreeListColumnProps } from '@progress/kendo-vue-treelist';
import { ColumnBaseProps } from '@progress/kendo-vue-data-tools';

interface ColType extends ColumnBaseProps {
    hidden?: boolean;
}

interface ColTypeT extends ColType {
    tid: number;
}

export interface GridColumnPropsT extends GridColumnProps {
    tid: number;
}

export interface TreeListColumnPropsT extends TreeListColumnProps {
    tid: number;
}

export const extractColumns = (data: any): Array<GridColumnProps> => {
    if (data?.length > 0) {
        console.log(Object.keys(data[0]))
        return Object.keys(data[0]).map(c => { return { field: c } });
    }
    return [{}];
}

function _mergeColumns<T extends ColType, TT extends ColTypeT & T>(defaults: TT[], stored?: TT[] | null): T[] {
    if (!stored) {
        //console.log("defaults");
        return defaults;
    }
    const ret = defaults.map((c, i) => {
        const n: any = { orderIndex: i };
        const st = stored.find(d => d.tid === c.tid || (c.tid === undefined && c.field == d.field));
        if (st) {
            if (st.width) n.width = st.width;
            if (st.orderIndex) n.orderIndex = st.orderIndex;
            if (st.hidden) n.hidden = st.hidden;
        }
        return Object.assign({}, c, n);
    });
    if (ret[0].hidden && ret[0].columnMenu) {
        // Make sure column menu is accessible
        ret.find(x => !x.hidden).columnMenu = ret[0].columnMenu;
    }
    //console.log(ret);
    return ret;
}

export function mergeColumns(defaults: GridColumnPropsT[], stored?: GridColumnPropsT[] | null): GridColumnProps[] {
    return _mergeColumns(defaults, stored);
}

export function mergeGridColumns(defaults: TreeListColumnPropsT[], stored?: TreeListColumnPropsT[] | null): TreeListColumnProps[] {
    return _mergeColumns(defaults, stored);
}


export function getPdvFilters(state: GridStateStore): PdvFilter {
    const filters: PdvFilter = {};
    console.log(state.filters);
    if (state.filters.pdvId)
        filters.id = state.filters.pdvId;
    if (state.filters.pdvDenom)
        filters.nom = state.filters.pdvDenom.text;
    if (state.filters.pdvNom)
        filters.nom = state.filters.pdvNom;
    if (state.filters.pdvEnseigne)
        filters.enseigne = state.filters.pdvEnseigne;
    if (state.filters.pdvActif !== undefined && state.filters.pdvActif !== null)
        filters.actif = !!state.filters.pdvActif;
    if (state.filters.pdvAddress)
        filters.adresse = state.filters.pdvAddress
    if (state.filters.pdvCP)
        filters.cp = state.filters.pdvCP
    if (state.filters.pdvCommune)
        filters.ville = state.filters.pdvCommune
    if (state.filters.pdvClient)
        filters.client = state.filters.pdvClient
    if (state.filters.pdvRegion && state.filters.pdvRegion.length > 0)
        filters.regions = state.filters.pdvRegion.map(x => x.id);
    if (state.filters.pdvDept && state.filters.pdvDept.length > 0)
        filters.departements = state.filters.pdvDept.map(x => x.id);
    return filters;
}
