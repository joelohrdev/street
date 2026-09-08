import { Form, Head, usePage } from '@inertiajs/react';
import SiteController from '@/actions/App/Http/Controllers/Settings/SiteController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SiteSettings() {
    const { site } = usePage().props;

    return (
        <>
            <Head title="Site settings" />

            <h1 className="sr-only">Site settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Site"
                    description="Details shown to visitors on the public gallery"
                />

                <Form
                    {...SiteController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">
                                    Instagram URL
                                </Label>

                                <Input
                                    id="instagram_url"
                                    name="instagram_url"
                                    type="url"
                                    inputMode="url"
                                    className="mt-1 block w-full"
                                    defaultValue={site.instagram_url ?? ''}
                                    placeholder="https://instagram.com/yourhandle"
                                    data-test="instagram-url-input"
                                />

                                <p className="text-muted-foreground text-sm">
                                    Leave this empty to hide the Instagram icon
                                    from the gallery header.
                                </p>

                                <InputError
                                    className="mt-2"
                                    message={errors.instagram_url}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                data-test="save-site-settings"
                            >
                                Save
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
