import {Component, EventEmitter, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';

import {ImagePreviewOverlayRef} from '../image-preview-overlay-ref';
import {IMAGE_PREVIEW_DIALOG_DATA, IMAGE_PREVIEW_DIALOG_INDEX} from '../image-preview-overlay.token';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {PanZoomAPI, PanZoomConfig} from 'ng2-panzoom';
import {Subscription} from 'rxjs';

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
    selector: 'app-image-preview-overlay',
    templateUrl: './image-preview-overlay.component.html',
    styleUrls: ['./image-preview-overlay.component.css'],
})
export class ImagePreviewOverlayComponent implements OnInit, OnDestroy {
    loading = true;
    animationState: 'void' | 'enter' | 'leave' = 'enter';
    animationStateChanged = new EventEmitter<AnimationEvent>();
    // Top bar animation
    slideDown = 'enter';

    // PanZoomRelated
    panZoomConfig: PanZoomConfig = new PanZoomConfig({
        scalePerZoomLevel: 1.05,
        zoomButtonIncrement: 6,
        zoomLevels: 20,
        freeMouseWheel: true,
        freeMouseWheelFactor: 0.01,
    });
    panZoomAPI: PanZoomAPI;
    apiSubscription: Subscription;

    constructor(
        public dialogRef: ImagePreviewOverlayRef,
        @Inject(IMAGE_PREVIEW_DIALOG_DATA) public content: string,
        @Inject(IMAGE_PREVIEW_DIALOG_INDEX) public index: number
    ) {
    }

    ngOnInit(): void {
        this.apiSubscription = this.panZoomConfig.api.subscribe((api: PanZoomAPI) => {
            this.panZoomAPI = api;
        });
    }

    ngOnDestroy(): void {
        this.apiSubscription.unsubscribe(); // don't forget to unsubscribe.  you don't want a memory leak!
    }

    center(): void {
        console.log('Center');
        this.panZoomAPI.centerContent();
    }

    @HostListener('document:keydown.escape', ['$event'])
    private handleEscapeKey(event: KeyboardEvent): void {
        this.dialogRef.close();
    }
}
