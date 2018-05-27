import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {NgbModal, NgbModalRef, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private readonly uploadWallpaperUrl = 'http://ec2-13-59-235-170.us-east-2.compute.amazonaws.com:4300/upload'
    private readonly uploadToGalleryUrl = 'http://ec2-13-59-235-170.us-east-2.compute.amazonaws.com:4300/upload'
    private readonly addArticleUrl = 'http://ec2-13-59-235-170.us-east-2.compute.amazonaws.com:4300/addArticle'

    public isToasterVisible = false;
    public closeResult: string;
    public selectCityTitle = 'Select city';
    public countryList = ['Vanadzor', 'Erevan', 'Gyumri'];
    public wallpaperToUpload: Array<File>;
    public galleryImageToUpload: Array<File>;
    public articleModel = {
          title: '',
          data: '',
          wallpaper_image: '',
          building_date: '',
          images_folder: '',
          latitude: 0,
          longitude: 0,
          location_id: null,
      };

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private http: HttpClient
    ) {}

    ngOnInit() {}

    public openModal(content) {
        this.modalRef = this.modalService.open(content);
    }

    public get isCreateButtonDisabled(): boolean {
        if (this.articleModel.data !== '' &&
            this.articleModel.title !== '' &&
        this.articleModel.building_date !== '' &&
        this.articleModel.location_id !== null &&
        this.wallpaperToUpload
    ) {
            return false;
        }
        return true;
    }

    public onCityClick(country): void {
        this.articleModel.location_id = this.countryList.indexOf(country) + 1;
        this.selectCityTitle = country;
    }

    public onWallpaperImageChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.wallpaperToUpload = event.target.files;
      }
    }

    public onGalleryImageChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.galleryImageToUpload = event.target.files;
      }
    }

    public onSubmit() {
        this.parseDate();
        this.uploadWallpaperImage(this.wallpaperToUpload);
    }

    private uploadWallpaperImage(files: any) {
        console.log('uploadWallpaperImage >>>> ');
        const dirName = this.makeid();
        this.makeFileRequest(this.uploadWallpaperUrl, [], files, dirName).then((result) => {
            this.articleModel.wallpaper_image = result['path'];
            this.articleModel.images_folder = result['dir'];
            if (this.galleryImageToUpload) {
                this.uploadGalleryImage(this.galleryImageToUpload, dirName);
            } else {
                this.addArticle();
            }
        }, (error) => {
            console.error('error >>>> ', error);
        });
    }

    private uploadGalleryImage(files: any, dirName: string) {
        console.log('uploadGalleryImage >>>> ', files);
        this.makeFileRequest(this.uploadToGalleryUrl, [], files, dirName).then((result) => {
            this.addArticle();
        }, (error) => {
            console.error('error >>>> ', error);
        });
    }

    private addArticle() {
        console.log('articleModel >>>>> ');
        this.addArticleData(this.addArticleUrl).then(
        (result) => {
            this.isToasterVisible = true;
            setTimeout(() => {
                this.isToasterVisible = false;
            }, 2000);
        }, (error) => {
            console.error('error >>>> ', error);
        });
        this.modalRef.close()
        this.resetModel();
    }

    private  makeFileRequest(url: string, params: Array<string>, files: Array<File>, dirName: string) {
        const serverUrl = url + '?dirPath=' + dirName;
        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();
            for (let i = 0; i < files.length; i++) {
                formData.append('uploads[]', files[i], files[i].name);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('PUT', serverUrl, true);
            xhr.send(formData);
        });
    }

    private addArticleData(url) {
        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();
            formData.append('article', JSON.stringify(this.articleModel));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }

    private parseDate() {
        this.articleModel.building_date = this.articleModel.building_date['year']
                                            + '/' + this.articleModel.building_date['month']
                                            + '/' + this.articleModel.building_date['day'];
    }

    private makeid() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    private resetModel(): void {
        this.articleModel.data = '';
        this.articleModel.title = '';
        this.articleModel.building_date = '';
        this.articleModel.images_folder = '';
        this.articleModel.wallpaper_image = '';
        this.articleModel.latitude = 0;
        this.articleModel.longitude = 0;
        this.articleModel.location_id = null;
        this.wallpaperToUpload = null;
        this.galleryImageToUpload = null;
    }
}
