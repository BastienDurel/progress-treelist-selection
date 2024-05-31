<template>
  <div
    id="commandes-filters"
    class="box neroli-filters"
  >
    <StackLayout
      :gap="15"
      :orientation="'horizontal'"
      :align="{ horizontal: 'start' }"
    >
      <StackLayout
        class="buttons"
        :gap="3"
        :orientation="'vertical'"
        :align="{ horizontal: 'start' }"
      >
        <div style="flex: 1" />
        <div class="buttons-stack">
          <Button
            type="button"
            size="small"
            shape="square"
            :svg-icon="filterClearIcon"
            title="Effacer les filtres"
            @click="state.filters = {}"
          />
          <Button
            v-if="DEBUG"
            type="button"
            size="small"
            shape="square"
            :svg-icon="pauseIcon"
            title="Debug"
            @click="() => { debugger; }"
          />
        </div>
        <div style="flex: 1" />
      </StackLayout>
      <div class="buttons center-v">
        <Button
          type="button"
          :svg-icon="arrowRotateCwIcon"
          :shape="'square'"
          title="Appliquer les filtres"
          @click="refreshData"
        />
      </div>
    </StackLayout>
  </div>
  <Toolbar class="mass-actions">
    <ToolbarSpacer />
    <ButtonGroup v-if="false" />
  </Toolbar>
  <div
    id="pdv-grid"
    class="box"
  >
    <TreeList
      :columns="cols()"
      :data-items="data"
      :style="{ 'maxHeight': `${height - getGridTop()}px` }"
      :resizable="state.resizable"
      :sort="sort"
      :reorderable="state.reorderable"
      :sortable="state.sortable"
      :pageable="{
        info: true,
        pageSizes: [10, 15, 20, 50, 100],
        pageSizeValue: state.take,
        buttonCount: 10,
      }"
      :skip="state.skip"
      :take="state.take"
      :total="state.total"
      :page-size="state.take"
      :selected-field="SELECTED_FIELD"
      :expand-field="EXPAND_FIELD"
      :sub-items-field="SUB_ITEMS_FIELD"
      @expandchange="$event.dataItem.expanded = !$event.dataItem.expanded"
      @headerselectionchange0="event => { debugger; data?.forEach((item) => item.selected = event.event.target.checked) }"
      @headerselectionchange="foo"
    >
      <template #nom="{ props }">
        <td
          :class="props.class"
          role="gridcell"
        >
          <span
            v-if="props.level.length > 1"
            style="padding-right: 0.5em"
          >{{ props.dataItem.client }}</span>
          <span>{{ props.dataItem.nom }}</span>
        </td>
      </template>
    </TreeList>
  </div>
</template>

<script lang="ts">
import { arrowRotateCwIcon, filterClearIcon, pauseIcon } from "@progress/kendo-svg-icons";
import { StackLayout } from "@progress/kendo-vue-layout";
import { Button, ButtonGroup, Toolbar, ToolbarSpacer } from "@progress/kendo-vue-buttons";
import { TreeList, TreeListHeaderSelectionChangeEvent } from '@progress/kendo-vue-treelist';
import { SortDescriptor } from "@progress/kendo-data-query";
import { TreeListColumnPropsT, getPdvFilters, mergeGridColumns } from "../components/grid";
import { DataListOf, GridStateStore, PdvT } from "../global";
const DEBUG = !!import.meta.env.VITE_DEBUG;
const state: GridStateStore = {
  skip: 0,
  take: 10,
  reorderable: true,
  sortable: true,
  resizable: true,
  columns: [],
  total: 0,
  filters: {},
  key: 0,
}
const sort = ref<SortDescriptor[]>([]);
const data = ref<PdvT[]>();
const SUB_ITEMS_FIELD = 'pdvs';
const EXPAND_FIELD = "expanded";
const SELECTED_FIELD = "selected";
const DEFAULT_COLUMNS: TreeListColumnPropsT[] = [
    { tid: 0, field: SELECTED_FIELD, title: "Selection" },
    { tid: 1, field: "id", title: "Id", expandable: true },
    { tid: 2, field: "nom", title: "Nom", cell: "nom" },
    { tid: 3, field: "enseigne", title: "Enseigne" },
    { tid: 4, field: "actif", title: "Actif" },
    { tid: 5, field: "adr1", title: "Adresse1" },
    { tid: 6, field: "adr2", title: "Adresse2" },
    { tid: 7, field: "cp", title: "Cp" },
    { tid: 8, field: "ville", title: "Ville" },
    { tid: 9, field: "tel1", title: "Telephone1" },
    { tid: 10, field: "tel2", title: "Telephone2" },
    { tid: 11, field: "fax1", title: "Fax1" },
    { tid: 12, field: "fax2", title: "Fax2" },
    { tid: 13, field: "email", title: "Email" },
    { tid: 14, field: "typePDV", title: "Type_pdv" },
];
function foo(e: TreeListHeaderSelectionChangeEvent) {
    console.log(e, arguments);
    debugger;
    alert(0);
}
</script>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWindowSize } from "vue-window-size";
import $http from '../api.ts';
const { height } = useWindowSize();
const loader = ref(false);
onMounted(refreshData);
const hasChanges = () => false;
function refreshData() {
    if (hasChanges()) {
        if (!window.confirm('Vous allez perdre vos changements en cours, voulez-vous vraiment continuer ?'))
            return false;
    }
    const filters = getPdvFilters(state);
    // Only actives cmds by default
    if (sort.value && sort.value.length > 0) {
        filters.sort = sort.value.map(s => { return { field: s.field, direction: s.dir } });
    }
    const config = {
        method: 'get',
        url: '/_data/treelist.json',
        params: {
            skip: state.skip,
            count: state.take,
        },
        data: filters
    };
    loader.value = true;
    $http<DataListOf<PdvT>>(config).then(val => {
        data.value = [];
        data.value = val.data.data;
        state.total = val.data.total;
    }).finally(() => loader.value = false);
}
function getGridTop(): number {
    const g = document.getElementById("pdv-grid");
    if (!g) return 260;
    const computed = g.offsetTop + 11 /* app-content: margin-bottom */ + 2 /* grid border */;
    //console.log(`computed size: ${computed}`);
    return computed;
}
function cols() {
    const cols = mergeGridColumns(DEFAULT_COLUMNS, state.columns);
    cols.filter(x => x.field == SELECTED_FIELD).forEach(x => x.headerSelectionValue = data.value?.every(x => x.selected) ?? false);
    return cols;
}
</script>

<style scoped lang="scss">
.mass-actions {
    margin-top: 1em;
    background-color: transparent;
    border: none;
}

.k-treelist {
    ::v-deep(tbody tr[aria-level="2"]) {
        background-color: rgb(from var(--bs-success-bg-subtle) r g b / 0.6);

        &.k-alt {
            background-color: var(--bs-success-bg-subtle);
        }
    }
}
</style>