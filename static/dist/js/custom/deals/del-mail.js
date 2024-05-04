$('#thread-del').click(() => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
    if(result.value){
        let threadId = $('#thread-del').data('thread-id');
        $.ajax({
        url:'/deals/thread/del/'+threadId+'/',
        type:'GET',
        dataType: 'json',
        success: (data) => {
            if (data.success) {
            Swal.fire(
                'Deleted!',
                'Your mail has been removed!',
                'success'
            )
            $('#mail-wrapper').empty();
            $('#'+data.thread_id).remove();
            $('.mail-details').fadeOut('fast');
            $('.mail-list').fadeIn('fast');
            }
        },
        error: (data) => {
            if (data.error) {
                Swal.fire(
                    'Error!',
                    'An error occurred! Try again.',
                    'error'
                )
            }
        }
        })
    }
    })
});

$('#del-threads').click(() => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if(result.value){
            $('tr.selected').each((index, obj) => {
                let threadId = $(obj).attr('id');
                console.log(threadId);
                $.ajax({
                    url:'/deals/thread/del/'+threadId+'/',
                    type:'GET',
                    dataType: 'json',
                    success: (data) => {
                        if (data.success) {
                            $('#'+data.thread_id).remove();
                            toastr.success('Deleted!', { positionClass: 'toastr toast-bottom-left', containerId: 'toast-bottom-left' });
                        }
                    },
                    error: (data) => {
                        if (data.error) {
                            toastr.error('An error occured! Please try again!', { positionClass: 'toastr toast-bottom-left', containerId: 'toast-bottom-left' });
                        }
                    }
                })
            })
        }
    })
});