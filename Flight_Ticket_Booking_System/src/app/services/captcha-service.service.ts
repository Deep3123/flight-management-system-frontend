import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CaptchaServiceService {
  private captchaUrl: string = "http://localhost:8080/captcha";

  constructor(private http: HttpClient) {}

  // Method to fetch a CAPTCHA image (will return a blob)
  getCaptchaImage(): Observable<Blob> {
    return this.http.get(this.captchaUrl, {
      responseType: "blob",
      withCredentials: true,
    });
  }
}
