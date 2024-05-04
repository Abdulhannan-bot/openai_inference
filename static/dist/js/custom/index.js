function populate(){
  $('input[name=targetrevenue]').val($('#target-revenue').val());
  $('input[name=nummonths]').val($('#number-of-months').val());
  // console.log($('form').serialize());
  $.ajax({
    url: '/appraisals/draw_chart/',
    type: 'POST',
    data: $('form').serialize(),
    dataType: 'json',
    success: function(data){
      if(data['success']){
        console.log(data['success']);
        if(data['active_tab']=='appraisals'){
          $('#a_count').html(data['a_count']);
          if(data['appraisals'].hasOwnProperty('avg_price')){
            $('#average_advised_price').html(data['currency'] + ' ' + data['appraisals']['avg_price']);
          }else{
            $('#average_advised_price').html('No data');
          }
          if(data['appraisals'].hasOwnProperty('avg_fee_percent')){
            $('#appraisal_fee_percent').html(data['appraisals']['avg_fee_percent']);
          }else{
            $('#appraisal_fee_percent').html('No data');
          }
          if(data['appraisals'].hasOwnProperty('avg_fee')){
            $('#appraisal_average_fee').html(data['currency'] + ' ' + data['appraisals']['avg_fee']);
          }else{
            $('#appraisal_average_fee').html('No data');
          }
          if(data['appraisals'].hasOwnProperty('total_advised_price')){
            $('#total_advised_price').html(data['currency'] + ' ' + data['appraisals']['total_advised_price']);
          }else{
            $('#total_advised_price').html('No data');
          }
          if(data['appraisals'].hasOwnProperty('percent_self_genned')){
            $('#percent_self_genned').html(data['appraisals']['percent_self_genned'].toFixed(2) + '%');
          }else{
            $('#percent_self_genned').html('No data');
          }

          if(data.hasOwnProperty('pie_chart_source')){
              Highcharts.chart("pie_chart_container", data['pie_chart_source']);
          }
          if(data.hasOwnProperty('bar_chart')){
              Highcharts.chart('bar_chart_container', data['bar_chart']);
          }
          if(data.hasOwnProperty('pie_chart_appraisal_status')){
              Highcharts.chart("status_pie_chart_container", data['pie_chart_appraisal_status']);
          }
          if(data.hasOwnProperty('bar_chart_appraisal_status')){
              Highcharts.chart('status_bar_chart_container', data['bar_chart_appraisal_status']);
          }
        }
        else if(data['active_tab']=='instructions'){
          $('#i_count').html(data['i_count']);
          if(data['instructions'].hasOwnProperty('avg_fee')){
            $('#instructions_average_fee').html(data['currency'] + ' ' + data['instructions']['avg_fee']);
          }else{
            $('#instructions_average_fee').html('No data');
          }
          if(data['instructions'].hasOwnProperty('fee_percent_avg')){
            $('#instructions_average_fee_percent').html(data['instructions']['fee_percent_avg']);
          }else{
            $('#instructions_average_fee_percent').html('No data');
          }
          if(data['instructions'].hasOwnProperty('avg_price')){
            $('#average_marketing_price').html(data['currency'] + ' ' + data['instructions']['avg_price']);
          }else{
            $('#average_marketing_price').html('No data');
          }
          if(data['instructions'].hasOwnProperty('total_marketing_price')){
            $('#total_marketing_price').html(data['currency'] + ' ' + data['instructions']['total_marketing_price']);
          }else{
            $('#total_marketing_price').html('No data');
          }
          if(data['instructions'].hasOwnProperty('percent_other_agents_before')){
            $('#percent_other_agents_before').html(data['instructions']['other_agents_before_count'] + ' [' + data['instructions']['percent_other_agents_before'].toFixed(2) + ' %]');
          }else{
            $('#percent_other_agents_before').html('No data');
          }
          if(data['instructions'].hasOwnProperty('conversion_rate')){
            $('#conversion_rate').html(data['instructions']['conversion_rate'].toFixed(2) + '%');
          }else{
            $('#conversion_rate').html('No data');
          }
          if(data['instructions'].hasOwnProperty('avg_lag_days')){
            $('#avg_lag_days').html(data['instructions']['avg_lag_days']);
          }else{
            $('#avg_lag_days').html('No data');
          }
          if(data['instructions'].hasOwnProperty('signed_for_power_negs')){
            $('#signed_for_power_negs').html(data['instructions']['signed_for_power_negs_count'] + ' [' + data['instructions']['signed_for_power_negs'].toFixed(2) + ' %]');
          }else{
            $('#signed_for_power_negs').html('No data');
          }

          if(data.hasOwnProperty('pie_chart_instruction_status')){
              Highcharts.chart("instruction_status_pie_chart",data['pie_chart_instruction_status']);
          }
          if(data.hasOwnProperty('bar_chart_instruction_status')){
              Highcharts.chart('instruction_status_bar_chart', data['bar_chart_instruction_status']);
          }
        }
        else if(data['active_tab']=='sales_agreed'){
          $('#sa_count').html(data['sa_count']);
          if(data['sales_agreed'].hasOwnProperty('total_fee')){
            $('#total_agreed_fee').html(data['currency'] + ' ' + data['sales_agreed']['total_fee']);
          }else{
            $('#total_agreed_fee').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_agreed_price')){
            $('#average_agreed_price').html(data['currency'] + ' ' + data['sales_agreed']['avg_agreed_price']);
          }else{
            $('#average_agreed_price').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_fee')){
            $('#average_agreed_fee').html(data['currency'] + ' ' + data['sales_agreed']['avg_fee']);
          }else{
            $('#average_agreed_fee').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('total_agreed_price')){
            $('#total_agreed_price').html(data['currency'] + ' ' + data['sales_agreed']['total_agreed_price']);
          }else{
            $('#total_agreed_price').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_views')){
            $('#avg_views').html(data['sales_agreed']['avg_views']);
          }else{
            $('#avg_views').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_offers')){
            $('#avg_offers').html(data['sales_agreed']['avg_offers']);
          }else{
            $('#avg_offers').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_percent_of_mp')){
            $('#avg_percent_of_mp').html(data['sales_agreed']['avg_percent_of_mp']);
          }else{
            $('#avg_percent_of_mp').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_percent_of_omp')){
            $('#avg_percent_of_omp').html(data['sales_agreed']['avg_percent_of_omp']);
          }else{
            $('#avg_percent_of_omp').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_days_on_market')){
            $('#avg_days_on_market').html(data['sales_agreed']['avg_days_on_market']);
          }else{
            $('#avg_days_on_market').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_days_to_agree')){
            $('#avg_days_to_agree').html(data['sales_agreed']['avg_days_to_agree']);
          }else{
            $('#avg_days_to_agree').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_negged_up')){
            $('#avg_negged_up').html(data['currency'] + ' ' + data['sales_agreed']['avg_negged_up']);
          }else{
            $('#avg_negged_up').html('No data');
          }
          if(data['sales_agreed'].hasOwnProperty('avg_percent_negged_up')){
            $('#avg_percent_negged_up').html(data['sales_agreed']['avg_percent_negged_up']);
          }else{
            $('#avg_percent_negged_up').html('No data');
          }
          if(data.hasOwnProperty('pie_chart_sa_status')){
            Highcharts.chart("sa_status_pie_chart",data['pie_chart_sa_status']);
          }
          if(data.hasOwnProperty('sa_status_bar_chart')){
            Highcharts.chart("sa_status_bar_chart",data['sa_status_bar_chart']);
          }
        }
        else if(data['active_tab']=='exchanged'){
          $('#e_count').html(data['e_count']);
          if(data['exchanged'].hasOwnProperty('total_price')){
            $('#total_exchanged_value').html(data['currency'] + ' ' + data['exchanged']['total_price']);
          }else{
            $('#total_exchanged_value').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_price')){
            $('#average_exchanged_price').html(data['currency'] + ' ' + data['exchanged']['avg_price']);
          }else{
            $('#average_exchanged_price').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_fee_percent')){
            $('#average_exchanged_fee_percent').html(data['exchanged']['avg_fee_percent']);
          }else{
            $('#average_exchanged_fee_percent').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_fee')){
            $('#average_exchanged_fee').html(data['currency'] + ' ' + data['exchanged']['avg_fee']);
          }else{
            $('#average_exchanged_fee').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('total_fee')){
            $('#total_exchanged_fee').html(data['currency'] + ' ' + data['exchanged']['total_fee']);
          }else{
            $('#total_exchanged_fee').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_percent_of_agreed_price')){
            $('#avg_percent_of_agreed_price').html(data['exchanged']['avg_percent_of_agreed_price']);
          }else{
            $('#avg_percent_of_agreed_price').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('total_sales_agreed_price')){
            $('#total_sales_agreed_price').html(data['currency'] + ' ' + data['exchanged']['total_sales_agreed_price']);
          }else{
            $('#total_sales_agreed_price').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_appraisal_to_completed_days')){
            $('#avg_appraisal_to_completed_days').html(data['exchanged']['avg_appraisal_to_completed_days']);
          }else{
            $('#avg_appraisal_to_completed_days').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_days_to_exchange')){
            $('#avg_days_to_exchange').html(data['exchanged']['avg_days_to_exchange']);
          }else{
            $('#avg_days_to_exchange').html('No data');
          }
          if(data['exchanged'].hasOwnProperty('avg_days_to_completion')){
            $('#avg_days_to_completion').html(data['exchanged']['avg_days_to_completion']);
          }else{
            $('#avg_days_to_completion').html('No data');
          }
        }
        else if(data['active_tab']=='negged'){
          $('#n_count').html(data['n_count']);
          if(data['negged'].hasOwnProperty('average_asking_price')){
            $('#average_asking_price').html(data['currency'] + ' ' + data['negged']['average_asking_price']);
          }
          else{
            $('#average_asking_price').html('No data');
          }
          if(data['negged'].hasOwnProperty('average_negged_price')){
            $('#average_negged_price').html(data['currency'] + ' ' + data['negged']['average_negged_price']);
          }
          else{
            $('#average_negged_price').html('No data');
          }
          if(data['negged'].hasOwnProperty('average_negged_saving')){
            $('#average_negged_saving').html(data['currency'] + ' ' + data['negged']['average_negged_saving']);
          }
          else{
            $('#average_negged_saving').html('No data');
          }
          if(data['negged'].hasOwnProperty('average_negged_saving_percent')){
            $('#average_negged_saving_percent').html(data['negged']['average_negged_saving_percent'] + '%');
          }
          else{
            $('#average_negged_saving_percent').html('No data');
          }
        }
        else if(data['active_tab']=='predictions'){
          $(function () {
              (function (H) {
                  H.wrap(H.seriesTypes.pie.prototype, 'placeDataLabels', function (proceed) {
                      var centerX = this.centerX;
                      H.each(this.points, function (p, i) {
                          p.dataLabel._pos.x = centerX;
                      });
                      proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                  });

              }(Highcharts));

              Highcharts.chart('funnel-charts', data['pyramid_chart']);
          });
        }
      }
      else{
        console.log('error: true')
      }
    },
    error: function(data){
      console.log('Error: ' + data['error']);
    }
  })
}

$(document).ready(function(){
  $('.daterange').daterangepicker({
    autoUpdateInput: false,
    locale: {
          format: 'DD/MM/YYYY',
          cancelLabel: 'Clear'
      }
  });

  $('.daterange').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    populate();
  });

  $('.daterange').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      populate();
  });

  $('.bootstrap-select .dropdown-menu li a').attr('href', 'javascript:void(0)');

  populate();

  let anchor_list = [
    $('a[href="#appraisals"]'), $('a[href="#instructions"]'), $('a[href="#sales_agreed"]'), $('a[href="#exchanged"]'), $('a[href="#negged"]'), $('a[href="#predictions"]')
  ]

  $(anchor_list).each(function(){
    $(this).click(function(event){
      if(!$(this).hasClass('active')){
        let link_add = $(this).attr('href')
        $('input[name="active_tab"]').val(link_add.substring(1, link_add.length));
        populate();
      }
    });
  });
})
