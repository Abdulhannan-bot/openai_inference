// get Month
const getMonthShort = (date) => {
    switch(date.getMonth()){
      case 0:
        return 'Jan';
        break;
      case 1:
        return 'Feb';
        break;
      case 2:
        return 'Mar';
        break;
      case 3:
        return 'Apr';
        break;
      case 4:
        return 'May';
        break;
      case 5:
        return 'Jun';
        break;
      case 6:
        return 'Jul';
        break;
      case 7:
        return 'Aug';
        break;
      case 8:
        return 'Sep';
        break;
      case 9:
        return 'Oct';
        break;
      case 10:
        return 'Nov';
        break;
      case 11:
        return 'Dec';
        break;
    }
}

// Returns date like in gmail
const getMailDate = (date) => {
    today = new Date();
    if (date.toLocaleDateString()==today.toLocaleDateString()) {
        return (date.toLocaleTimeString('en-US').slice(0, 4)+ ' ' +date.toLocaleTimeString('en-US').slice(8));
    }
    else if(today.getUTCFullYear()==date.getUTCFullYear()){
        return getMonthShort(date)+' '+date.getDate();
    }
    else{
        return date.toLocaleDateString();
    }
}

const fetchNdisplayThreads = (label, container) => {
    console.log('start')
    let con = $('#mail-'+container);
    if(!con.html()){
        $.ajax({
            url:"/deals/threads/"+label+"/",
            dataType: 'json',
            beforeSend: () => {
              $('#mail-loader').removeClass('d-none').addClass('d-flex');
            },
            success: (data) => {
                console.log('working success')
                if (data.success) {
                    console.log(data.messages)
                    data.messages.forEach((msg, index) => {
                        let headers = msg.headers
                        console.log(headers)
                        let to = ''
                        let from = ''
                        let subject = ''
                        headers.forEach((header, i) => {
                            switch(header.name){
                                case 'To':
                                case 'to':
                                    to = header.value
                                    break
                                case 'From':
                                case 'from':
                                    from = header.value
                                    break
                                case 'Subject':
                                case 'subject':
                                    subject = header.value
                                    break
                            }
                        })
                        subject = subject?subject:'(no subject)';
                        let date = getMailDate(new Date(parseInt(msg.date)));
                        let randInt = Math.floor(Math.random() * 10000000000);
                        $(con).append(
                            `<tr class="unread" id=`+msg.id+`>
                                <td class="chb pl-3">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="cst`+(index+randInt)+`">
                                        <label class="custom-control-label" for="cst`+(index+randInt)+`">&nbsp;</label>
                                    </div>
                                </td>
                                <td class="user-name">
                                    <span class="text-muted">`+from.split('@')[0]+`</span>
                                </td>
                                <td class="max-texts"> 
                                    <a class="link" href="javascript: void(0)" onclick="fetchThread('`+ msg.id +`')">
                                    <span class="text-dark font-normal"><strong>`+ subject + `</strong> - ` + msg.snippet +`</span>
                                    </a>
                                </td>
                                <td class="time text-muted">`+date+`</td>
                            </tr>`
                        )
                    })
                }
            },
            complete: () => {
              $.getScript('/static/dist/js/pages/email/email.js');
              $.getScript('/static/dist/js/custom/deals/del-mail.js');
              $('#mail-loader').removeClass('d-flex').addClass('d-none');
            },
            error: (data) => {
                console.log('working-error')
                if (data.error) {
                    console.log('error')
                }
            }
        })
    }
    console.log('end')
}

// fetches detailed thread
const fetchThread = (threadId) => {
  console.log('start')
  $('#thread-del').data('thread-id', threadId);
  $('#mail-wrapper').empty();
  $.ajax({
      url:"/deals/thread/"+threadId+"/",
      dataType: 'json',
      beforeSend: () => {
        $('#mail-wrapper-loader').removeClass('d-none').addClass('d-flex');
      },
      success: (data) => {
          console.log('working success')
          if (data.success) {
              console.log(data.thread);
              data.thread.messages.forEach((msg, index) => {
                  let body = msg.body;
                  console.log(body);
                  let to = msg.to;
                  let from = msg.from;
                  let subject = msg.subject?msg.subject:'(no subject)';
                  let date = getMailDate(new Date(parseInt(msg.date)));
                  console.log(date)

                  // prepare thread message
                  let msg_str = index==0?`
                    <div class="card-body border-bottom">
                        <h4 class="mb-0" id="mail-subject">`+subject+`</h4>
                    </div>
                  `:'';
                  msg_str += `
                      <div class="card-body border-bottom">
                          <div class="d-flex no-block align-items-center mb-5">
                                <div class="mr-2"><img src="/static/assets/images/users/0.png" alt="user" class="rounded-circle" width="45" height="45" style="object-fit: cover;
                                object-position: top;"></div>
                              <div class="">
                                  <h5 class="mb-0 font-16 font-medium" id="mail-from">`+from+`</h5><span id="mail-to">`+to+`</span>
                              </div>
                          </div>
                          <div id="mail-body">`+body+`</div>
                      </div>
                  `;
                  $('#mail-wrapper').append(msg_str)
              });
              $('#mail-wrapper').append(`
                  <div class="border p-3" id="reply-box">
                      <p class="pb-3">Click here to <a href="javascript:void(0)" onclick="prepareToSendReply()">Reply</a></p>
                  </div>
                  <form id="reply-form" style="display:none;">
                    <input type="hidden" name="reply-subject" value="`+data.thread.messages[0].subject+`">
                    <input type="hidden" name="reply-to" value="" id="reply-to-input">
                    <textarea class="form-control border-bottom-0" rows="1" style="margin-bottom: 0px; resize: none; border: 1px solid #a9a9a9; "placeholder="To" id="reply-to">`+data.thread.messages[0].to+`</textarea>
                    <div class="form-group" style="display: none;">
                        <textarea name="reply-body" id="reply-body" cols="30" rows="10"></textarea>
                    </div>
                    <div id="reply-note"></div>
                    <div class="mb-3" style="margin-top:-30px;"><button class="btn btn-info btn-sm mt-1 mr-3 ml-2 text-white" onclick="sendReply(event, '`+threadId+`', '`+data.thread.messages[0].msg_id+`')"><i class="fa fa-reply" aria-hidden="true"></i> Reply</button><a href="javascript:void(0)"class="text-danger float-right" onclick="discardReply(event)"><i class="fa fa-trash font-18 mt-1 mr-3"></i></a></div>
                  </form>
              `);
          }
      },
      complete: () => {
        $('#mail-wrapper-loader').removeClass('d-flex').addClass('d-none');
      },
      error: (data) => {
          console.log('working-error')
          if (data.error) {
              console.log('error')
          }
      }
  })
  console.log('end')
}

// discard compose
$('#discard-compose').click((e) => {
  console.log('working')
  e.preventDefault();
  $('.mail-compose').fadeOut('fast');
  $('.mail-list').fadeIn('fast');
})

// sends mail
const sendMail = (e) => {
    e.preventDefault();
    $('#example-body').text($('.note-editable').html());
    console.log($('#example-body').text());
    $.ajax({
        url: '/deals/send/mail/',
        type: 'GET',
        dataType: 'json',
        data: $('#email-form').serialize(),
        success: (data) => {
            if(data.success){
                console.log('mail-sent');
                $('.mail-details').fadeIn();
                $('.mail-compose').fadeOut();
            }
        },
        error: () => {

        },
        complete: () => {

        }
    })
}

// switch tab
const switchTab = (to, from) => {
    console.log('switch wroking');
    $('.mail-details').fadeOut('fast');
    $('.mail-compose').fadeOut('fast');
    $('.mail-list').fadeIn('fast');
    $('#mail-box-title').html(to.toUpperCase());
    $('#'+from+'-tab').removeClass('active');
    $('#'+to+'-tab').addClass('active');
    $('#mail-'+from).fadeOut();
    $('#mail-'+to).fadeIn();

    fetchNdisplayThreads(to, to);
}

// send reply to a mail
const prepareToSendReply = () => {
    console.log('sending reply');
    $('#reply-form').fadeIn('fast');
    $('#reply-box').fadeOut('fast');

    $('#reply-note').summernote({
        placeholder: 'Type your email Here',
        tabsize: 2,
        height: 200
    });

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
}

// discard reply
const discardReply = (e) => {
  e.preventDefault();
  $('#reply-form').fadeOut('fast');
  $('#reply-box').fadeIn('fast');
}

// send mail
const sendReply = (e, threadId, messageId) => {
  e.preventDefault();
  $('#reply-form').fadeIn('fast');
  $('#reply-box').fadeOut('fast');
  $('#reply-body').text($('#reply-form .note-editable').html());
  $('#reply-to-input').val($('#reply-to').html());
  console.log($('#reply-to-input').val());
  $.ajax({
    url: '/deals/reply/'+threadId+'/'+messageId+'/',
    type: 'GET',
    dataType: 'json',
    data: $('#reply-form').serialize(),
    success: (data) => {
      console.log('reply sent!');
      if(data.success){
        $(`
          <div class="card-body border-bottom">
              <div class="d-flex no-block align-items-center mb-5">
                    <div class="mr-2"><img src="/static/assets/images/users/0.png" alt="user" class="rounded-circle" width="45" height="45" style="object-fit: cover;
                    object-position: top;"></div>
                  <div class="">
                      <h5 class="mb-0 font-16 font-medium" id="mail-from">`+data.message.from+`</h5><span id="mail-to">`+data.message.to+`</span>
                  </div>
              </div>
              <div id="mail-body">`+data.message.body+`</div>
          </div>
        `).insertBefore('#reply-box');

        $('#reply-form').fadeOut('fast');
        $('#reply-box').fadeIn('fast');
        $('#reply-form .note-editable').empty();
      }
    },
    error: () => {

    },
    complete: () => {

    }
  })
}