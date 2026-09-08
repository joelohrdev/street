import { Head, useHttp } from '@inertiajs/react';
import { useState } from 'react';
import { store as recordLightboxOpen } from '@/actions/App/Http/Controllers/LightboxOpenController';
import PhotoLightbox from '@/components/photo-lightbox';
import SiteHeader from '@/components/site-header';
import type { GalleryPhoto } from '@/types';

type GalleryProps = {
    photos: GalleryPhoto[];
};

export default function Gallery({ photos }: GalleryProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { post } = useHttp({});

    const openPhotoAt = (index: number) => {
        const photo = photos[index];

        if (!photo) {
            return;
        }

        setOpenIndex(index);

        void post(recordLightboxOpen.url(photo.id)).catch(() => {
            // Counting an open is best effort and must never interrupt browsing.
        });
    };

    const step = (offset: number) => {
        if (openIndex === null) {
            return;
        }

        openPhotoAt((openIndex + offset + photos.length) % photos.length);
    };

    return (
        <>
            <Head title="Street photography" />

            <div className="bg-paper text-ink flex min-h-screen flex-col">
                <SiteHeader />

                <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8 md:px-10 md:py-12">
                    <h1 className="sr-only">Street photography</h1>

                    {photos.length === 0 ? (
                        <p className="text-ink/50 py-24 text-center text-sm tracking-[0.2em] uppercase">
                            No photographs yet
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                            {photos.map((photo, index) => (
                                <li key={photo.id}>
                                    <button
                                        type="button"
                                        onClick={() => openPhotoAt(index)}
                                        aria-label={`Open photograph ${index + 1} of ${photos.length}`}
                                        data-test={`open-photo-${photo.id}`}
                                        className="group focus-visible:ring-ink relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-black/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
                                    >
                                        <img
                                            src={photo.url}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>

            <PhotoLightbox
                photo={openIndex === null ? null : (photos[openIndex] ?? null)}
                position={openIndex === null ? 0 : openIndex + 1}
                total={photos.length}
                onClose={() => setOpenIndex(null)}
                onPrevious={() => step(-1)}
                onNext={() => step(1)}
            />
        </>
    );
}
