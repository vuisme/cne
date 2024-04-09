<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Models\Backend\BlockWords;
use App\Models\Content\Post;
use Carbon\Carbon;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

class BlockWordController extends Controller
{

  /**
   * Show the form for creating a new resource.
   *
   * @return Factory|View
   */
  public function create()
  {
    return view('backend.content.settings.block.index');
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return \Illuminate\Http\Response
   * @throws \Throwable
   */
  public function store(Request $request)
  {
    $data = request()->validate([
      'word' => 'required|string|max:255',
      'sentence' => 'nullable|string|max:1800',
    ]);
    $data['user_id'] = auth()->id();
    $data['word'] = Str::lower($data['word']);
    $data['sentence'] = Str::lower($data['sentence']);
    BlockWords::create($data);
    return redirect()->back()->withFlashSuccess('Word stored Successfully');
  }


  public function destroy($id)
  {
    $words = BlockWords::find($id);
    if ($words->delete()) {
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Block words moved to trashed successfully',
      ]);
    }

    return \response([
      'status' => false,
      'icon' => 'error',
      'msg' => 'Delete failed',
    ]);
  }
}
