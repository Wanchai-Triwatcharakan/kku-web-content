<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class SeminarController extends Controller
{
    public function indexPageSeminar() {
        $post = Post::where('id', 6)
            ->with(['images' => function($query) {
                $query->orderBy('position', 'asc');
            }])
            ->first();
        $postManage = Post::where('id', 9)
            ->with(['images' => function($query) {
                $query->orderBy('position', 'asc');
            }])
            ->first();
        $postsupport = Post::where('id', 5)
            ->where('status_display', true)
            ->with(['images' => function($query) {
                $query->orderBy('position', 'asc'); // สั่งเรียงตามฟิลด์ position ตามลำดับจากน้อยไปมาก
            }])
            ->first();
        return view('frontend.pages.seminar.seminar', compact('post', 'postManage', 'postsupport'));
    }
    public function indexPage() {
        $allLecturer = Post::where('category', ',10,')
            ->where('status_display', true)
            ->OrderBy('priority')
            ->paginate(10);
        // return view('frontend.pages.seminar.seminar');
        return view('frontend.pages.seminar.lecturer', compact('allLecturer'));
    }
}
