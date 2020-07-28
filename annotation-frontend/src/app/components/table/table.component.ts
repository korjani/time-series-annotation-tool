import { Component, Input, TemplateRef, OnInit, Output, EventEmitter, ContentChildren, ContentChild } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  nzPageSize = 5;
  nzPageSizeOptions = [5, 10, 20, 30, 40, 50, 100];

  // checkbox variable
  idOfChecked = [];
  isOperating = false;
  isIndeterminate = false;
  isAllDisplayDataChecked = false;

  sortName: string | null = null;
  sortValue: string | null = null;
  searchAddress: string;
  listOfSearchName: string[] = [];
  // listOfName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }];
  // listOfAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];
  listOfData: Array<any> = [];
  listOfDisplayData: Array<any> = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  mapOfCheckedNestedId: { [key: string]: boolean } = {};
  mapOfExpandId: { [key: string]: boolean } = {};
  timeFieldKeys = ['deadline', 'created_at'];
  linkFieldKeys = ['projectName'];
  @Output() itemSelectedChange: EventEmitter<any> = new EventEmitter();
  @Input() set itemSelected(value) {
    if (value.length === 0) {
      this.checkAll(false);
    }
  }
  @ContentChildren(TemplateRef) cellTemplates;
  @ContentChild('rowTemplate') tableRowTemplate;
  @Input() tableHeaderData: any = {}
  @Input() expandDataKey: string;
  @Input() set getTableRowData(value) {
    this.listOfData = [
      ...value
    ];
    this.listOfDisplayData = [
      ...value
    ];
    this.checkAll(false);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    this.search();
  }

  search(): void {
    // /** filter data **/
    // const filterFunc = (item: { name: string; age: number; address: string }) =>
    //   (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) &&
    //   (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    // const data = this.listOfData.filter(item => filterFunc(item));
    const data = this.listOfData.filter((item) => item);
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.listOfDisplayData = data;
    }
  }

  // check single item
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
      const itemOfChecked = this.listOfData.filter(item => this.mapOfCheckedId[item.id]);
      this.idOfChecked = itemOfChecked.map(item => item.id);
      this.itemSelectedChange.emit(this.idOfChecked);
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  returnZero() {
    return 0;
  }

  ngOnInit() {
  }
}
