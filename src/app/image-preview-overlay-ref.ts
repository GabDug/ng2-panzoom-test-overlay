import { OverlayRef } from '@angular/cdk/overlay';

export class ImagePreviewOverlayRef {
    constructor(private overlayRef: OverlayRef) {}

    close(): void {
        this.overlayRef.dispose();
    }
}
