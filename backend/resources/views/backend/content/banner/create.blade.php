@extends('backend.layouts.app')

@section('title', 'Manage Banner')

@section('content')
{{ html()->form('POST', route('admin.banner.store'))->attribute('enctype',
'multipart/form-data')->open() }}

<div class="row">
  <div class="col-md-9">
    <div class="card">
      <div class="card-header with-border">
        <h3 class="card-title">Banner Management <small class="ml-2">Create Banner</small></h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          {{html()->text('post_title')->class('form-control cash')->placeholder('Banner Title')}}
          <p class="text-danger margin-bottom-none" id="post_error">@error('post_title') {{$message}}
            @enderror</p>
        </div> <!-- form-group -->

        <div class="form-group">
          {{html()->text('post_slug')->class('form-control')->placeholder('URL Key')}}
        </div> <!-- form-group -->

        <div class="form-group">
          {{html()->textarea('post_content')->class('editor form-control')}}
          @error('post_content')
          <p class="text-danger margin-bottom-none">{{$message}}</p>
          @enderror
        </div> <!-- form-group -->
      </div> <!--  .card-body -->
      <div class="card-footer">
        {{ form_submit(__('buttons.general.crud.create')) }}
        {{ form_cancel(route('admin.banner.index'), __('buttons.general.cancel')) }}
      </div> <!--  .card-body -->
    </div> <!--  .card -->
  </div> <!-- .col-md-9 -->

  <div class="col-sm-3">
    <div class="card">
      <div class="card-header with-border">
        <h3 class="card-title">Publishing Tools</h3>
      </div>
      <div class="card-body p-3">
        <div class="form-group">
          @php $status = old('post_status');@endphp
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="post_status" value="publish" id="publish"
              class="checking" checked>
            <label class="form-check-label" for="publish">Publish</label>
          </div>
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="post_status" value="draft" id="draft" class="checking"
              @if($status==='draft' ) checked @endif>
            <label class="form-check-label" for="draft">Draft</label>
          </div>
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="post_status" value="schedule" id="schedule"
              class="checking" @if($status==='schedule' ) checked @endif>
            <label class="form-check-label" for="schedule">Schedule</label>
          </div>
        </div> <!-- form-group -->
        <div class="form-group @if($status !=='schedule' ) d-none @endif" id="scheduleDate">
          <div class="form-group">
            <div class="input-group">
              {{html()->text('schedule_time')->class('form-control')->id('datepicker-autoclose')->placeholder('dd-mm-yyyy')->attribute('autocomplete',
              false)}}
              <div class="input-group-append bg-custom b-0">
                <span class="input-group-text"><i class="fa fa-calendar"></i></span>
              </div>
            </div><!-- input-group -->
          </div>
        </div> <!-- form-group -->
        <div class="row">
          <div class="card-title col">Thumbnail</div>
        </div> <!-- row -->
        <hr class="mt-0">
        <div class="form-group">
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="thumb_status" value="1" id="new" class="checking"
              checked>
            <label class="form-check-label" for="new">Upload Image</label>
          </div>
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="thumb_status" value="0" id="off" class="checking">
            <label class="form-check-label" for="off">Image Off</label>
          </div>
        </div> <!-- form-group -->
        <div class="form-group @if(old('thumb_status')==='off') d-none @endif" id="for_New_upload">
          <label for="image">
            <img src="{{asset('img/backend/no-image.gif')}}" class="img-fluid" id="holder" alt="Image upload">
          </label>
          <input type="file" name="image" class="d-none" id="image">
        </div> <!-- form-group -->
      </div> <!--  card-body -->
    </div> <!-- /.card -->
  </div> <!-- .col-md-3 -->
</div> <!-- .row -->

{{ html()->form()->close() }}
@endsection




@push('after-styles')
{{ style(asset('assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css')) }}
@endpush

@push('after-scripts')
{!! script(asset('assets/plugins/tinymce/jquery.tinymce.min.js')) !!}
{!! script(asset('assets/plugins/tinymce/tinymce.min.js')) !!}
{!! script(asset('assets/plugins/tinymce/editor-helper.js')) !!}
{!! script(asset('assets/plugins/moment/moment.js')) !!}
{!! script(asset('assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js')) !!}

<script>
    function slugify(text) {
      return text
        .toString()                           // Cast to string (optional)
        .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase()                  // Convert the string to lowercase letters
        .trim()                                  // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, '-')            // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    }


       $(document).ready(function () {
            simple_editor('.editor', 450);
            $('#datepicker-autoclose').datepicker({
                format: "dd-mm-yyyy",
                clearBtn: true,
                autoclose: true,
                todayHighlight: true,
            });
            $("#image").change(function () {
                readImageURL(this, $('#holder'));
            });
        });

        // $(document).on('blur', "#post_title", function () {
        //     let postField = $(this);
        //     let post_title = postField.val();
        //     if (post_title) {
        //       var slug = slugify(post_title);
        //         $("#post_error").empty();
        //         postField.removeClass('is-invalid');
        //         $("#post_slug").val(slug);
        //     } else {
        //         $("#post_error").text('Title must not empty');
        //         postField.addClass('is-invalid');
        //     }
        // });

        $(function () {
            $(".form-check-input").click(function () {
                const status = $(this).val();
                if (status === "schedule") {
                    $("#scheduleDate").removeClass("d-none");
                } else if (status === "1") {
                    $("#for_New_upload").removeClass("d-none");
                } else if (status === "0") {
                    $("#for_New_upload").addClass("d-none");
                } else {
                    $("#scheduleDate").addClass("d-none");
                }
            });

        });
</script>

@endpush