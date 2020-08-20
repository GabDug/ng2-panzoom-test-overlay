import { ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import {  Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { ImagePreviewOverlayComponent } from './image-preview-overlay/image-preview-overlay.component';

import { ImagePreviewOverlayRef } from './image-preview-overlay-ref';
import { IMAGE_PREVIEW_DIALOG_DATA, IMAGE_PREVIEW_DIALOG_INDEX } from './image-preview-overlay.token';

import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';

// export interface Image {
//     name: string;
//     url: string;
// }

interface ImagePreviewDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    image?: string;
    index?: number;
}

const DEFAULT_CONFIG: ImagePreviewDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    image: undefined,
    index: 0,
};

@Injectable()
export class ImagePreviewOverlayService {
    constructor(
        private injector: Injector,
        private overlay: Overlay,
        private viewportRuler: ViewportRuler,
        @Inject(DOCUMENT) private document: Document
    ) {}

    open(config: ImagePreviewDialogConfig = {}): ImagePreviewOverlayRef {
        // Override default configuration
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };

        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(dialogConfig);
        // overlayRef.updateScrollStrategy(new BlockScrollStrategy(this.viewportRuler, this.document));
        // Instantiate remote control
        const dialogRef = new ImagePreviewOverlayRef(overlayRef);

        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
        overlayRef.backdropClick().subscribe(_ => dialogRef.close());

        return dialogRef;
    }

    private createOverlay(config: ImagePreviewDialogConfig): OverlayRef {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(
        overlayRef: OverlayRef,
        config: ImagePreviewDialogConfig,
        dialogRef: ImagePreviewOverlayRef
    ): ImagePreviewOverlayComponent {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(ImagePreviewOverlayComponent, null, injector);
        const containerRef: ComponentRef<ImagePreviewOverlayComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: ImagePreviewDialogConfig, dialogRef: ImagePreviewOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(ImagePreviewOverlayRef, dialogRef);
        injectionTokens.set(IMAGE_PREVIEW_DIALOG_DATA, config.image);
        injectionTokens.set(IMAGE_PREVIEW_DIALOG_INDEX, config.index);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private getOverlayConfig(config: ImagePreviewDialogConfig): OverlayConfig {
        const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy,
        });

        return overlayConfig;
    }
}
