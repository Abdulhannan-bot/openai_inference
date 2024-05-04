$(document).ready(function(){
  $('.datatable-select-inputs').DataTable({
      dom: 'Bfrtip',
      columnDefs: [
            {
                targets: 1,
                className: 'noVis'
            }
      ],
      order: [
        [0, 'desc']
      ],
      buttons: [
            {
                extend: 'colvis',
                text: 'Visible Columns',
                columns: ':not(.noVis)',
                className: 'btn btn-success btn-sm',
                init: function(api, node, config) {
                   $(node).removeClass('dt-button')
                }
            }
      ],
      initComplete: function() {
          this.api().columns([1, 2,]).every(function() {
              console.log(this)
              var column = this;
              var select = $('<select class="form-control custom-select"><option value="">All</option></select>')
                  .appendTo($(column.footer()).empty())
                  .on('change', function() {
                      var val = $.fn.dataTable.util.escapeRegex(
                          $(this).val()
                      );

                      column
                          .search(val ? '^' + val + '$' : '', true, false)
                          .draw();
                  });

              column.data().unique().sort().each(function(d, j) {
                  select.append('<option value="' + d + '">' + d + '</option>');
              });
          });
      }
  });

  // Modal form handling
  $('#new-appraisal-form').on('submit', function(event){
    event.preventDefault();
    console.log('form-submitted');
    create_appraisal($(this));
    $(this)[0].reset();
    if($('.mydatepicker, #datepicker, .input-group.date').val()==''){
        $('.mydatepicker, #datepicker, .input-group.date').datepicker('setDate', 'now');
    }
  });

  // function create_appraisal(form){
  //   console.log('create_appraisal is working')
  //   $('#myModal').modal('hide');
  //   $.ajax({
  //     url:'/appraisals/create_appraisal/',
  //     type:'POST',
  //     data:form.serialize(),
  //     dataType:'json',
  //     success: function(data){
  //       if(data.success == true){
  //           setTimeout(function(){
  //                location.reload();
  //           }, 2000);
  //        }
  //     },
  //     error: function(data){
  //     }
  //   })
  // }
})
