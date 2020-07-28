import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AnnotatedFileService } from 'src/app/services/annotated-file.service';
import { AnnotatedDataService } from 'src/app/services/annotated-data.service';
import { environment } from 'src/environments/environment';
import { ProjectFileService } from 'src/app/services/project-file.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit {

  constructor(private _route: ActivatedRoute,
      private _http: HttpClient,
      private _project: ProjectService,
      private _project_file: ProjectFileService,
      private _annotated_data: AnnotatedDataService,
      private _annotated_file: AnnotatedFileService) { }
    
    
    isCollapsed = false;
    project_id = null;
    project_details = null;
    currentChartDataIndex = null;
    currentAnnotatedData = null;
    currentSelectedArea = null;
    tggedDataChanged = false;
    // availableFiles = [
    //     'data_nob.csv',
    //     'data_s3.csv',
    //     'data_s3e.csv',
    //     'dataa.csv',
    //     'h_data.csv',
    //     'v_data.csv',
    // ];
    filesList = [];
    filesIdList = [];
    chartData = null;

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    setChartData(index) {
        if (this.tggedDataChanged) {
            this.writeAnnotatedData(this.filesList[this.currentChartDataIndex]);
        }
        if (index === 'next') {
            if (this.currentChartDataIndex === null) {
                this.currentChartDataIndex = -1;
                // return;
            }
            if (this.currentChartDataIndex === this.filesIdList.length - 1) {
                return;
            }
            this.currentChartDataIndex = this.currentChartDataIndex + 1;
        } else if (index === 'prev') {
            if (this.currentChartDataIndex === null) {
                return;
            }
            this.currentChartDataIndex = this.currentChartDataIndex - 1;
            if (this.currentChartDataIndex < 0) {
                this.currentChartDataIndex = 0;
                return;
            }
        } else {
            this.currentChartDataIndex = index;
        }

        console.log('@@@@@@', this.currentAnnotatedData);
        this.getOrAssignFile(this.currentChartDataIndex);
    }

    getAnnotatedData(value) {
        this.currentAnnotatedData = value['tags'];
        this.currentSelectedArea = value['areas'];
        if (!value['init']) {
            this.tggedDataChanged = true;
        }
        setTimeout(() => {
        }, 500);
    }

    completeAnnotation() {
        this.writeAnnotatedData(this.filesList[this.currentChartDataIndex], true);
    }

    // readFileData(index) {
    //     const fileName = this.availableFiles[index];
    //     this._http.get(`assets/chart-data/${fileName}`, {responseType: 'text'})
    //         .subscribe(
    //             response => {
    //                 // console.log(response);
    //                 this.chartData = {
    //                     data: response,
    //                     type: {
    //                         curveNumber: 1,
    //                         xDataType: 'date'
    //                     }
    //                 };
    //             },
    //             error => {
    //                 // console.log('**', error);
    //             }
    //         );
    // }

    getOrAssignFile(index) {
        const file_id = this.filesIdList[index];
        this._project_file.assignProjectFile(file_id).subscribe(
            response => {
                this.filesList[index] = response;
                this.readFileData(index);
            },
            error => {

            }
        );
    }

    readFileData(index) {
        const selectedChart = this.filesList[index];
        let fileUrl = selectedChart['file'];
        const chartDataForTag = {
            type: {
                curveNumber: selectedChart['curves_count'],
                xDataType: selectedChart['data_type'],
                isVertical: selectedChart['is_vertical'],
            }
        }
        if (selectedChart['annotated_data']) {
            // fileUrl = environment.rootURL + selectedChart['annotated_data']['file'];
            let selectedArea = selectedChart['annotated_data']['selected_area'];
            selectedArea = JSON.parse(selectedArea || '{}');
            chartDataForTag['preSelectedArea'] = selectedArea
            let taggedData = selectedChart['annotated_data']['tagged_data'];
            taggedData = JSON.parse(taggedData || '{}');
            chartDataForTag['preTaggedData'] = taggedData
        }
        this._http.get(fileUrl, {responseType: 'text'})
            .subscribe(
                response => {
                    chartDataForTag['data'] = response;
                    this.chartData = chartDataForTag;
                    console.log(this.chartData);
                },
                error => {}
            );
    }

    writeAnnotatedData(projectFile, completed = false) {
        const data = {
            // annotated: this.currentAnnotatedData,
            selected_area: JSON.stringify(this.currentSelectedArea),
            tagged_data: JSON.stringify(this.currentAnnotatedData),
            parent: projectFile['id'],
        };
        this.currentAnnotatedData = null;
        this.currentSelectedArea = null;
        this.tggedDataChanged = false;
        const anno_file = projectFile['annotated_data'];
        if (completed) {
            data['completed'] = true;
        }
        if (anno_file && anno_file.id) {
            this._annotated_data.editAnnotatedData(data, anno_file.id).subscribe(
                response => {
                    // projectFile['annotated_data']['tagged_data'] = response['tagged_data'];
                    // projectFile['annotated_data']['selected_area'] = response['selected_area'];
                    projectFile['annotated_data'] = response;
                },
                error => {}
            );
        } else {
            this._annotated_data.addNewAnnotatedData(data).subscribe(
                response => {
                    projectFile['annotated_data'] = response;
                },
                error => {}
            );
        }
    }

    getProjectDetails() {
        this._project.getDashboardProject(this.project_id).subscribe(
            response => {
                this.project_details = response;
                this.filesIdList = response['files'];
            },
          error => {}
        );
    }

    ngOnInit() {
        this._route.params.subscribe(param => {
            this.project_id = param['id'];
            this.getProjectDetails();
        });
    }

}
