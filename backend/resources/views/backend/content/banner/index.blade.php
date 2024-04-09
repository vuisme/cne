@extends('backend.layouts.app')

@section('title', ' Manage Banner')

@section('content')
<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="col-sm-5">
        <h4 class="card-title mb-0"> Banner Management </h4>
      </div> <!-- col-->

      <div class="col-sm-7 pull-right">
        @include('backend.content.banner.includes.header-buttons')
      </div> <!-- col-->
    </div> <!-- row-->

    <div class="row mt-4">
      <div class="col">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr class="vertical-middle">
                <th>Title</th>
                <th class="text-center text-nowrap">Picture</th>
                <th class="text-center text-nowrap">Created By</th>
                <th class="text-center  text-nowrap">Date</th>
                <th class="text-center">@lang('labels.general.actions')</th>
              </tr>
            </thead>
            <tbody>
              @foreach($banners as $banner)
              <tr class="vertical-middle">
                <td>{{ ucwords($banner->post_title) }}</td>
                <td style="width: 200px">
                  <img src="{{asset($banner->post_thumb)}}" class="img-fluid">
                </td>
                <td class="text-center">{{ $banner->user->name ?? 'N/A'}}</td>
                <td class="text-center">
                  <p class="m-0">{{$banner->post_status}}</p>
                  {{ date('d-M-Y', strtotime($banner->created_at)) }}
                </td>
                <td class="text-center">
                  @include('backend.content.banner.includes.actions', ['banner' => $banner])
                </td>
              </tr>
              @endforeach
            </tbody>
          </table>
        </div>
      </div> <!-- col-->
    </div> <!-- row-->
    <div class="row">
      <div class="col-7">
        <div class="float-left">
          {!! $banners->total() !!}
          {{ trans_choice('Banner', $banners->total()) }}
        </div>
      </div> <!-- col-->

      <div class="col-5">
        <div class="float-right">
          {!! $banners->render() !!}
        </div>
      </div> <!-- col-->
    </div> <!-- row-->
  </div> <!-- card-body-->
</div> <!-- card-->
@endsection