import { Link, usePage } from '@inertiajs/react';
import { Instagram } from 'lucide-react';
import { home } from '@/routes';

export default function SiteHeader() {
    const { site } = usePage().props;

    return (
        <header>
            {/* Keep this container in step with the <main> in pages/gallery.tsx
                so the rule below lines up with the edges of the photo grid. */}
            <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
                <div className="border-rule relative flex items-center justify-center border-b py-7">
                    <Link
                        href={home()}
                        className="text-ink font-wordmark text-[0.92rem] leading-none font-extrabold tracking-tight uppercase"
                    >
                        JL<span className="text-accent-red">/</span>Street
                    </Link>

                    {site.instagram_url && (
                        <a
                            href={site.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            data-test="instagram-link"
                            className="text-ink/50 hover:text-accent-red absolute top-1/2 right-0 -translate-y-1/2 transition-colors"
                        >
                            <Instagram className="size-5" />
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}
