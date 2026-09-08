<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Photo Disk
    |--------------------------------------------------------------------------
    |
    | The filesystem disk that uploaded photographs are written to and served
    | from. Local development uses the "public" disk, which is a symlinked
    | directory. Hosted environments must use a bucket such as "s3", because
    | a container's own filesystem is discarded on every deploy.
    |
    */

    'disk' => env('PHOTO_DISK', 'public'),

];
