import { Component, VERSION } from "@angular/core";
import { PanZoomAPI, PanZoomConfig } from "ng2-panzoom";
import { Subscription } from "rxjs";
import { ImagePreviewOverlayRef } from './image-preview-overlay-ref';
import { ImagePreviewOverlayService } from './image-preview-overlay.service';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
    constructor(private previewDialog: ImagePreviewOverlayService) {}

     openImage(index: number): void {
        const dialogRef: ImagePreviewOverlayRef = this.previewDialog.open({
            image: 'this.project,',
            index,
        });
    }
  name = "Angular " + VERSION.major;
}
