import { Form } from '@inertiajs/react';
import { ImageUp, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PhotoController from '@/actions/App/Http/Controllers/PhotoController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = 20;
const MAX_BYTES = 12 * 1024 * 1024;

type QueuedPhoto = {
    key: string;
    file: File;
    previewUrl: string;
};

function queueKey(file: File): string {
    return `${file.name}:${file.size}:${file.lastModified}`;
}

function formatSize(bytes: number): string {
    return bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function PhotoUploader() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [queue, setQueue] = useState<QueuedPhoto[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    // The hidden input is what the form actually submits, so mirror the queue into it.
    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        const transfer = new DataTransfer();
        queue.forEach(({ file }) => transfer.items.add(file));
        inputRef.current.files = transfer.files;
    }, [queue]);

    const addFiles = (files: FileList | null) => {
        const incoming = Array.from(files ?? []);

        if (incoming.length === 0) {
            return;
        }

        const queued = new Set(queue.map((photo) => photo.key));
        const images = incoming.filter((file) =>
            ACCEPTED_TYPES.includes(file.type),
        );
        const fresh = images.filter((file) => !queued.has(queueKey(file)));
        const kept = fresh.slice(0, Math.max(0, MAX_FILES - queue.length));

        setQueue([
            ...queue,
            ...kept.map((file) => ({
                key: queueKey(file),
                file,
                previewUrl: URL.createObjectURL(file),
            })),
        ]);

        const skipped = incoming.length - images.length;

        setNotice(
            [
                skipped > 0
                    ? `${skipped} file${skipped === 1 ? '' : 's'} skipped, only JPG, PNG and WebP are accepted.`
                    : null,
                kept.length < fresh.length
                    ? `Only ${MAX_FILES} photos can be uploaded at once.`
                    : null,
            ]
                .filter(Boolean)
                .join(' ') || null,
        );
    };

    const removeAt = (key: string) => {
        const removed = queue.find((photo) => photo.key === key);

        if (removed) {
            URL.revokeObjectURL(removed.previewUrl);
        }

        setQueue(queue.filter((photo) => photo.key !== key));
    };

    const clearQueue = () => {
        queue.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
        setQueue([]);
        setNotice(null);
    };

    return (
        <Form
            {...PhotoController.store.form()}
            options={{ preserveScroll: true }}
            onSuccess={clearQueue}
            className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-4 rounded-xl border p-4"
        >
            {({ processing, progress, errors }) => (
                <>
                    <div
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDraggingOver(true);
                        }}
                        onDragLeave={(event) => {
                            if (
                                !event.currentTarget.contains(
                                    event.relatedTarget as Node | null,
                                )
                            ) {
                                setIsDraggingOver(false);
                            }
                        }}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDraggingOver(false);
                            addFiles(event.dataTransfer.files);
                        }}
                        data-test="photo-dropzone"
                        className={cn(
                            'flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-colors',
                            isDraggingOver
                                ? 'border-primary bg-primary/5'
                                : 'border-sidebar-border/70 dark:border-sidebar-border',
                        )}
                    >
                        <Upload
                            className={cn(
                                'size-7',
                                isDraggingOver
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            )}
                        />

                        <div className="space-y-1">
                            <p className="font-medium">
                                Drag photographs here to upload
                            </p>
                            <p className="text-muted-foreground text-xs">
                                JPG, PNG or WebP. Up to {MAX_FILES} files, 12 MB
                                each.
                            </p>
                        </div>

                        <input
                            ref={inputRef}
                            id="photos"
                            name="photos[]"
                            type="file"
                            multiple
                            accept={ACCEPTED_TYPES.join(',')}
                            data-test="photos-input"
                            className="peer sr-only"
                            onChange={(event) => addFiles(event.target.files)}
                        />

                        <label
                            htmlFor="photos"
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 peer-focus-visible:ring-ring/50 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-medium shadow-xs transition-colors peer-focus-visible:ring-[3px]"
                        >
                            <ImageUp className="size-4" />
                            Choose files
                        </label>
                    </div>

                    {notice && (
                        <p className="text-muted-foreground text-sm">
                            {notice}
                        </p>
                    )}

                    <InputError message={errors.photos} />

                    {Object.entries(errors)
                        .filter(([field]) => field.startsWith('photos.'))
                        .map(([field, message]) => (
                            <InputError key={field} message={message} />
                        ))}

                    {queue.length > 0 && (
                        <>
                            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {queue.map(({ key, file, previewUrl }) => (
                                    <li key={key} className="group relative">
                                        <img
                                            src={previewUrl}
                                            alt=""
                                            className="aspect-square w-full rounded-md object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeAt(key)}
                                            aria-label={`Remove ${file.name}`}
                                            data-test="remove-queued-photo"
                                            className="bg-background/90 text-muted-foreground hover:text-destructive absolute top-1 right-1 rounded-full p-1 shadow-xs"
                                        >
                                            <X className="size-3.5" />
                                        </button>

                                        <p
                                            className={cn(
                                                'mt-1 truncate text-xs',
                                                file.size > MAX_BYTES
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground',
                                            )}
                                            title={file.name}
                                        >
                                            {formatSize(file.size)}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center justify-between gap-3">
                                <p className="text-muted-foreground text-sm">
                                    {queue.length} photo
                                    {queue.length === 1 ? '' : 's'} ready
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={clearQueue}
                                        disabled={processing}
                                    >
                                        Clear
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="upload-photos"
                                    >
                                        <ImageUp />
                                        {progress
                                            ? `Uploading ${progress.percentage}%`
                                            : `Upload ${queue.length}`}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </Form>
    );
}
