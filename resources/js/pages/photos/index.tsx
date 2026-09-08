import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import PhotoOrderTable from '@/components/photo-order-table';
import PhotoUploader from '@/components/photo-uploader';
import { index } from '@/routes/photos';
import type { ManagedPhoto, PhotoStats } from '@/types';

type PhotosProps = {
    photos: ManagedPhoto[];
    stats: PhotoStats;
};

export default function Photos({ photos, stats }: PhotosProps) {
    return (
        <>
            <Head title="Photos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Photos"
                    description="Upload photographs and see how often each one is opened in the gallery lightbox"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <StatCard label="Photographs" value={stats.photos} />
                    <StatCard
                        label="Lightbox opens"
                        value={stats.lightbox_opens}
                    />
                </div>

                <PhotoUploader />

                {photos.length === 0 ? (
                    <p className="text-muted-foreground border-sidebar-border/70 dark:border-sidebar-border rounded-xl border border-dashed p-10 text-center text-sm">
                        Nothing uploaded yet. The gallery is empty.
                    </p>
                ) : (
                    <PhotoOrderTable photos={photos} />
                )}
            </div>
        </>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
                {value.toLocaleString()}
            </p>
        </div>
    );
}

Photos.layout = {
    breadcrumbs: [
        {
            title: 'Photos',
            href: index(),
        },
    ],
};
