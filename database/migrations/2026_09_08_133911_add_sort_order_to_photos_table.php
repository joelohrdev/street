<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('lightbox_opens')->index();
        });

        $this->seedExistingOrder();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->dropIndex(['sort_order']);
            $table->dropColumn('sort_order');
        });
    }

    /**
     * Keep the newest-first order the gallery had before the column existed.
     */
    private function seedExistingOrder(): void
    {
        $ids = DB::table('photos')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->pluck('id');

        foreach ($ids as $position => $id) {
            DB::table('photos')->where('id', $id)->update(['sort_order' => $position]);
        }
    }
};
