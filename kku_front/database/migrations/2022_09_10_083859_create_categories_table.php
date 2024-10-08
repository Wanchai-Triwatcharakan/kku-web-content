<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('cate_name')->nullable();
            $table->string('cate_title')->nullable();
            $table->string('cate_keyword')->nullable();
            $table->string('cate_description')->nullable();
            $table->string('cate_thumbnail_link')->nullable();
            $table->string('cate_thumbnail_title')->nullable();
            $table->string('cate_thumbnail_alt')->nullable();
            $table->string('cate_url')->nullable();
            $table->string('cate_topic')->nullable();
            $table->string('cate_h1')->nullable();
            $table->string('cate_h2')->nullable();
            $table->string('cate_freetag')->nullable();
            $table->string('cate_attr')->nullable();
            $table->string('cate_redirect')->nullable();
            $table->integer('cate_parent_id')->default(0);
            $table->integer('cate_root_id')->default(0);
            $table->integer('cate_level')->default(0);
            $table->boolean('cate_status_display')->default(true);
            $table->boolean('is_menu')->default(false);
            $table->boolean('is_topside')->default(false);
            $table->boolean('is_leftside')->default(false);
            $table->boolean('is_rightside')->default(false);
            $table->boolean('is_bottomside')->default(false);
            $table->integer('cate_priority')->default(1);
            $table->integer('cate_position')->default(1);
            $table->boolean('on_product')->default(false); //('ถ้าเป็น false จะใช้สำหรับ content category');
            $table->boolean('is_main_page')->default(true);
            $table->dateTime('cate_date_display')->nullable();
            $table->dateTime('cate_date_hidden')->nullable();
            $table->string('language');
            $table->boolean('defaults')->default(false);
            $table->timestamps();
            $table->unique(['language','cate_url']);
        });
        DB::statement('ALTER TABLE `categories` DROP PRIMARY KEY, ADD PRIMARY KEY (`id`, `language`) USING BTREE');


        #flook mockup
        DB::table('categories')->insert([
            [
                'id' => 1,
                'cate_url' => '/',
                'cate_title' => 'หน้าแรก',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 1,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 2,
                'cate_url' => '',
                'cate_title' => 'ข้อมูลสัมมนา',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 2,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 3,
                'cate_url' => 'register',
                'cate_title' => 'ลงทะเบียน',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 3,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 4,
                'cate_url' => 'schedule',
                'cate_title' => 'กำหนดการ',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 4,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 5,
                'cate_url' => 'post',
                'cate_title' => 'ข่าวสาร',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 5,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 6,
                'cate_url' => 'activity',
                'cate_title' => 'ภาพกิจกรรม',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 6,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 7,
                'cate_url' => 'accommodation',
                'cate_title' => 'ที่พักและเส้นทาง',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 7,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 8,
                'cate_url' => 'contact',
                'cate_title' => 'ติดต่อเรา',
                'cate_description' => '',
                'cate_parent_id' => 0,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 8,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 9,
                'cate_url' => 'seminar/origin',
                'cate_title' => 'ที่มา',
                'cate_description' => '',
                'cate_parent_id' => 2,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 9,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
            [
                'id' => 10,
                'cate_url' => 'seminar/lecturer',
                'cate_title' => 'วิทยากร',
                'cate_description' => 'Lorem ipsum dolor sit amet consectetur. Blandit sed tincidunt sit purus lacus consectetur nulla montes.',
                'cate_parent_id' => 2,
                'is_menu' => true,
                'is_topside' => true,
                'is_bottomside' => true,
                'cate_priority' => 10,
                'cate_position' => 1,
                'language' => 'th',
                'defaults' => true
            ],
           
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
