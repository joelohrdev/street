import { router } from '@inertiajs/react';
import { GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { update as updatePhotoOrder } from '@/actions/App/Http/Controllers/PhotoOrderController';
import DeletePhoto from '@/components/delete-photo';
import { cn } from '@/lib/utils';
import type { ManagedPhoto } from '@/types';

type DropTarget = {
    id: number;
    below: boolean;
};

export default function PhotoOrderTable({
    photos,
}: {
    photos: ManagedPhoto[];
}) {
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
    const handles = useRef(new Map<number, HTMLButtonElement | null>());

    const clearDragState = () => {
        setDraggingId(null);
        setDropTarget(null);
    };

    const move = (from: number, to: number) => {
        if (from === to || to < 0 || to >= photos.length) {
            return;
        }

        const ordered = [...photos];
        const [moved] = ordered.splice(from, 1);
        ordered.splice(to, 0, moved);

        router
            .optimistic<{ photos: ManagedPhoto[] }>(() => ({
                photos: ordered,
            }))
            .put(
                updatePhotoOrder.url(),
                { ids: ordered.map((photo) => photo.id) },
                { preserveScroll: true, preserveState: true },
            );

        requestAnimationFrame(() => handles.current.get(moved.id)?.focus());
    };

    const dropOn = (targetIndex: number) => {
        const from = photos.findIndex((photo) => photo.id === draggingId);

        if (from === -1) {
            return;
        }

        const to = targetIndex + (dropTarget?.below ? 1 : 0);

        move(from, from < to ? to - 1 : to);
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
                Drag a row to reorder the gallery. Visitors see photographs in
                this order, top row first.
            </p>

            <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                    <thead className="text-muted-foreground border-sidebar-border/70 dark:border-sidebar-border border-b text-left">
                        <tr>
                            <th className="w-10 px-2 py-3">
                                <span className="sr-only">Reorder</span>
                            </th>
                            <th className="w-20 px-4 py-3 font-medium">
                                <span className="sr-only">Preview</span>
                            </th>
                            <th className="px-4 py-3 font-medium">File</th>
                            <th className="px-4 py-3 font-medium">Uploaded</th>
                            <th className="px-4 py-3 text-right font-medium">
                                Lightbox opens
                            </th>
                            <th className="w-16 px-4 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {photos.map((photo, index) => (
                            <tr
                                key={photo.id}
                                draggable
                                onDragStart={(event) => {
                                    event.dataTransfer.effectAllowed = 'move';
                                    // Firefox will not start a drag without payload.
                                    event.dataTransfer.setData(
                                        'text/plain',
                                        String(photo.id),
                                    );
                                    setDraggingId(photo.id);
                                }}
                                onDragOver={(event) => {
                                    if (draggingId === null) {
                                        return;
                                    }

                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = 'move';

                                    const box =
                                        event.currentTarget.getBoundingClientRect();

                                    setDropTarget({
                                        id: photo.id,
                                        below:
                                            event.clientY >
                                            box.top + box.height / 2,
                                    });
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    dropOn(index);
                                    clearDragState();
                                }}
                                onDragEnd={clearDragState}
                                data-test={`photo-row-${photo.id}`}
                                className={cn(
                                    'border-sidebar-border/70 dark:border-sidebar-border border-b last:border-0',
                                    draggingId === photo.id && 'opacity-40',
                                    dropTarget?.id === photo.id &&
                                        draggingId !== photo.id &&
                                        (dropTarget.below
                                            ? 'border-b-primary border-b-2'
                                            : 'border-t-primary border-t-2'),
                                )}
                            >
                                <td className="px-2 py-3">
                                    <button
                                        type="button"
                                        ref={(element) => {
                                            handles.current.set(
                                                photo.id,
                                                element,
                                            );
                                        }}
                                        aria-label={`Reorder ${photo.original_name}, currently position ${index + 1} of ${photos.length}. Use the arrow keys to move it.`}
                                        data-test={`reorder-handle-${photo.id}`}
                                        onKeyDown={(event) => {
                                            if (event.key === 'ArrowUp') {
                                                event.preventDefault();
                                                move(index, index - 1);
                                            }

                                            if (event.key === 'ArrowDown') {
                                                event.preventDefault();
                                                move(index, index + 1);
                                            }
                                        }}
                                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 cursor-grab rounded-md p-1 focus-visible:ring-[3px] focus-visible:outline-hidden active:cursor-grabbing"
                                    >
                                        <GripVertical className="size-4" />
                                    </button>
                                </td>

                                <td className="px-4 py-3">
                                    <img
                                        src={photo.url}
                                        alt=""
                                        loading="lazy"
                                        draggable={false}
                                        className="size-12 rounded-md object-cover"
                                    />
                                </td>

                                <td className="px-4 py-3 font-medium break-all">
                                    {photo.original_name}
                                </td>

                                <td className="text-muted-foreground px-4 py-3 whitespace-nowrap">
                                    {photo.uploaded_at}
                                </td>

                                <td className="px-4 py-3 text-right font-medium tabular-nums">
                                    {photo.lightbox_opens.toLocaleString()}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <DeletePhoto photo={photo} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
