<table class="table table-bordered">  
  @foreach ($response as $key => $item)
  <tr>
    <td>{{$key}}</td>
    <td>{{$item ?? ''}}</td>
  </tr>
  @endforeach
</table>