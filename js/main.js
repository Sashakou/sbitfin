var projects;

$(document).ready(function(){
  var operation_id = 0;  
  var nbu_EUR;
  var nbu_USD;
  var nbu_CZK;
  courseNBU();//НБУ
  function courseNBU(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + mm + dd;
    // var this_el = $(this_elem).parents('.cover_expense_block, .cover_edit_expense_block');
    $.ajax({
      url: "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date="+today+"&json",
      success: function(msg){
        // console.log(msg);
        for (var key in msg) {
          if (msg[key]['cc'] == 'EUR') {
            nbu_EUR = Math.round(msg[key]['rate'] * 10000) / 10000;
            // console.log(nbu_EUR);
          }
          if (msg[key]['cc'] == 'USD') {
            nbu_USD = Math.round(msg[key]['rate'] * 10000) / 10000;
            // console.log(nbu_USD);
          }
          if (msg[key]['cc'] == 'CZK') {
            nbu_CZK = Math.round(msg[key]['rate'] * 10000) / 10000;
            // console.log(nbu_CZK);
          }
        }
      }
    });  
  }

  $(".tabs_item").on("click", function() {
    var this_attr = $(this).attr('transaction');
    $(".tabs_item").removeClass("tabs_item-active");
    $(this).addClass("tabs_item-active");
    $(".transaction").attr('class','transaction '+this_attr+'');  
    $('.tabs_content_item').attr('transaction',''+this_attr+'');

    if (this_attr == 'transfer') {
      $('.main_sel').attr('transaction','');
    }else{
      $('.main_sel').attr('transaction',''+this_attr+'');
    }
    

    $(".tabs_content .block-expense_item[transaction]").removeClass('block_trans-act');
    $(".tabs_content .title_project #sel_project[transaction='transfer']").removeClass('block_trans-act');
    if (this_attr == 'income') {
      $(".tabs_content .block-expense_item[transaction='income']").addClass('block_trans-act');
    }else if (this_attr == 'expence') {
      $(".tabs_content .block-expense_item[transaction='expence']").addClass('block_trans-act');
    }else if (this_attr == 'transfer') {
      $(".tabs_content .block-expense_item[transaction='expence']").addClass('block_trans-act');
      $(".tabs_content .block-expense_item[transaction='income']").addClass('block_trans-act');
      $(".tabs_content .title_project #sel_project[transaction='transfer']").addClass('block_trans-act');
    }
  });

  $('.title_project, #main_container_table').on('change','#sel_project',function(){
    var this_id = $(this).find('option:selected').attr('number_id');
    // console.log(this_id);
    var this_select = $(this).find('option:selected');
    // $('#sel_project option').prop('selected',false);
    
    // $(this).find('option:selected').attr('selected',false);
    $(this).find('option').attr('selected',false);
    this_select.attr('selected',true);
    $('.title_item_project').removeClass('title_item_project-act');
    $('.cover-list_filter div[number_id="'+this_id +'"]').find('.title_item_project').addClass('title_item_project-act');

    var this_el = $(this).parents('.cover_expense_block, .cover_edit_expense_block');

    // var curr_proj = $(this).parent().attr('curr');
    var curr_project = this_select.attr('curr');
    this_el.find('.common-expense-base').text(curr_project);
    this_el.find('#sum_base').attr('curr',curr_project);
    
    // console.log(this_select);
    // console.log(curr_project);
    var currency = this_el.find("#common-expense").val();
    if (curr_project == currency) {
      this_el.find('.curse').removeClass('curse-act');
    }else{
      this_el.find('.curse').addClass('curse-act');
    }
  });

  $('#calendar, #calendar_income').daterangepicker({
    locale: {
      format: 'MM-DD-YYYY'
    },
    singleDatePicker: true
  });
  $('#calendar, #calendar_income').on('apply.daterangepicker', function(ev, picker) {
    $(this).attr('date',picker.endDate.format("MM-DD-YYYY"));
  });

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = ''+mm+'-'+dd+'-'+yyyy+'';

  $('#calendar, #calendar_income').attr('date',today);

  $(".inner_cover_expense, #main_container_table").on("change","#common-expense", function(){
    var currency = $(this).val();
    var this_el_parents = $(this).parents('.cover_expense_block, .cover_edit_expense_block');
    var curr_project = this_el_parents.find('#sel_project option:selected').attr('curr');
    this_el_parents.find('.common-expense').text(currency);
    this_el_parents.find('.common-expense_edit').text(currency);

    if (currency == 'CZK') {
      this_el_parents.find('.course').text(nbu_CZK);
    }else if (currency == 'EUR'){
      this_el_parents.find('.course').text(nbu_EUR);
    }else if (currency == 'USD'){
      this_el_parents.find('.course').text(nbu_USD);
    }

    if (curr_project == currency) {
      this_el_parents.find('.curse').removeClass('curse-act');
    }else{
      this_el_parents.find('.curse').addClass('curse-act');
    }
  });

  $(".curse, #main_container_table").on("click",".style_in_cur", function(){
    var this_el = $(this).parents('.inner_cover_expense');
    this_el.find('.style_in_cur').addClass('input_expense_res');
    this_el.find('.style_in_cur').removeClass('input_act');
    $(this).removeClass('input_expense_res');
    $(this).addClass('input_act');
  });

  $('#sum').keydown(function(e) {
    if (e.keyCode === 13) {
      // console.log('22222222222222');
      $( "#description" ).focus();
    }
  });

  var rate;
  var rev_rate;
  var sum_base;
  var sum;
  var this_el;

  $(".expense_item-span, #main_container_table").on("click",".course", function(){
    var par_elem = $(this).parents('.expense_item');
    var this_el_text = $(this).text();
    par_elem.find('#rate').val(this_el_text);
    par_elem.find('.style_in_cur').addClass('input_expense_res');
    par_elem.find('.style_in_cur').removeClass('input_act');

    sum_base = par_elem.find("#sum_base").val();
    sum_base = parseFloat(sum_base);

    sum = par_elem.find('#sum').val();
    sum = parseFloat(sum);

    rate = par_elem.find("#rate").val();
    rate = parseFloat(rate);

    rev_rate = par_elem.find("#rev_rate").val();
    rev_rate = parseFloat(rev_rate);

    if (sum >= 0) {
      rev_rate = 1/rate ;
      par_elem.find("#rev_rate").not('.input_act').val(Math.round(rev_rate * 10000) / 10000);

      sum_base = sum * rate;
      par_elem.find("#sum_base").not('.input_act').val(Math.round(sum_base * 10000) / 10000);
    }
  });

  function ChangeSumRate(obj){
    // console.log('зашло');
    this_el = $(obj).parents('.inner_cover_expense');
    var el_sum_base = this_el.find("#sum_base");
    var el_rate = this_el.find("#rate");
    var el_rev_rate = this_el.find("#rev_rate");
    sum = this_el.find('#sum').val();
    sum = parseFloat(sum);

    rate = parseFloat(el_rate.val());
    rev_rate = parseFloat(el_rev_rate.val());
    sum_base = parseFloat(el_sum_base.val());

    if (el_sum_base.hasClass('input_act')) {
    // console.log('sum_base');
      rate = (sum?sum_base/sum:0);
      rev_rate = (sum_base?sum/sum_base:0);
    }else if(el_rev_rate.hasClass('input_act')){
    // console.log('rev_rate');
      sum_base = (rev_rate?sum/rev_rate:0);
      rate = (sum?sum_base/sum:0);
    }else if(rate){
    // console.log('rate');
      sum_base = sum*rate;
      rev_rate = (sum_base?sum/sum_base:0);
    }else{
      // console.log('no');
      rate = 0;
      rev_rate = 0;
      sum_base = 0;
    }

    this_el.find("#rate").not('.input_act').val(Math.round(rate * 10000) / 10000);
    this_el.find("#sum_base").not('.input_act').val(Math.round(sum_base * 10000) / 10000);
    this_el.find("#rev_rate").not('.input_act').val(Math.round(rev_rate * 10000) / 10000);
  }

  $(".inner_cover_expense, #main_container_table").on("keyup","#sum, #sum_base, #rev_rate, #rate", function(){
    ChangeSumRate(this);
  });

  // $(".inner_cover_expense, #main_container_table").on("keyup","#rate", function(){
  //   ChangeSumRate(this);
  // });

  // $(".inner_cover_expense, #main_container_table").on("keyup","#rev_rate", function(){
  //   ChangeSumRate(this);
  // });

  // $(".inner_cover_expense, #main_container_table").on("keyup","#sum_base", function(){
  //   ChangeSumRate(this);
  // });

  // калькулятор  курса--------------------------------------------------------------------
  // КУРС НБУ------------------------------------------------------------------------------
    

  // КУРС НБУ------------------------------------------------------------------------------
  function btn_restab(this_elem){
    operation_id = operation_id +1;
    // var this_elem = $(this);
    var this_el = $(this_elem).parents('.tabs_content_item');
    var this_attr = this_el.attr('transaction');
    // this_el.find('#sel_project').attr('transaction',''+this_attr+'');
    // if (this_attr == 'income') {

    // }
    var project_span = this_el.find('#sel_project[transaction='+this_attr+'] option:selected');
    // var sel_act = this_el.find('#sel_project option:selected');
    if (project_span.hasClass('project_empty')) {
      alert('Выберите проект и заполните форму');
      // $('.title_project select').css('color','red');
      // setTimeout(function(){
      //   $('.project_empty').css('color','unset');
      // }, 2000);
    }else{
      // console.log('okkk');
      // формування таблиці
      var result_row = $('#refuge').find('.data-result-row').clone();
      var table_result_row = $('#refuge').find('.table-result-row').clone();
      // console.log(result_row);
      // $('.data-result').append(result_row);
      var price = this_el.find('#sum').val();
      var rate_course = this_el.find('#rate').val();
      var rev_rate_course = this_el.find('#rev_rate').val();
      var calendar = this_el.find('#calendar').attr('date');
      var curr_pay = this_el.find("#common-expense").val();
      var description = this_el.find('#description').val();
      var category = this_el.find("#category").val();
      var transaction = $(this_elem).parent().attr('transaction');
      var project_span_id;

      var project;
      var project_main;
      if (this_attr == 'transfer') {

        var project_main1 = this_el.find(".block-expense_item[transaction='expence'] #project-main").val();
        var project_main2 = this_el.find(".block-expense_item[transaction='income'] #project-main").val();

        project_main = 'C- '+project_main1+' На- '+project_main2+'';
        // result_row
        // table_result_row

        var selected1 = this_el.find('#sel_project option:selected').attr('name');
        var selected2 = this_el.find('#sel_project[transaction="transfer"] option:selected').attr('name');

        project = 'C- '+selected1+' На- '+selected2+'';
        result_row.find('.table-result-row').attr({name_second: selected2});

        project_span_id = this_el.find('#sel_project option:selected').attr('number_id');
        var selected_number_id_2 = this_el.find('#sel_project[transaction="transfer"] option:selected').attr('number_id');
        
        result_row.find('.table-result-row').attr({number_id_second: selected_number_id_2});

        table_result_row.attr({name_second: selected2, number_id_second: selected_number_id_2});
      }else{
        project = this_el.find('#sel_project option:selected').attr('name');
        project_main = this_el.find(".block-expense_item[transaction="+transaction+"] #project-main").val();
        project_span_id = project_span.attr('number_id');
      }
      
      var html ='<div class="tablet-item project">'+project+'</div><div class="tablet-item description">'+description+'</div><div class="tablet-item project_main" >'+project_main+'</div><div class="tablet-item category">'+category+'</div><div class="tablet-item cover_price"><span><span class="price">'+price+'</span> <span class="common-expense">'+curr_pay+'</span></span></div>';
      // console.log(calendar);

      result_row.attr('date',calendar);
      result_row.find('.column-data span').html(calendar);
      result_row.find('#calendar_edit').val(calendar);
      result_row.find('#calendar_edit').attr('date',calendar);
      result_row.find('.main_table').html(html);
      result_row.find('.project_main').attr({from_project_main: project_main1, to_project_main: project_main2});

      if (this_el.find('.curse').hasClass('curse-act')) {
        // console.log('.hasClass(curse-act)');
        var val_sum_base = this_el.find('#sum_base').val();
        var attr_sum_base = this_el.find('#sum_base').attr('curr');
        result_row.find('.cover_price').append('<span class="cover_price_base" rate="'+rate_course+'" rev_rate="'+rev_rate_course+'"><span class="price_base">'+val_sum_base+'</span> <span class="common-expense_base">'+attr_sum_base+'</span></span>');
        result_row.find('.course').text(rate_course);
        result_row.find('#rate').val(rate_course);
        result_row.find('#rev_rate').val(rev_rate_course);
      }else{
        // console.log('NO______hasClass(curse-act)');
      }

      var title_transaction;
      var color_transaction;
      if (transaction == 'income') {
        title_transaction = 'Доход';
        color_transaction = 'color_income';
      }else if (transaction == 'expence') {
        title_transaction = 'Розход';
        color_transaction = 'color_expence';
      }else if (transaction == 'transfer') {
        title_transaction = 'Перевод';
        color_transaction = 'color_transfer';
      }

      result_row.find('.table-result-row').attr({operation_id: operation_id, number_id: project_span_id, name: selected1, transaction: transaction, title: title_transaction}); //добавляє attr пректа
      
      // if (transaction == 'income') {
      //   color_transaction = 'color_income';
      // }else if (transaction == 'expence') {
      //   color_transaction = 'color_expence';
      // }else if (transaction == 'transfer') {
      //   color_transaction = 'color_transfer';
      // } 
      result_row.find('.cover_price').addClass(''+color_transaction+'');
      // console.log(html_tbody);
      // console.log(result_row);
      
      if ($('#main_container_table .data-result-row').length <= 0) {
        $('#main_container_table').prepend(result_row);
        // console.log('вставило data-result-row');
      }else{
        // console.log('вставило table-result-row');
        table_result_row.attr({operation_id: operation_id, number_id: project_span_id, name: selected1, transaction: transaction, title: title_transaction});
        table_result_row.find('.main_table').html(html);
        table_result_row.find('.cover_price').addClass(''+color_transaction+'');
        table_result_row.find('.project_main').attr({from_project_main: project_main1, to_project_main: project_main2});
        table_result_row.find('#calendar_edit').val(calendar);
        table_result_row.find('#calendar_edit').attr('date',calendar);

        if (this_el.find('.curse').hasClass('curse-act')) {
          // console.log('.hasClass(curse-act)');
          var val_sum_base = this_el.find('#sum_base').val();
          var attr_sum_base = this_el.find('#sum_base').attr('curr');
          table_result_row.find('.cover_price').append('<span class="cover_price_base" rate="'+rate_course+'" rev_rate="'+rev_rate_course+'"><span class="price_base">'+val_sum_base+'</span> <span class="common-expense_base">'+attr_sum_base+'</span></span>');
          table_result_row.find('.course').text(rate_course);
          table_result_row.find('#rate').val(rate_course);
          table_result_row.find('#rev_rate').val(rev_rate_course);        
        }

        if ($('#main_container_table').find('.data-result-row[date="'+calendar+'"]').length <= 0) {
          $('#main_container_table').prepend(result_row);
          // console.log('создаєм новий  row з датой якої немає');
        }else{
          $('#main_container_table').find('.data-result-row[date="'+calendar+'"] .cover_tab_project').prepend(table_result_row);
        }        
      }
      // $('.data-result').prepend(html);
      this_el.find('#sum').val('');
      // this_el.find('#calendar').val('');
      // this_el.find('.title_project .project_empty').show().attr('selected','selected');
      // this_el.find("#common-expense").val('UAH');
      this_el.find('#description').val('');
      this_el.find("#project-main").val('Кеш');
      this_el.find("#category").val('');
      this_el.find("#rate, #rev_rate, #sum_base").val('');
      // this_el.find("#sum_base").attr('curr',''); 
      this_el.find("#course").text('');
      
      // project_span_attr = project_span.attr('project','');
      // $('.title_item_project').removeClass('title_item_project-act');
    }
    filter_date();
    $('#main_container_table #calendar_edit').daterangepicker({
      locale: {
        format: 'MM-DD-YYYY'
      },
      // format:'DD/MM/YYYY',
      // "endDate": "04/09/2019",
      singleDatePicker: true
    });
    $('#main_container_table #calendar_edit').on('apply.daterangepicker', function(ev, picker) {
      $(this).attr('date',picker.endDate.format("MM-DD-YYYY"));
    });
    // Запис даних в обєкт
      var object_go_to_json = {
        number_id:""+project_span_id+"",
        price:""+price+"",
        curr_pay:""+curr_pay+"",
        description:""+description+"",
        category:""+category+"",
        project_main:""+project_main+"",
        date:""+calendar+""
      };
      var str = JSON.stringify(object_go_to_json);
      // console.log(str);
      // $.ajax({
      //   url: '/sbit_finance/',
      //   data: str,
      //   success: function(result) {
      //     console.log(' дані відправленно'); 
      //   } 
      // });
    // Запис даних в обєкт
  }

  $('.cover_expense_block').keydown(function(e) {
    if (e.ctrlKey && e.keyCode == 13) {
      btn_restab(this);
      // console.log('e.ctrlKey && e.keyCode == 13');
    }
  });

  $("#btn_restab").on("click", function(){
    btn_restab(this);
  });

  $("#main_container_table").on("mouseover",".table-result-row", function() {
    $(this).addClass('table-result-row_hover');
    // $(this).find('.edit_block').css('opacity','1');
    // $(this).css('background','rgba(185, 183, 183, 0.35)');
  });

  $("#main_container_table").on("mouseout",".table-result-row", function() {
    if ($(this).hasClass('edinting')) {
      return;
    }else{
      $(this).removeClass('table-result-row_hover');
    }
  });

  $("#main_container_table").on("click","#remove", function() {
    var el_parts = $(this).parents('.cover_tab_project').find('.table-result-row');
    if (el_parts.length <= 1) {
      $(this).parents('.data-result-row').remove();
    }else{
      $(this).parent().parent().remove();
    }
  });

  $("#main_container_table").on("click","#edit", function() {
    // $('.title_project_edit>#sel_project').find('option').hide();
    // parent_checked();
    var this_el = $(this).parent().parent();
    this_el.addClass('edinting');
    // this_el.find('.table-result-row').addClass('edinting');
    this_el.find('.edit_block').hide();
    this_el.find('.main_table').hide();
    this_el.find('.edit_box').show();

    // console.log(this_el);

    var main_table = this_el.find('.main_table');
    // console.log(main_table);
    var main_table_price = main_table.find('.price').text();
    var main_table_common_expense = main_table.find('.common-expense').text();
    var main_table_calendar = main_table.find('.calendar').text();
    var main_table_curr_pay = main_table.find('.curr_pay').text();
    var main_table_description = main_table.find('.description').text();
    var main_table_category = main_table.find('.category').text();
    var main_table_project_main = main_table.find('.project_main').text();
    // console.log('transfer');

    var pats = $(this).parents('.table-result-row').attr('transaction');
    var edit_block = this_el.find('.cover_edit_expense_block');
    var project_id = $(this).parents('.table-result-row').attr('number_id');
    var project_id_second = $(this).parents('.table-result-row').attr('number_id_second');

    // if($("div").is("selector"))

    if (this_el.find('.cover_price>.cover_price_base').length) {
      // console.log('є--- cover_price_base');
      this_el.find('.curse').addClass('curse-act');
      var price_base = this_el.find('.price_base').text();
      // console.log(price_base);
      var common_expense_base = this_el.find('.common-expense_base').text();
      // var common_expense = this_el.find('.common-expense').text();
      // this_el.find('#rate').val(common_expense_base);
      // var common_expense_val = this_el.find('#common_expense').val();
      // this_el.find('.course').text(nbu_+main_table_common_expense);
      if (main_table_common_expense == 'CZK') {
        this_el.find('.course').text(nbu_CZK);
      }else if (main_table_common_expense == 'EUR'){
        this_el.find('.course').text(nbu_EUR);
      }else if (main_table_common_expense == 'USD'){
        this_el.find('.course').text(nbu_USD);
      }
      var rate = main_table.find('.cover_price_base').attr('rate');
      var rev_rate = main_table.find('.cover_price_base').attr('rev_rate');
      this_el.find("#rate").val(rate);
      this_el.find("#rev_rate").val(rev_rate);
      this_el.find('.curse .common-expense-base').text(common_expense_base);
      this_el.find('.curse #sum_base').val(price_base);
      this_el.find('.curse .common-expense_edit').text(main_table_common_expense);
      this_el.find('#common-expense').val(main_table_common_expense);

    }else{
      // console.log('немає--- cover_price_base');
    }
    if (pats == 'transfer') {
      // console.log('transfer');
      $(this).parents('.table-result-row').find('#sel_project[transaction="transfer"]').addClass('block_trans-act');
      $(this).parents('.table-result-row').find(".block-expense_item[transaction='expence']").addClass('block_trans-act');

      // $(this).parents('.table-result-row').attr('');
      this_el.find('.title_project_edit .main_sel').find('option[number_id="'+project_id+'"]').show().attr('selected',true).attr('disabled',true);
      this_el.find('.title_project_edit #sel_project[transaction="transfer"]').find('option[number_id="'+project_id_second+'"]').show().attr('selected',true).attr('disabled',true);

      var val_project_main_from = main_table.find('.project_main').attr('from_project_main');
      var val_project_main_to = main_table.find('.project_main').attr('to_project_main');
      edit_block.find(".block-expense_item[transaction='expence'] #project-main").val(val_project_main_from);
      edit_block.find(".block-expense_item[transaction='income'] #project-main").val(val_project_main_to);

    }else{
      this_el.find('.title_project_edit #sel_project').find('option[number_id="'+project_id+'"]').show().attr('selected',true).attr('disabled',true);
      
      edit_block.find("#project-main").val(main_table_project_main);// selecd  
    }
    edit_block.find('#sum').val(main_table_price);
    edit_block.find('#calendar').val(main_table_calendar);
    edit_block.find("#common-expense").val(main_table_common_expense);
    edit_block.find('#description').val(main_table_description);
    edit_block.find("#category").val(main_table_category);
  });

  $("#main_container_table").on("click","#cancel", function() {
    var this_el = $(this).parent().parent();
    this_el.removeClass('edinting');
    // this_el.find('.table-result-row').addClass('edinting');
    this_el.find('.edit_block').show();
    this_el.find('.main_table').show();
    this_el.find('.edit_box').hide();
  });

  $("#main_container_table").on("click","#save", function() {
    var this_el = $(this).parent();

    var category = this_el.find("#category").val();
    var price = this_el.find("#sum").val();
    var description = this_el.find("#description").val();
    var project_main = this_el.find("#project-main").val();
    var project_common_expense = this_el.find("#common-expense").val();
    var project_id = this_el.find('.title_project_edit #sel_project').find('option:selected').attr('number_id');
    var project_name = this_el.find('.title_project_edit #sel_project').find('option:selected').attr('name');
    var sum_base = this_el.find('#sum_base').val();
    // var common_expense_base = $(this).parent().find('.common_expense-base').text();
    var common_expense_base = this_el.find('.title_project_edit #sel_project').find('option:selected').attr('curr');
    // console.log(common_expense_base);
    var table_result_row_el = $(this).parent().parent();

    // table_result_row_el.find('.project').attr('id',project_id);
    
    $(this).parents('.table-result-row').attr('number_id',project_id);
    $(this).parents('.table-result-row').attr('name',project_name);

    var pats = $(this).parents('.table-result-row').attr('transaction');
    if (pats == 'transfer') {

      var from_project_main = this_el.find(".block-expense_item[transaction='expence'] #project-main").val();
      var to_project_main = this_el.find(".block-expense_item[transaction='income'] #project-main").val();

      table_result_row_el.find(".project_main").attr({from_project_main:from_project_main, to_project_main:to_project_main})
      table_result_row_el.find(".project_main").text('C- '+from_project_main+' На- '+to_project_main+'');


      var selected1 = this_el.find('.title_project_edit .main_sel option:selected').attr('name');
      var selected2 = this_el.find('.title_project_edit #sel_project[transaction="transfer"] option:selected').attr('name');

      table_result_row_el.find('.project').text('C- '+selected1+' На- '+selected2+'');

      // this_el.find('.title_project_edit #sel_project').find('option').attr('selected',false).attr('disabled',false);
      var number_id1 = this_el.find('.title_project_edit .main_sel option:selected').attr('number_id');
      var number_id2 = this_el.find('.title_project_edit #sel_project[transaction="transfer"] option:selected').attr('number_id');

      $(this).parents('.table-result-row').attr({number_id_second: number_id2, number_id: number_id1, name_second:selected2, name:selected1});

    }else{
      // console.log('rfrf');
      table_result_row_el.find('.project').text(project_name);
      table_result_row_el.find('.project_main').text(project_main);
      // this_el.find('.title_project_edit #sel_project').find('option').attr('selected',false).attr('disabled',false);
      // this_el.find('.title_project_edit #sel_project').find('option[number_id="'+project_id+'"]').attr('selected',true).attr('disabled',true);
      // parent_checked();
    }
    this_el.find('.title_project_edit #sel_project').find('option').attr('selected',false).attr('disabled',false);
    this_el.find('.title_project_edit #sel_project').find('option[number_id="'+project_id+'"]').attr('selected',true).attr('disabled',true);
    parent_checked();

    table_result_row_el.find('.category').text(category);
    table_result_row_el.find('.price').text(price);
    table_result_row_el.find('.description').text(description);
    table_result_row_el.find('.common-expense').text(project_common_expense);
    table_result_row_el.find('.edit_block').show();
    table_result_row_el.find('.main_table').show();
    table_result_row_el.find('.edit_box').hide();

    // if (this_el.find('.cover_price>.cover_price_base').length) {
    //   console.log('є--- cover_price_base');
    //   this_el.find('.curse').addClass('curse-act');
    //   var price_base = this_el.find('.price_base').text();
    //   console.log(price_base);
    //   var common_expense_base = this_el.find('.common-expense_base').text();
    //   // var common_expense = this_el.find('.common-expense').text();

    //   this_el.find('.curse .common-expense-base').text(common_expense_base);
    //   this_el.find('.curse #sum_base').val(price_base);
    //   this_el.find('.curse .common-expense_edit').text(main_table_common_expense);
    //   this_el.find('#common-expense').val(main_table_common_expense);

    // }else{
    //   console.log('немає--- cover_price_base');
    // }

    var this_el_parents = $(this).parents('.table-result-row');
    var rate = this_el.find('#rate').val();
    var rev_rate = this_el.find('#rev_rate').val();
    if (this_el_parents.find('.cover_price>.cover_price_base').length) {
      // console.log('є--- cover_price_base');
      if (common_expense_base == project_common_expense) {
        // console.log('базова і оплачувана валюта сходяться');
        table_result_row_el.find('.price_base').text(sum_base);
        table_result_row_el.find('.common-expense_base').val(common_expense_base);
        table_result_row_el.find('.cover_price_base').remove();
      }else{
        table_result_row_el.find('.cover_price_base').remove();
        this_el_parents.find('.cover_price').append('<span class="cover_price_base" rate="'+rate+'" rev_rate="'+rev_rate+'"><span class="price_base">'+sum_base+'</span> <span class="common-expense_base">'+common_expense_base+'</span></span>');
        // console.log('базова і оплачувана валюта несходяться--добавляєм html ');
      }
    }else{
      // console.log('немає--- cover_price_base');
      this_el_parents.find('.cover_price').append('<span class="cover_price_base" rate="'+rate+'" rev_rate="'+rev_rate+'"><span class="price_base">'+sum_base+'</span> <span class="common-expense_base">'+common_expense_base+'</span></span>');
    }
    
    table_result_row_el.removeClass('edinting');

    var attr_date = $(this).parents('.table-result-row').find('#calendar_edit').attr('date');
    $(this).parents('.table-result-row').removeClass('table-result-row_hover');

    var this_table_result_row = $(this).parents('.table-result-row').clone();

    var new_block = $('#main_container_table').find('.data-result-row[date="'+attr_date+'"]');

    var el_parts = $(this).parents('.data-result-row').find('.table-result-row');

    var el_parts_attr = $(this).parents('.data-result-row').attr('date');

    if (attr_date == el_parts_attr) {
      return;
    }else{
      if (new_block.length <= 0) {
        var result_row = $('#refuge').find('.data-result-row').clone();
        result_row.find('.column-data span').text(attr_date);
        result_row.attr('date',attr_date);
        result_row.find('.cover_tab_project').html(this_table_result_row);
        $('#main_container_table').append(result_row);


        if (el_parts.length <= 1) {
          $(this).parents('.data-result-row').remove();
        }else{
          $(this).parents('.table-result-row').remove();
        }

        filter_date();
      }else{
        $('#main_container_table').find('.data-result-row[date="'+attr_date+'"] .cover_tab_project').append(this_table_result_row);
        if (el_parts.length <= 1) {
          $(this).parents('.data-result-row').remove();
        }else{
          $(this).parents('.table-result-row').remove();
        }
      }
    }

    $('#main_container_table #calendar_edit').daterangepicker({
      locale: {
        format: 'MM-DD-YYYY'
      },
      // format:'DD/MM/YYYY',
      // "endDate": "04/09/2019",
      singleDatePicker: true
    });
    $('#main_container_table #calendar_edit').on('apply.daterangepicker', function(ev, picker) {
      $(this).attr('date',picker.endDate.format("MM-DD-YYYY"));
    });

  });

    // $(".table-result-row").on({
    //     mouseenter: function () {
    //       // console.log('huy');
    //       $(this).find('.edit_block').css('opacity','1');
    //     },
    //     mouseleave: function () {
    //       $('.edit_block').css('opacity','0');
    //     }
    // });

    // $(".data-result").on("click",".row_project:before", function() {
    //   console.log('huy');

    // $('.inner_list').on('change', ' #project_checkbox', function () {
    //   // $('input[type="checkbox"]').prop('checked', true);
    //   var chek = $(this).parent().parent().find('input[type="checkbox"]');
    //   console.log(chek);
    //   chek.prop('checked', true);
    //   event.stopPropagation();
    // });

  //акардіон
  $(".cover-list_filter").on("click",".project_arrow", function(){
    $(this).parent().next().slideToggle(300);
    if($(this).hasClass('project_arrow-active')){
      $(this).removeClass('project_arrow-active');
    }else{
      $(this).addClass('project_arrow-active');
    }
  });
  //акардіон

  //фільтр 
  $('.box_proj_main input[type="checkbox"]').click(function() {
    if ($('.box_proj_main input[type="checkbox"]:checked').length > 0) {
        $('.cover_tab_project').find('.table-result-row').hide();
        $('.box_proj_main input[type="checkbox"]:checked').each(function() {
            var this_attr = $(this).parent().attr('project');
            $('.cover_tab_project').find('.table-result-row[project="'+this_attr+'"]').show();

        });
    } else {
        $('.cover_tab_project').find('.table-result-row').show();
    }
  });
  //фільтр

  //масовий вибір  
    $(".cover-list_filter").on("change","#project_checkbox", function () {
      // $('#sel_project').find('option[project="Проект невыбран"]').show().attr('selected',true);
      // console.log('OK');
      var chek = $(this).parent().parent().find('input[type="checkbox"]');
      if ($(this).prop('checked')) {
        chek.prop('checked', true);
        // console.log('OK1');
        var rr = $(this).prop('checked');
        // console.log(rr);
      }else{
        chek.prop('checked', false);
        // console.log('OK2');
        $('.cover-list_filter .inp_project').each(function() {
          if ($(this).next().hasClass('title_item_project-act')) {
            $(this).prop('checked', true);
          }
        });
      }
      // event.stopPropagation();
    });

    // $('.cover-list_filter .inp_project').each(function() {
    //   if ($(this).next().hasClass('title_item_project-act')) {
    //     $(this).prop('checked', false);
    //   }else{
    //     $(this).prop('checked', true);
    //   }
    // });

    //  $(".cover-list_filter").on("change","#project_checkbox", function () {
    //   // $('#sel_project').find('option[project="Проект невыбран"]').show().attr('selected',true);
    //   var this_el = $(this);
    //   console.log('OK');
    //   var chek = $(this).parent().parent().find('input[type="checkbox"]');
    //   $(chek).each(function() {
    //     // var chek = $(this).parent().parent().find('input[type="checkbox"]');
    //     if (this_el.prop('checked')) {
    //       var chek_next = $(this).next();
    //       if (chek_next.hasClass('title_item_project-act')) {
    //         chek.prop('checked', false);
    //       }else{
    //         chek.prop('checked', true);
    //       }
    //     }else{
    //       chek.prop('checked', false);
    //       console.log('OK2');
    //     }
    //   });
    //   // event.stopPropagation();
    // });

  //масовий вибір
  $('.cover-list_filter').on("change",".inp_project",function() {
    if ($(this).next().hasClass('title_item_project-act')) {
      // console.log('hasClass');
      var this_id = $(this).parent().attr('number_id');
      $('#sel_project').find('option[id="'+this_id+'"]').hide().removeAttr('selected');
      $(this).next().removeClass('title_item_project-act');
      $('#sel_project').find('option.project_empty').show().attr('selected',true);
    }
  });


  // search_parent(id);
  // запис в select

  $('.cover-list_filter').on("change","input[type='checkbox']",function() {
   
    // $('#sel_project').find('option').hide();
    // var checked = $('.cover-list_filter .inp_project');
    parent_checked();
  });
  // запис в select
  // функція вибора батьків
  function parent_checked(){
    $('#sel_project,  .title_project_edit #sel_project').find('option').hide();
    $('.cover-list_filter .inp_project').each(function() {
      if ($(this).prop('checked')) {
        // console.log('checked,true');
        var this_id = $(this).parent().attr('number_id');
        $('#sel_project, .title_project_edit #sel_project').find('option[number_id="'+this_id+'"]').show();
        // console.log(this_id);
        search_parent(this_id).forEach(function(entry) {
          // console.log(entry);
          var par_sel = $('.cover_item[number_id="'+entry+'"]').find('.inp_project');
          // console.log(par_sel);
          if (!par_sel.prop('checked')) {
            $('#sel_project, .title_project_edit #sel_project').find('option[number_id="'+entry+'"]').show().attr('disabled',true);
          }else{
            $('#sel_project, .title_project_edit #sel_project').find('option[number_id="'+entry+'"]').show().attr('disabled',false);
          }
          
        });
        // console.log(search_parent(this_id));

      }else{
        // console.log('checked,false');
        // $('#sel_project').find('option').hide();
      }
    });
  }
  // функція вибора батьків 

  // вибор проекта
  $(".cover-list_filter").on("click",".title_item_project", function() {
    // вибирає одне по якому клікнули
    $(this).parents('.cover-list_filter').find('input[type="checkbox"]').prop('checked', false);
    $(this).prev().prop('checked',true);
    // вибирає одне по якому клікнули

    //удаляє acctive
    $('.title_item_project').removeClass('title_item_project-act');
    $(this).addClass('title_item_project-act');
    //удаляє acctive
    //курс валют

    var curr_proj = $(this).parent().attr('curr');

    // console.log(curr_proj);
    $('.tabs_content_item .common-expense-base').text(curr_proj);
    $('.tabs_content_item #sum_base').attr('curr',curr_proj);
    //курс валют
    var curr_pay = $(".tabs_content_item #common-expense").val();
    // console.log(curr_pay);
    if (curr_proj == curr_pay) {
      $('.tabs_content_item .curse').removeClass('curse-act');
    }else{
      $('.tabs_content_item .curse').addClass('curse-act');
    }
    //запис в select одного 
      $('#sel_project').find('option').hide().attr('selected',false);
      $('.cover-list_filter .inp_project:checked').each(function() {
        var this_id = $(this).parent().attr('number_id');
        $('#sel_project').find('option[number_id="'+this_id+'"]').show().attr('selected',true);
        // if ($(this).prop('checked')) {

        //   $('#sel_project').find('option[project="'+this_id+'"]').show().attr('selected',true);
        // }else{
        //   $('#sel_project').find('option').hide();
        // }
      });
      parent_checked();
  });
  // вибор проекта


  
  get_project_json();
  function get_project_json(){
    $.ajax({
      url:"/json/projects.json",
      success: function(msg){
        // console.log(msg);
        // створює меню
        projects = msg;
        function rec(data, c) {
          var str = '';
          var li_str = '';
          var arrow = '<div class="project_arrow"><svg version="1.1" x="0px" y="0px" viewBox="0 0 306 306"  xml:space="preserve"><g id="chevron-right"><polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153 "></polygon></g></svg></div>';
          for (var key in data) {
            var this_id = data[key].number_id;
            if (data[key].parent == c ) {
              li_str += '<li>';
                li_str += '<div number_id="'+this_id+'" class="cover_item" curr="'+data[key].curr+'">';
                console.log(!is_child(data, data[key].number_id));
                  if (!is_child(data, data[key].number_id)) {
                    li_str += '<input type="checkbox" id="project_checkbox">'; // input для вибора всіх дітей
                  }
                  li_str += '<input type="checkbox" class="inp_project">';
                  li_str += '<span class="title_item_project">' + data[key].name;
                  li_str += '</span>';
                  if (!is_child(data, data[key].number_id)) {
                    li_str += ''+arrow+'';
                  }
                li_str += '</div>';  
                li_str += rec(data, data[key].number_id);//вставляє дочірній ul
              li_str += '</li>';
            }
          }
          console.log(''+li_str+' li_str');
          if (li_str) {
            str += '<ul class="filter_list">';
            str += li_str;
            str += '</ul>';
            console.log(str);
          }
          return str;
        }

        function is_child(data, id){
          for (var key in data) {
              if(data[key].parent == id){
                console.log(id);
                  return false;
              }
          }
          return true;
        }

        $('.cover-list_filter').append(rec(msg, 0));
        // створює меню

        // створює select
        var str_option = '';
        for (var key in msg) {
          tmp = search_parent(key);
          tire_cnt = tmp.length;
          var name = msg[key].name;
          if(tire_cnt > 0){
            // console.log(tire_cnt);
            str_option += '<option number_id="'+msg[key].number_id+'" curr="'+msg[key].curr+'" name="'+msg[key].name+'">'+name.padStart(name.length + tire_cnt , '-')+'</option>';
          }else{
            str_option += '<option number_id="'+msg[key].number_id+'" curr="'+msg[key].curr+'" name="'+msg[key].name+'">'+msg[key].name+'</option>';
          }
        }
        // console.log(str_option);
        var str_select = '<select id="sel_project" class="main_sel" name="sel_project" transaction="income"><option class="project_empty" selected></option>'+str_option+'</select>';
        // console.log(str_select);
        $('.title_project').append(str_select);

        var str_select_transfer = '<select id="sel_project" name="sel_project" transaction="transfer"><option class="project_empty" selected></option>'+str_option+'</select>';
        $('.title_project').append(str_select_transfer);
        // створює select
        // створює select для edit
        // var str_select_edit = '<select id="sel_project_edit" name="sel_project_edit">'+str_option+'</select>';
        var str_select_edit = '<select id="sel_project" name="sel_project">'+str_option+'</select>';
        $('.title_project_edit').append(str_select);
        $('.title_project_edit').append(str_select_transfer);
        // створює select для edit
      }
    });
  }

  get_project_date_json();
  function get_project_date_json(){
    $.ajax({
      url:"/json/projects_date.json",
      success: function(data){
        // console.log(data);
        for (var key in data){
          operation_id = operation_id +1;
          
          var date = data[key];

          var date_id = data[key].number_id;
          // console.log(date_id);
          var description = data[key].description;

          var project_main = data[key].project_main;
          var category = data[key].category;
          var price = data[key].price;
          var curr_pay = data[key].curr_pay;
          var date_project = data[key].date;
          var name = data[key].name;
          var transaction = data[key].transaction;

          var cover_price_base =  data[key].cover_price_base;
          // console.log(cover_price_base);
          // console.log(typeof(cover_price_base));        
          
          // console.log(price_base);
          // var common_expense_base = data.cover_price_base.common_expense_base;
        
          

          var result_row = $('#refuge').find('.data-result-row').clone();
          var table_result_row = $('#refuge').find('.table-result-row').clone();
          // var html = '';
          // console.log(date);
          var html ='<div class="tablet-item project">'+name+'</div><div class="tablet-item description">'+description+'</div><div class="tablet-item project_main">'+project_main+'</div><div class="tablet-item category">'+category+'</div><div class="tablet-item cover_price"><span><span class="price">'+price+'</span> <span class="common-expense">'+curr_pay+'</span></span></div>';
          result_row.find('.main_table').html(html);
          table_result_row.find('.main_table').html(html);

          if (transaction == 'transfer') {
            // console.log('data[key].transaction');

            var number_id_second = data[key].number_id_second;
            result_row.find('.table-result-row').attr({number_id_second: number_id_second});

            var name_second = data[key].name_second;

            project_name_tran = 'C- '+name+' На- '+name_second+'';
            result_row.find('.table-result-row').attr({name_second: name_second});
            result_row.find('.project').text(project_name_tran);


            var from_project_main = data[key].from_project_main;
            var to_project_main = data[key].to_project_main;

            project_main_tran = 'C- '+from_project_main+' На- '+to_project_main+'';

            result_row.find('.project_main').text(project_main_tran).attr({from_project_main: from_project_main, to_project_main: to_project_main});
          }

          if (typeof cover_price_base !== "undefined") {
            // console.log('є -- cover_price_base');

            // console.log(cover_price_base);

            var price_base = cover_price_base.price_base;
            // console.log(price_base);

            var common_expense_base = cover_price_base.common_expense_base;
            // console.log(common_expense_base);
            var rate = cover_price_base.rate;
            var rev_rate = cover_price_base.rev_rate;

            result_row.find('.cover_price').append('<span class="cover_price_base" rate="'+rate+'" rev_rate="'+rev_rate+'"><span class="price_base">'+price_base+'</span> <span class="common-expense_base">'+common_expense_base+'</span></span>');
            table_result_row.find('.cover_price').append('<span class="cover_price_base" rate="'+rate+'" rev_rate="'+rev_rate+'"><span class="price_base">'+price_base+'</span> <span class="common-expense_base">'+common_expense_base+'</span></span>');
          
          }

          // if (data[key].cover_price_base.length() >= 0) {
          //   console.log('є -- cover_price_base');
          // }

          result_row.attr('date',date_project);
          result_row.find('.column-data span').html(date_project);

          var title_transaction;
          var color_transaction;
          if (transaction == 'income') {
            title_transaction = 'Доход';
            color_transaction = 'color_income';
          }else if (transaction == 'expence') {
            title_transaction = 'Розход';
            color_transaction = 'color_expence';
          }else if (transaction == 'transfer') {
            title_transaction = 'Перевод';
            color_transaction = 'color_transfer';
          }

          result_row.find('.cover_price').addClass(''+color_transaction+'');
          result_row.find('.table-result-row').attr({operation_id: operation_id, number_id: date_id, name: name, transaction: transaction, title: title_transaction}); //добавляє attr пректа
          result_row.find('#calendar_edit').val(date_project);
          result_row.find('#calendar_edit').attr('date',date_project);
          // $('#main_container_table').append(result_row);
          table_result_row.find('.cover_price').addClass(''+color_transaction+'');
          table_result_row.attr({operation_id: operation_id, number_id: date_id, name: name, transaction: transaction, title: title_transaction}); //добавляє attr пректа
          table_result_row.find('#calendar_edit').val(date_project);
          table_result_row.find('#calendar_edit').attr('date',date_project);

          if ($('#main_container_table').find('.data-result-row[date="'+date_project+'"]').length <= 0) {
            $('#main_container_table').prepend(result_row);
            // console.log('создаєм новий  row з датой якої немає');
          }else{
            $('#main_container_table').find('.data-result-row[date="'+date_project+'"] .cover_tab_project').prepend(table_result_row);
          }




        }
        filter_date();
        $('#main_container_table #calendar_edit').daterangepicker({
          locale: {
            format: 'MM-DD-YYYY'
          },
          // format:'DD/MM/YYYY',
          // "endDate": "04/09/2019",
          singleDatePicker: true
        });
        $('#main_container_table #calendar_edit').on('apply.daterangepicker', function(ev, picker) {
          $(this).attr('date',picker.endDate.format("MM-DD-YYYY"));
        });
      }
    });
  }

  $('header').on('click','.login',function(){
    $("#mymodal").show();
  });
  $('#mymodal').on('click','.close_popup',function(){
    $("#mymodal").hide();
  });
});

// получаєм всіх батьків елемента
function search_parent(id){
  var arr_parent = [];
  var par = projects[id].parent;
  while(par > 0){
    arr_parent.push(par);
    par = projects[par].parent;
  }
  return arr_parent;
}
// получаєм всіх батьків елемента

function filter_date(){
  var dates = [];
  $('#main_container_table .data-result-row').each(function() {
    var date_block = $(this).attr('date');
    dates.push(date_block); 
  });
  dates.sort().reverse();
  // console.log(dates);
  dates.forEach(function(item, i, arr) {
    var clone = $('#main_container_table').find('.data-result-row[date="'+item+'"]').clone();
    $('#main_container_table').find('.data-result-row[date="'+item+'"]').remove();
    $('#main_container_table').append(clone);
  });
}