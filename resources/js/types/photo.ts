export type GalleryPhoto = {
    id: number;
    url: string;
    width: number | null;
    height: number | null;
};

export type ManagedPhoto = {
    id: number;
    url: string;
    original_name: string;
    lightbox_opens: number;
    uploaded_at: string | null;
};

export type PhotoStats = {
    photos: number;
    lightbox_opens: number;
};
