<?php

namespace App\Http\Controllers\frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\SeminarRoom;
use App\Models\ScheduleTime;

class ScheduleController extends Controller
{
    //
    public function indexPageSchedule() {
        $seo = Post::where('id', 19)->first();
        // dd($seo);

        $schedule = Post::where('category', ',4,')
            ->where('status_display', true)
            ->get();
        return view('frontend.pages.schedule.schedule', compact('schedule', 'seo'));
    }
    public function dataDetail($id) {
        $seo = Post::where('id', 19)->first();
        $post = Post::where('id', $id)
            ->with(['scheduleTimes' => function ($query) {
                $query->orderBy('time_start', 'asc'); // หรือ 'desc' สำหรับเรียงจากมากไปน้อย
            }])
            ->first();
        $tagsArray = json_decode($post->tags, true);
        if (is_array($tagsArray)) {
            $rooms = SeminarRoom::where('status_display', true)
                ->whereIn('id', $tagsArray)
                ->with(['scheduleTimes' => function ($query) {
                    $query->orderBy('time_start', 'asc'); // หรือ 'desc' สำหรับเรียงจากมากไปน้อย
                }])
                ->get();
        } else {
            $rooms = [];
        }
        // $rooms = SeminarRoom::where('status_display', true)->with('scheduleTimes')->get();
        return view('frontend.pages.schedule.scheduleDetail', compact('post', 'rooms', 'seo'));
    }
}
