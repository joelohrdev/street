import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryPhoto } from '@/types';

type PhotoLightboxProps = {
    photo: GalleryPhoto | null;
    position: number;
    total: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
};

export default function PhotoLightbox({
    photo,
    position,
    total,
    onClose,
    onPrevious,
    onNext,
}: PhotoLightboxProps) {
    const hasSiblings = total > 1;

    return (
        <DialogPrimitive.Root
            open={photo !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#0d0d0c]/95" />

                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className="fixed inset-0 z-50 flex flex-col outline-hidden"
                    onKeyDown={(event) => {
                        if (event.key === 'ArrowLeft') {
                            event.preventDefault();
                            onPrevious();
                        }

                        if (event.key === 'ArrowRight') {
                            event.preventDefault();
                            onNext();
                        }
                    }}
                >
                    <DialogPrimitive.Title className="sr-only">
                        {`Photograph ${position} of ${total}`}
                    </DialogPrimitive.Title>

                    {/* Catches clicks on the empty space around the photograph. The close
                        button and the Escape key cover the same action for the keyboard. */}
                    <div
                        role="presentation"
                        aria-hidden="true"
                        onClick={onClose}
                        className="absolute inset-0 cursor-zoom-out"
                    />

                    <div className="relative flex items-center justify-between px-6 py-6 text-xs tracking-[0.2em] text-white/60 uppercase md:px-10">
                        <span>{`${position} / ${total}`}</span>

                        <DialogPrimitive.Close
                            className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                            data-test="close-lightbox"
                        >
                            <span className="hidden sm:inline">Close</span>
                            <X className="size-5" />
                        </DialogPrimitive.Close>
                    </div>

                    <div className="pointer-events-none relative flex min-h-0 flex-1 items-center justify-center px-6 pb-10 md:px-20">
                        {photo && (
                            <img
                                src={photo.url}
                                width={photo.width ?? undefined}
                                height={photo.height ?? undefined}
                                alt={`Street photograph ${position} of ${total}`}
                                className="pointer-events-auto max-h-full w-auto max-w-full object-contain"
                            />
                        )}
                    </div>

                    {hasSiblings && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous photograph"
                                onClick={onPrevious}
                                data-test="previous-photo"
                                className="absolute top-1/2 left-2 -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white md:left-5"
                            >
                                <ChevronLeft className="size-7" />
                            </button>

                            <button
                                type="button"
                                aria-label="Next photograph"
                                onClick={onNext}
                                data-test="next-photo"
                                className="absolute top-1/2 right-2 -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white md:right-5"
                            >
                                <ChevronRight className="size-7" />
                            </button>
                        </>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
