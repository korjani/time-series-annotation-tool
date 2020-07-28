import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  constructor(private msg: NzMessageService,
    private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      curveNumber: ['', [Validators.required]],
      xDataType: ['', [Validators.required]],
      isVertical: [false],
    });
  }
  validateForm: FormGroup;
  
  showModal = false;
  uploading = false;
  fileList: UploadFile[] = [];
  fileDataResult = {
    files: [],
    type: null
  };
  @Output() isModalVisibleChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set isModalVisible(value) {
    this.showModal = value;
    this.isModalVisibleChange.emit(value);
  }
  @Output() uploadedFileList: EventEmitter<any>  = new EventEmitter();
  @Input() set uploadResult(status) {
    if (status === 'success') {
      this.msg.success('upload successfully.');
    } else if (status === 'failed') {
      this.msg.error('upload failed.');
    }
    this.uploading = false;
    this.fileList = [];
    setTimeout(() => {
      this.isModalVisible = false;
      this.resetForm(null);
    }, 1000);
  }


  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.fileDataResult.files = this.fileList;
    this.uploadedFileList.emit(this.fileDataResult);
    // You can use any AJAX library you like
    // const req = new HttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts/', formData, {
    //   // reportProgress: true
    // });
    // this.http
    //   .request(req)
    //   .pipe(filter(e => e instanceof HttpResponse))
    //   .subscribe(
    //     () => {
    //       this.uploading = false;
    //       this.fileList = [];
    //       this.msg.success('upload successfully.');
    //     },
    //     () => {
    //       this.uploading = false;
    //       this.msg.error('upload failed.');
    //     }
    //   );
  }

  closeModal() {
    this.isModalVisible = false;
    this.uploadedFileList.emit(null);
  }

  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (value.isVertical === null) {
      value.isVertical = false;
    }
    this.fileDataResult.type = value;
    this.handleUpload();
  };

  resetForm(e: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
      
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  ngOnInit() {
  }

}
