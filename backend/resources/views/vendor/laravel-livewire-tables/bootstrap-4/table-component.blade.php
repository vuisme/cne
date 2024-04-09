<div class="{{ $this->getOption('bootstrap.container') ? 'container-fluid' : '' }}" @if (is_numeric($refresh))
  wire:poll.{{ $refresh }}.ms @elseif(is_string($refresh)) wire:poll="{{ $refresh }}" @endif>
  @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.offline')
  @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.options')

  @if ($this->getOption('bootstrap.responsive'))
  @php
  $res_classes = $this->getOption('bootstrap.classes.responsive');
  @endphp
  <div class="{{$res_classes ? $res_classes : 'table-responsive'}}">
    @endif
    <table class="{{ $this->getOption('bootstrap.classes.table') }}">
      @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.thead')

      @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.loading')
      @if($models->isEmpty())
      @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.empty')
      @else
      @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.data')
      @endif
      </tbody>

      @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.tfoot')
    </table>
    @if ($this->getOption('bootstrap.responsive'))
  </div>
  <!--table-responsive-->
  @endif

  @include('laravel-livewire-tables::'.config('laravel-livewire-tables.theme').'.includes.pagination')
</div>

@if($this->getOption('bootstrap.freeze.enable'))

<span class="d-none" id="freezeColumnEnd">{{$this->getOption('bootstrap.freeze.table.columns')}}</span>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script>
    var columns = $("#freezeColumnEnd").text();
    function freezingExecute(){
      setTimeout(() => {
        $(".table-scrollable").freezeTable({
          namespace: 'wallet-table',
          scrollable: true,
          columnNum: parseInt(columns)
        });
      }, 200);
    }

    freezingExecute();


  document.addEventListener("livewire:load", function(event) {
      window.livewire.hook('beforeDomUpdate', () => {          
      var freezTable = $('.table-scrollable')
      // tbody.find('table tbody tr').remove();
      freezTable.find('.clone-head-table-wrap').remove();
      freezTable.find('.clone-column-table-wrap').remove();
      });

      window.livewire.hook('afterDomUpdate', () => {
        freezingExecute();
      });
  });
</script>
@endif