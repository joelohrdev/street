import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import PhotoController from '@/actions/App/Http/Controllers/PhotoController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { ManagedPhoto } from '@/types';

export default function DeletePhoto({ photo }: { photo: ManagedPhoto }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${photo.original_name}`}
                    data-test={`delete-photo-${photo.id}`}
                >
                    <Trash2 />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Delete this photograph?</DialogTitle>
                <DialogDescription>
                    {photo.original_name} will be removed from the gallery and
                    its file deleted. Its {photo.lightbox_opens} recorded
                    lightbox {photo.lightbox_opens === 1 ? 'open' : 'opens'} go
                    with it. This cannot be undone.
                </DialogDescription>

                <Form
                    {...PhotoController.destroy.form(photo.id)}
                    options={{ preserveScroll: true }}
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>

                            <Button
                                variant="destructive"
                                disabled={processing}
                                asChild
                            >
                                <button
                                    type="submit"
                                    data-test={`confirm-delete-photo-${photo.id}`}
                                >
                                    Delete photograph
                                </button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
