import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import 'chartjs-plugin-zoom';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

    constructor() { }

    chart = null;
    chartWidth = 1000;
    uploadResult = null;
    // addFileModalShow = false;
    lineColors = ['blue', 'red', 'green', 'orange', 'brown', 'black', 'yellow', 'darkblue', 'darkcyan', 'darkgreen'];
    tagsColor = ['#ff0000', '#08ffc8', '#ff00c8', '#f7b71d', '#e42c64'];
    tagList = [];
    dataRowsNumber = null;
    allTagsColor = {};
    currentTag;
    currentcolor;
    @Output() annotatedData = new EventEmitter();
    // @Input() set dataSender(value: string) {
    //     console.log('!!!!!', value);
    //     if (value === 'get') {
    //         this.annotatedData.emit(this.tagsStatusInfo);
    //     }
    // }
    @Input() set getTagList(value: Array<any>) {
        this.tagList = value;
        this.tagList.forEach((tag, i) => {
            this.allTagsColor[tag.id] = this.tagsColor[i % 5];
        });
        if (this.tagList[0]) {
            this.currentTag = this.tagList[0].id;
            this.currentcolor = this.allTagsColor[this.currentTag];
            if (this.savedAllArea[this.currentTag]) {
                this.selectedArea = this.savedAllArea[this.currentTag];
            }
        }
        if (this.dataRowsNumber) {
            this.tagsStatusInfo[this.currentTag] = new Array(this.dataRowsNumber).fill(0);
        }
    }
    @Input() set getData(dataObj) {
        this.resetChart();
        // data is csv file dat
        if (!dataObj) {
            return;
        }
        if (!dataObj.data) {
            return;
        }
        const data = dataObj.data;
        if (dataObj.preSelectedArea) {
            this.savedAllArea = dataObj.preSelectedArea;
            if (this.currentTag) {
                this.selectedArea = this.savedAllArea[this.currentTag] || [];
            }
            if (this.selectionContext) {
                this.drawAllRects();
            }
        }
        if (dataObj.preTaggedData) {
            this.tagsStatusInfo = dataObj.preTaggedData;
        }
        let curveNumber = 1;
        let xDataType = null;
        if (dataObj.type) {
            curveNumber = dataObj.type.curveNumber || 1;
            xDataType = dataObj.type.xDataType;
        }
        
        const lines = data.split(/\r\n|\n|\r/);
        this.dataRowsNumber = lines.length;
        // timestamp = [];
        // datasets = [];
        if (this.currentTag) {
            this.tagsStatusInfo[this.currentTag] = new Array(lines.length).fill(0);
        }
        // this.chartConfig.data.labels = [];
        // this.chartConfig.data.datasets[0].data = [];
        this.chartConfig.data.datasets = [];
        const firstRow = lines[0].split(',');
        for (let col=1; col <= curveNumber; col++) {
            const curveLabel = isNaN(Number(firstRow[col])) ? firstRow[col] : `Curve ${col}`;
            const dataSet: any = {
                label: curveLabel,
                data: [],
                borderWidth: 1,
                borderColor: this.lineColors[col - 1],
                backgroundColor: 'transparent',
            };
            this.chartConfig.data.datasets.push(dataSet);
        }
        if (curveNumber > 1) {
        } else {
            this.chartConfig.data.datasets.splice(1);
        }
        const preSetTag = [];
        for (let col = curveNumber + 1; col < firstRow.length; col++) {
            if (firstRow[col].includes(':')) {
                const tag_id = firstRow[col].split(':')[0];
                preSetTag.push(tag_id);
                this.tagsStatusInfo[tag_id] = new Array(lines.length).fill(0);
            }
        }
        lines.forEach((line, index) => {
            const colData = line.split(',');
            // timestamp.push(colData[0]);
            // datasets.push(colData[1]);
            // if (index === 1) {
            //     this.chartConfig.options.scales.xAxes[0].ticks.min = Number(colData[0]);
            // }
            // if (index === 101) {
            //     this.chartConfig.options.scales.xAxes[0].ticks.max = Number(colData[0]);
            // }
            if ((!isNaN(Number(colData[0]))) || index !== 0) {
                switch (xDataType) {
                    case 'float':
                        this.chartConfig.data.labels.push(Number(colData[0]));
                        break;
                    case 'timestamp':
                        const m = moment(Number(colData[0]) * 1000);
                        this.chartConfig.data.labels.push(`${index}---${m.format('HH:mm')}`);
                        break;
                    default:
                        this.chartConfig.data.labels.push(colData[0]);
                        break;
                }
            }
            for (let col=1; col <= curveNumber; col++) {
                // if ((!isNaN(Number(colData[0])) && !isNaN(Number(colData[1]))) || index !== 0) {
                if ((!isNaN(Number(colData[col]))) || index !== 0) {
                    // x-y
                    // options.data.labels.push(new Date(Number(colData[0])));
                    // options.data.datasets[0].data.push(Number(colData[1]));

                    // time series
                    // options.data.datasets[0].data.push({
                    //     x: Number(colData[0])*1000,
                    //     y: Number(colData[1])
                    // });

                    // // custom label with moment.js
                    // const m = moment(Number(colData[0]) * 1000);
                    // // options.data.labels.push([m.format('YYYY-MM-DD'), m.format('HH:mm')]);
                    // // this.chartConfig.data.labels.push(`${index}---${m.format('HH:mm')}`);
                    // // this.chartConfig.data.labels.push([`${index}---${colData[0]}`]);
                    // this.chartConfig.data.labels.push(Number(colData[0]));
                    this.chartConfig.data.datasets[col - 1].data.push(Number(colData[col]));
                }
            }
            for (let col = curveNumber + 1; col < colData.length; col++) {
                if ((isNaN(Number(colData[col]))) && index === 0) {
                    return;
                }
                const preSetTagIndex = col - (curveNumber + 1);
                if (preSetTagIndex < preSetTag.length) {
                    const column_tag_id = preSetTag[preSetTagIndex];
                    this.tagsStatusInfo[column_tag_id][index] = colData[col];
                }
            }
            if (Object.keys(this.tagsStatusInfo).length) {
                this.annotatedData.emit({
                    tags: this.tagsStatusInfo,
                    areas: this.savedAllArea,
                    init: true
                });
            }
        });
        // console.log(this.chartConfig.data);
        if (this.chart) {
            this.chart.update();
        }

    }

    chartConfig = {
        type: 'line',
        data: {
            // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", 
            // "Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            labels: [],
            // labels: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'],
            // labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            datasets: [{
                    label: '# Curve 1',
                    // data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
                    // data: [
                    //     // { x: new Date(2017, 01, 06, 18, 39, 30).getTime(), y: 100 },
                    //     // { x: new Date(2017, 01, 07, 18, 39, 28).getTime(), y: 101 },
                    //     { x: 2, y: 101 },
                    //     { x: 8, y: 26 },
                    //     { x: 16, y: 59 },
                    //     { x: 32, y: 78 },
                    //     { x: 64, y: 13 },
                    // ],
                    data: [],
                    borderWidth: 1,
                    borderColor: 'blue',
                    backgroundColor: 'transparent',
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: true,
                    // type: 'time',
                    // time: {
                    //     displayFormats: {
                    //         quarter: 'YYYY-MM-DD'
                    //     }
                    // }
                    ticks: {
                        // min: 's1',
                        // max: 's5',
                        // stepSize: 1300
                        // maxTicksLimit: 5
                        autoSkip: true,
                        maxTicksLimit: 50,
                        // suggestedMin: 31000,
                        // suggestedMax: 32000,
                        // min: 31000,
                        // max: 32000
                    },
                }],
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            elements: {
                line: {
                    tension: 0,
                },
                point: {
                    radius: 0
                }
            },
            // pan: {
            //     enabled: true,
            //     mode: 'x',     
            // },
            // zoom: {
            //     enabled: true,         
            //     mode: 'x',     
            // },
            // responsive: true
            // plugins: {
            //     zoom: {
            //         pan: {
            //             enabled: true,
            //             mode: 'x',
            //             // rangeMin: {
            //             //     x: 's1'
            //             // },
            //             // rangeMax: {
            //             //     x: 's12'
            //             // },
            //             // speed: 10000
            //         },
            //         zoom: {
            //             enabled: true,
            //             // drag: false,
            //             mode: 'x',
            //             // rangeMin: {
            //             //     x: 's'
            //             // },
            //             // rangeMax: {
            //             //     x: 's'
            //             // },
            //             // sensitivity: 0.0000000000000000000000000000000000000001,
            //             // sensitivity: 0.5,
            //             // speed: 0.1,
            //             // threshold: 100
            //         }
            //     }
            // },
        }
    }

    // createChart() {
        // this.chart = new Chart('canvas', {
        //   type: 'line',
        //   data: {
        //     labels: ['s1', 's2', 's3', 's4'],
        //     datasets: [
        //       { 
        //         data: [2, 8, 56, 31],
        //         borderColor: "#3cba9f",
        //         fill: false
        //       },
        //       { 
        //         data: [12, 45, 67, 36],
        //         borderColor: "#ffcc00",
        //         fill: false
        //       },
        //     ]
        //   },
        //   options: {
        //     legend: {
        //       display: false
        //     },
        //     scales: {
        //       xAxes: [{
        //         display: true
        //       }],
        //       yAxes: [{
        //         display: true
        //       }],
        //     }
        //   }
        // });
    // }
    savedAllArea = {};
    tagsStatusInfo = {};
    selectionContext = null;

    xNearestPosition = [null, null];
    xClickPosition = [null, null];
    startIndex = 0;
    endIndex = 0;
    selectedArea = [];

    resetChart() {
        // clear selected erea
        const canvas = <HTMLCanvasElement>document.getElementById('chartJSContainer');
        if (this.selectionContext) {
            this.selectionContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        this.selectedArea = [];
        this.savedAllArea = {};
        this.chartConfig.data.labels = [];
        this.chartConfig.data.datasets = [{
            label: '# No curve',
            data: [],
            borderWidth: 1,
            borderColor: 'blue',
            backgroundColor: 'transparent',
        }];
        if (this.chart) {
            this.chart.update();
        }
    }


    createChart() {
        this.chart = new Chart('chartJSContainer', this.chartConfig);
        const canvas = <HTMLCanvasElement>document.getElementById('chartJSContainer');
        // ctx = canvas.getContext('2d');
        // chart = new Chart(ctx, options);
        const chart = this.chart;
        const overlay = <HTMLCanvasElement>document.getElementById('overlay');
        // const xNearestPosition = [null, null];
        // const xClickPosition = [null, null];
        // const startIndex = 0;
        // const endIndex = 0;
        overlay.width = 1000;
        overlay.height = 600;
        // overlay.width = canvas.width;
        // overlay.height = canvas.height;
        // const selectionContext = overlay.getContext('2d');
        this.selectionContext = overlay.getContext('2d');
        this.selectionContext.globalAlpha = 0.3;
        let selectionRect = {
            w: 0,
            startX: 0,
            startY: 0
        };
        const verticalLineMoving = {
            w: 0,
            startX: 0,
            startY: 0
        };
        // const selectedArea = [];
        let drag = false;
        canvas.addEventListener('pointerdown', evt => {
            const points = chart.getElementsAtEventForMode(evt, 'index', {
                intersect: false
            });
            this.xClickPosition[0] = this.getRelativePosition(evt, chart)['x'];
            this.xNearestPosition[0] = points[0]._view.x;
            this.startIndex = points[0]._index;
            const rect = canvas.getBoundingClientRect();
            selectionRect.startX = evt.clientX - rect.left;
            selectionRect.startY = chart.chartArea.top;
            drag = true;
            // save points[0]._index for filtering
        });
        canvas.addEventListener('pointermove', evt => {
            const rect = canvas.getBoundingClientRect();
            this.selectionContext.fillStyle = this.currentcolor;
            if (drag) {
                const rect = canvas.getBoundingClientRect();
                selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
                this.selectionContext.clearRect(0, 0, canvas.width, canvas.height);
                // drawRects(selectedArea);
                this.drawAllRects();
                this.selectionContext.fillRect(selectionRect.startX,
                    selectionRect.startY,
                    selectionRect.w,
                    chart.chartArea.bottom - chart.chartArea.top);
            } else {
                this.selectionContext.clearRect(0, 0, canvas.width, canvas.height);
                // drawRects(selectedArea);
                this.drawAllRects();
                const x = evt.clientX - rect.left;
                this.selectedArea.forEach(area => {
                    if (x > area.startX && x < area.startX + area.w) {
                        return;
                    }
                });
                if (x > chart.chartArea.left) {
                    this.selectionContext.fillRect(x,
                        chart.chartArea.top,
                        1,
                        chart.chartArea.bottom - chart.chartArea.top);
                }
            }
        });
        canvas.addEventListener('pointerup', (evt) => {  
            const points = chart.getElementsAtEventForMode(evt, 'index', {
                intersect: false
            });
            this.xClickPosition[1] = this.getRelativePosition(evt, chart)['x'];
            this.xNearestPosition[1] = points[0]._view.x;
            this.endIndex = points[0]._index;

            // save selected area
            const overlappedAreaIndex = [];
            this.selectedArea.forEach((area, index) => {
                if (this.hasOverlay(area, selectionRect)) {
                    overlappedAreaIndex.push(index);
                    const overlayArea = this.combineArea(selectionRect, area);
                    selectionRect = overlayArea;
                }
            });
            overlappedAreaIndex.reverse();
            overlappedAreaIndex.forEach(index => {
                this.selectedArea.splice(index, 1);
            });
            this.selectedArea.push(JSON.parse(JSON.stringify(selectionRect)));
            this.savedAllArea[this.currentTag] = this.selectedArea;

            drag = false;

            // record status 1 for selected data-point of chart
            const indexes = this.getSelectedIndex();
            this.tagSelectedArea(indexes);
            console.log('>>>>>>>', this.tagsStatusInfo);
            console.log('>>>>>>>', this.savedAllArea);
            this.annotatedData.emit({
                tags: this.tagsStatusInfo,
                areas: this.savedAllArea
            });
            // console.log('implement filter between ' 
            // + options.data.labels[indexes[0]] + ' and ' 
            // + options.data.labels[indexes[1]]);  
        });
        if (Object.keys(this.savedAllArea).length) {
            this.drawAllRects();
        }
    }
    drawRects(rectList) {
        const chartArea = this.chart.chartArea;
        rectList.forEach(area => {
            this.selectionContext.fillRect((area.startX - chartArea.left) * this.chartWidth / 1000 + chartArea.left,
                (area.startY - chartArea.top) * this.chartWidth / 1000 + chartArea.top,
                area.w * this.chartWidth / 1000,
                this.chart.chartArea.bottom - this.chart.chartArea.top);
        });
    }
    drawAllRects() {
        Object.keys(this.savedAllArea).forEach(tag_id => {
            this.selectionContext.fillStyle = this.allTagsColor[tag_id];
            this.drawRects(this.savedAllArea[tag_id]);
        });
        this.selectionContext.fillStyle = this.currentcolor;
    }
    hasOverlay(area1, area2) {
        const xs = this.x1x2(area1);
        const xxs = this.x1x2(area2);
        if ((xs[0] > xxs[0] && xs[0] < xxs[1]) || (xxs[0] > xs[0] && xxs[0] < xs[1])) {
            return true;
        }
        if (xs[0] == xxs[1] || xxs[0] == xs[1]) {
            return true;

        }
        return false;
    }
    combineArea(new_area, old_area) {
        const x1 = this.x1x2(new_area);
        const x2 = this.x1x2(old_area);
        const x_start = Math.min(x1[0], x2[0]);
        const x_end = Math.max(x1[1], x2[1]);
        return {
            w: x_end - x_start,
            startX: x_start,
            startY: new_area.startY
        };
    }
    x1x2(area) {
        const xs = [area.startX, area.startX + area.w];
        xs.sort(function(a, b){return a - b});
        return xs
    }
    getSelectedIndex() {
        let index = [this.startIndex, this.endIndex].sort(function(a, b){return a - b});
        this.xClickPosition.sort(function(a, b){return a - b});
        this.xNearestPosition.sort(function(a, b){return a - b});
        if (this.xClickPosition[0] < this.xNearestPosition[0]) {
            index[0]--;
        }
        if (this.xClickPosition[1] > this.xNearestPosition[1]) {
            index[1]++;
        }
        return index;
    }
    tagSelectedArea(indexes) {
        for (let i = indexes[0] + 1; i < indexes[1]; i++) {
            this.tagsStatusInfo[this.currentTag][i] = 1;
        }
    }

    setTag(tag_id) {
        // savedAllArea[currentTag] = selectedArea;
        let tagLength = 0;
        if (this.tagsStatusInfo[this.currentTag]) {
            tagLength = this.tagsStatusInfo[this.currentTag].length;
        }
        // const v = document.getElementById("select-tag").value;
        // const v = e.target.value;
        const v = tag_id;
        this.currentTag = v;
        this.currentcolor = this.allTagsColor[this.currentTag];
        this.selectionContext.fillStyle = this.currentcolor;
        this.tagsStatusInfo[this.currentTag] = new Array(tagLength).fill(0);
        if ( this.savedAllArea[this.currentTag]) {
            this.selectedArea = this.savedAllArea[this.currentTag];
        } else {
            this.selectedArea = [];
        }
    }
    onFileLoad(fileLoadedEvent, type=null) {
        const data = {
            data: fileLoadedEvent.target.result,
            type: type
        };
        this.getData = data;
    }
    loadFiles(files, type=null) {
        for (let key in files) {
            if (typeof(files[key]) === 'object') {
                const file = files[key];
                const reader = new FileReader();
                // Closure to capture the file information.
                reader.onload = e => this.onFileLoad(e, type);
                // Read in the image file as a data URL.
                reader.readAsText(file, 'UTF-8');
            }
        }
    }
    setChartData(e) {
        // const input = document.getElementById("data-upload");
        const input = e.target;
        const files = input.files;
        // if (files && files[0]) {
        this.loadFiles(files);
    }
    getRelativePosition = function (t, e) {
        let  i, n, a = t.originalEvent || t,
            o = t.target || t.srcElement,
            r = o.getBoundingClientRect(),
            s = a.touches;
        s && s.length > 0 ? (i = s[0].clientX, n = s[0].clientY) : (i = a.clientX, n = a.clientY);
        // const l = parseFloat(ut.getStyle(o, "padding-left")),
        //     d = parseFloat(ut.getStyle(o, "padding-top")),
        //     u = parseFloat(ut.getStyle(o, "padding-right")),
        //     h = parseFloat(ut.getStyle(o, "padding-bottom")),
        // my code
        const pd = e.config.options.layout.padding;
        // const l = pd.left,
        //     d = pd.top,
        //     u = pd.right,
        //     h = pd.bottom,
        const l = 0,
            d = 0,
            u = 0,
            h = 0,

        // my code
            c = r.right - r.left - l - u,
            f = r.bottom - r.top - d - h;
        return {
            x: i = Math.round((i - r.left - l) / c * o.width / e.currentDevicePixelRatio),
            y: n = Math.round((n - r.top - d) / f * o.height / e.currentDevicePixelRatio)
        }
    }

    scaleDataWithZoom() {
        const overlay = <HTMLCanvasElement>document.getElementById('overlay');
        overlay.width = this.chartWidth;
        overlay.height = 600;
        this.selectionContext = overlay.getContext('2d');
        this.selectionContext.globalAlpha = 0.3;
        this.drawAllRects();
    }

    zoomChart(zoomIn = 1) {
        if (zoomIn === 1 && this.chartWidth < 6000) {
            this.chartWidth += 1000;
            this.scaleDataWithZoom();
        }
        if (zoomIn === -1 && this.chartWidth > 1000) {
            this.chartWidth -= 1000;
            this.scaleDataWithZoom();
        }
    }

    // uploadFileToProject(files) {
    //     if (files) {
    //         this.loadFiles(files.files, files.type);
    //         this.uploadResult = 'success';
    //         setTimeout(() => {
    //             this.uploadResult = null;
    //         }, 1);
    //     }
    // }

    ngOnInit() {
        setTimeout(() => {
            this.createChart();
        }, 1000);
    }

}
