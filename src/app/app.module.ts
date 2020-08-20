import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppComponent } from "./app.component";
import { Ng2PanZoomModule } from "ng2-panzoom";
import { ImagePreviewOverlayComponent } from "./image-preview-overlay/image-preview-overlay.component";
import { ImagePreviewOverlayService } from './image-preview-overlay.service';
import { ImagePreviewOverlayRef } from "./image-preview-overlay-ref";

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule,OverlayModule, Ng2PanZoomModule],
  declarations: [AppComponent, ImagePreviewOverlayComponent],
  bootstrap: [AppComponent],
  providers: [ImagePreviewOverlayService]
})
export class AppModule {}
