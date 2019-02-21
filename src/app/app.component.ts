import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  readonly perPage = 20;
  search: FormControl;
  page: number = 1;
  maxPage: number;
  chosenImage: any;
  showModal: boolean = false;
  images: any[];

  constructor(private http : HttpClient) {}

  ngOnInit() {
    this.search = new FormControl('', [this.hasNotAllowedCharacters, Validators.required]);
  }

  hasNotAllowedCharacters(control: FormControl): null | any {
    // return null if there is no error or object if there is
    const value = control.value;
    if (!/[~!@#$%&*()\/\\=,;?+']/.test(value)) return null;
    else return { hasNotAloowedCharacters : true};
  }

  searchImage(isNewSearch: boolean) {
    const uri = `https://pixabay.com/api/?key=${environment.pixaBayApiKey}&q=${encodeURI(this.search.value)}&image_type=photo&page=${this.page}&per_page=${this.perPage}`;

    console.log(uri);
    this.http.get(uri)
      .pipe(take(1))
      .subscribe(resp => {
        this.images = (resp as any).hits;
        if(isNewSearch)
           // FIXME: if there is a left add one
          // this.maxPage = (resp as any).total / this.perPage;
          this.maxPage = 5;
      });
  }

  newSearch(): void {
    this.page = 1;
    this.searchImage(true)
  }

  More(next: boolean) {
    if (next) this.page += 1;
    else this.page -= 1;
    this.searchImage(false);
  }

  openModal(image: any) {
    this.chosenImage = image;
    this.showModal = true;
  }

  closeModal() {
     this.showModal = false;
  }

}
