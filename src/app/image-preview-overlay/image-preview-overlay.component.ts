import { Component, EventEmitter, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';

import { ImagePreviewOverlayRef } from './../image-preview-overlay-ref';
import { IMAGE_PREVIEW_DIALOG_DATA, IMAGE_PREVIEW_DIALOG_INDEX } from '../image-preview-overlay.token';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { PanZoomAPI, PanZoomConfig } from 'ng2-panzoom';
import { Subscription } from 'rxjs';

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
    selector: 'app-image-preview-overlay',
    templateUrl: './image-preview-overlay.component.html',
    styleUrls: ['./image-preview-overlay.component.css'],
    animations: [
        trigger('fade', [
            state('fadeOut', style({ opacity: 0 })),
            state('fadeIn', style({ opacity: 1 })),
            transition('* => fadeIn', animate(ANIMATION_TIMINGS)),
        ]),
        trigger('slideContent', [
            state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.4)', opacity: 0 })),
            state('enter', style({ transform: 'none', opacity: 1 })),
            state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
            transition('* => *', animate(ANIMATION_TIMINGS)),
        ]),
        trigger('slideDown', [
            state('void', style({ transform: 'translateY(-100%)' })),
            state('enter', style({ transform: 'translateY(0)' })),
            state('leave', style({ transform: 'translateY(-100%)' })),
            transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
        ]),
    ],
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
    ) {}

    onLoad(event: Event): void {
        this.loading = false;
    }

    onAnimationStart(event: AnimationEvent): void {
        this.animationStateChanged.emit(event);
    }

    onAnimationDone(event: AnimationEvent): void {
        this.animationStateChanged.emit(event);
    }

    startExitAnimation(): void {
        this.animationState = 'leave';
    }

    ngOnInit(): void {
        this.apiSubscription = this.panZoomConfig.api.subscribe((api: PanZoomAPI) => {
            this.panZoomAPI = api;
        });
    }

    ngOnDestroy(): void {
        this.apiSubscription.unsubscribe(); // don't forget to unsubscribe.  you don't want a memory leak!
    }

    close(): void {
        console.log('Center');
        // this.dialogRef.close();
        // this.panZoomAPI.centerContent();
    this.panZoomAPI.centerY();
    }

    @HostListener('document:keydown.escape', ['$event'])
    private handleEscapeKey(event: KeyboardEvent): void {
        this.dialogRef.close();
    }
}
