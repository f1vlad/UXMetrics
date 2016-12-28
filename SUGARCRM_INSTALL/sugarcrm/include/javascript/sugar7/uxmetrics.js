/*
UXMetrics module, combines times for one user and all test types except 1
select sum(time), email_addr,name  from uxmetrics where type != '1' group by email_addr order by sum(time) desc;
*/

(function (app) {
    app.events.on("app:sync:complete", function() {
        $('footer .btn-toolbar .btn-group').prepend(window.UITEST.buttonTrigger);
        $('body').append(window.UITEST.remoteControll);
        window.UITEST.initTestList();
        $('.remote-control-spin').tooltip();
    }, this);
    app.events.on("app:login:success", this.render, this);

    var lib = {
        testAuto: false, // auto test will start automatically based on start|step html selector trigger
        testInProgress: false,
        testSubjectEmail: '', // used as unique ID
        testSubjectName: '',
        //testTasks: [['1','Create Lead'], ['2','Create Account'], ['3','Link Existing Record'], ['4','Create Opportunity'], ['5','Create and link record'], ['6','Create and save filter 1 - from List view'], ['7','Create and save filter 2 - from Detail view'], ['8','Mass update'], ['9','Convert Lead'] ],
        testTasks: [['1','Create Lead'], ['2','Convert Lead'], ['3','Create Opportunity'], ['4','Create Revenue Line Item'], ['5','Mass Update'], ['6','Merge 3 Accounts'], ['7','Create Dashlet'], ['8', 'Create and Save filter'], ['9','Include an Opportunity with 65% Probability in your Forecast and Commit']],
        testType: '',
        finalReport: '',
        beginTime: 0,
        endTime: 0,
        clicks: 0,
        clickTrip: '',
        clickedElements: '',
        beginTriger: 'convert_lead', // required for auto-start test
        endTrigger: '#lead-convert-success',  // required for auto-start test
        trace: [],
        result: [],
        buttonTrigger: '<a href="javascript:void(0);" class="uxmetrics-trigger btn btn-invisible no-track"><i class="icon-beaker"></i> UX Lab Test</sup></a>',
        buttonTriggerStop: '<a href="javascript:void(0);" data-test-id="" class="uxmetrics-trigger-stop no-track btn-primary btn"><i class="icon-stop"></i> Stop Test</sup></a>',
        eventsCapture: 'click change select2-opening select2-selecting select2-clearing select2-removing select2-removed select2-focus select2-blur',
        remoteControll: '\
\
<style>\
\
.uitest-remote-control-alt:before, .uitest-remote-control:before {content: "";display: inline-block;border-left: 7px solid transparent;border-right: 7px solid transparent;border-top: 7px solid #177de3;border-top-color: #177de3;position: absolute;bottom: -9px;right: 18px;}\
.uitest-remote-control-alt:after, .uitest-remote-control:after {content: "";display: inline-block;border-left: 7px solid transparent;border-right: 7px solid transparent;border-top: 7px solid #fff;border-top-color: #fff;position: absolute;bottom: -6px;right: 18px;}\
.uitest-remote-control-alt, .uitest-remote-control{ -webkit-transform-style: preserve-3d;height: 340px; z-index:10001;width:510px;position:fixed;bottom:-400px;right:1.5%;background:#fff;border-radius:6px; border:2px solid #177de3; box-shadow: 0px 0px 14px #aaa;}\
.uitest-remote-control-wrap-alt, .uitest-remote-control-wrap{padding:1em;height:316px;overflow:auto;}\
.uxmetrics-trigger.active {color: #58595b;}\
.uitest-remote-control-alt > .uitest-remote-control-wrap-alt > span:first-child, .uitest-remote-control > .uitest-remote-control-wrap > span:first-child {background-color: #e61718;color: #eee;padding: .05em .15em;border-radius: 3px;font-weight: 100;font-size: 16px;text-shadow: 1px 1px 1px rgba(0,0,0,.6); font-weight:100;}\
.uitest-remote-control-alt > .uitest-remote-control-wrap-alt > span:first-child {background: #177de3}\
.uitest-remote-control-alt > .uitest-remote-control-wrap-alt > span > strong, .uitest-remote-control > .uitest-remote-control-wrap > span > strong {padding-right: .05em;font-weight: 500;letter-spacing: -1px;color:#fff}\
.uitest-remote-control-alt hr, .uitest-remote-control hr {margin: 10px 0;}\
.uxmetrics-test-list li aside {display:none}\
.uxmetrics-test-list li sup {color:#ccc;font-weight:100}\
.uxmetrics-test-list li .result {position: absolute;right: 0;width: 90%;top: 1px;text-align: right;border-bottom: 2px dashed #f5f5f5;z-index:10;height:18px;}\
.uxmetrics-test-list li.done aside {display:inline-block;position: absolute;left:-32px;line-height: 1.25em;font-size:1.75em;color:rgba(0,129,0,.75);text-shadow:1px 1px 2px #ccc;-webkit-transform: rotate(-12deg);-moz-transform: rotate(-12deg);transform: rotate(-12deg);}\
.uxmetrics-test-list {font-size: 10px;position:relative;}\
.uxmetrics-test-list li {position:relative;}\
.hide.uxmetrics-trigger.btn.btn-invisible {display:none !important;}\
.btn.btn-mini.start {position:relative; z-index:11}\
.result_total {font-size:18px;font-weight:200px;}\
.result_total label {color:#ccc; }\
.result_total sup {color:#ccc; font-size:10px}\
.remote-control-spin {position: absolute;left: 0;bottom: 1em;}\
\
\
\
.uitest-remote-control.spin {\
  -webkit-animation : spinningH .25s linear;\
  -webkit-transform: rotateX(-12deg) rotateY(90deg);\
}\
\
@-webkit-keyframes spinningH {\
     0%   {-webkit-transform: rotateX(0deg) rotateY(0deg);}\
     100% {-webkit-transform: rotateX(-12deg) rotateY(90deg);}\
}\
\
\
.uitest-remote-control.unspin {\
  -webkit-animation : spinningh .5s linear;\
  -webkit-transform: rotateX(0deg) rotateY(0deg);\
}\
\
@-webkit-keyframes spinningh {\
     0% {-webkit-transform: rotateX(-12deg) rotateY(90deg);}\
     50% {-webkit-transform: rotateX(-12deg) rotateY(90deg);}\
     100%   {-webkit-transform: rotateX(0deg) rotateY(0deg);}\
}\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
.uitest-remote-control-alt {\
    -webkit-transform: rotateX(12deg) rotateY(90deg);\
}\
.uitest-remote-control-alt.spin {\
  -webkit-animation : spinningHH .5s linear;\
  -webkit-transform: rotateX(0deg) rotateY(0deg);\
}\
\
@-webkit-keyframes spinningHH {\
     0%   {-webkit-transform: rotateX(12deg) rotateY(90deg);}\
     50%   {-webkit-transform: rotateX(12deg) rotateY(90deg);}\
     100% {-webkit-transform: rotateX(0deg) rotateY(0deg);}\
}\
\
\
\
.uitest-remote-control-alt.unspin {\
  -webkit-animation : spinninghh .25s linear;\
  -webkit-transform: rotateX(12deg) rotateY(90deg);\
}\
\
@-webkit-keyframes spinninghh {\
     0% {-webkit-transform: rotateX(0deg) rotateY(0deg);}\
     100%   {-webkit-transform: rotateX(12deg) rotateY(90deg);}\
}\
\
\
\
\
\
\
\
\
\
</style>\
<div class="uitest-remote-control-alt">\
    <div class="uitest-remote-control-wrap-alt">\
    <span><strong>UX</strong>metrics</span> Information\
        <hr>\
        <p>Please enter your name and email address to start the test tool.</p>\
        <p>You can take the listed tests in any order &mdash; they do not have to be done sequentially. You can also resume tests later if you run out of time. Please note that the email address is the key used by the test tool to help you keep track of your scores.</p>\
        <p>Finally, timing of tests is calculated by the test tool: timing does not start until first click on screen, and stops one click before you press the stop test button.</p>\
        <a class="remote-control-spin icon-retweet btn btn-mini" href="javascript:void(0);" rel="tooltip" data-placement="top" title="Back to UXmetrics tests"></a>\
    </div>\
</div>\
<div class="uitest-remote-control">\
    <div class="uitest-remote-control-wrap">\
        <span><strong>UX</strong>metrics</span> Fill out to start: <input type="text" name="test-subject-name" value="" placeholder="Name" class="input-small"> <input type="text" name="test-subject-email" value="" placeholder="Email" class="input-small"><button class="btn btn-mini uxmetrics-authenticate">go</button>\
        <hr>\
        <ol class="uxmetrics-test-list">\
            <!--<em>Loading tests...</em>-->\
            <!--<li>Test name 1 <input type="button" class="btn start" value="start"><input type="button" disabled="disabled" class="btn btn-mini stop" value="stop"></li>\
            <li>Test name 2 <input type="button" class="btn start" value="start"><input type="button" disabled="disabled" class="btn stop" value="stop"></li>-->\
        </ol>\
        <hr>\
        <span class="result_total pull-right"><label></label>Total time: <num></num><sup></sup></span><br>\
        <a class="remote-control-spin icon-question-sign btn btn-mini" href="javascript:void(0);" rel="tooltip" data-placement="top" title="Information about UXMetrics"></a>\
    </div>\
</div>\
\
',
        start: function() {
            this.clicks = 0;
            this.beginTime = new Date().getTime();
            this.beginTestAlert();
            this.startClockUI();
            //this.testSubjectEmail = $(".uitest-remote-control input[name=test-subject-email]").val(),
            //this.testSubjectName = $(".uitest-remote-control input[name=test-subject-name]").val(),
            // we're already storing this on blur event
            // although it's best to store email in this function rather than on blur time. but sometimes here is the bug when email ends up being either
            // empty or from previous tester
            this.testSubjectMachine = screen.width + 'x' + screen.height + ', ' + navigator.userAgent.toLowerCase(); // TODO: detect if user changed browser resolution
            this.testInProgress = true;
            $('footer .btn-toolbar').append(this.buttonTriggerStop).find('.uxmetrics-trigger-stop').attr('data-test-id', this.testType);
            $(window).on('beforeunload.uxmetrics', function() { return "Warning: UXMetrics test in progress, are you sure you want to navigate away? This will cancel the test.";});
        },
        end: function() {
            if(this.clicks === 0 || this.clicks ===1) { /* user didn't click anything and decided to stop test */
                this.initTestListRecheck();
                this.testInProgress = false;
                app.alert.show('uxmetrics-alert-info', {messages: 'You cancelled a test.', level: 'warning', autoClose: true});
                return false;
            }
            this.endTime = new Date().getTime();
            this.showResults();
            //this.trace.push({result:this.testSubjectName + ' â€”Â ' + this.testSubjectMachine + ', ' + this.lapTime() + ' seconds, ' + this.clicks + ' clicks'});
            this.result.push({result:this.testSubjectName + ', ' + this.testSubjectMachine + ', ' + this.lapTime() + ' seconds, ' + this.clicks + ' clicks'});
            this.finalReport = this.trace;
            app.api.records('create', 'UXMetrics', null, {
                email_addr: this.testSubjectEmail,
                name: this.testSubjectName,
                type: this.testType,
                clicks: this.clicks,
                click_trip: this.clickTrip,
                clicked_elements: this.clickedElements,
                time: this.lapTime()
            }, {
                success: function(data) {
                    //console.log(data);
                    ui.initTestListRecheck();
                    ui.trace = [];
                },
                error: function() {
                    app.alert.show('uxmetrics-error-info', {messages: 'Error saving your test results, please seek assistance', level: 'error'});
                }
            });
            this.beginTime = this.endTime = this.clicks = 0;
            this.clickedElements = this.clickTrip = '';
            this.testInProgress = false;
            $(window).off('beforeunload.uxmetrics');
        },
        startClockUI: function() {
            //setInterval(function(){console.log('f')}, 3000)
            // use this to make ticker
        },
        initTestList: function() {
            $('.uxmetrics-test-list').empty();
            for (i = 0; i< this.testTasks.length; i++) {
                $('.uxmetrics-test-list')
                    .append('<li id="type-' + this.testTasks[i][0] + '"><aside>&#10004;</aside>\
                        <input type="hidden" name="test-type" value="' + this.testTasks[i][0] + '">\
                        <input type="button" class="btn btn-mini start no-track" disabled="disabled" value="' + this.testTasks[i][1] + '">\
                        <input type="button" disabled="disabled" class="hide btn btn-mini stop" value="stop">\
                        <span class="result"></span></li>')
                    .find('em').first().addClass('hide');
            }
        },
        initTestListRecheck: function () { /* here we check which tests user has already passed, to prevent repetitive test taking */
            app.api.records('read', 'UXMetrics', null, {
                filter: [
                    {email_addr: this.testSubjectEmail },
                ]
            }, {
                success: function(data) {
                    $('ol.uxmetrics-test-list li').removeClass('done').find('.btn.start').removeAttr('disabled').siblings('span.result').empty();
                    var resultTotalTime = 0,
                        resultTotalClicks = 0;
                    for (i = 0; i < data['records'].length; i++) {
                        $('li#type-' + data['records'][i]['type']).addClass('done')
                            .find('.btn.start').attr('disabled', 'disabled').
                            siblings('span.result').append(data['records'][i]['time'] + 's<sup>' + data['records'][i]['clicks'] + 'c</sup>');
                        resultTotalTime = resultTotalTime + (data['records'][i]['time'] * 1);
                        resultTotalClicks = resultTotalClicks + (data['records'][i]['clicks'] * 1);
                    }
                    $('.result_total num').empty().prepend(resultTotalTime.toFixed(2) + ' seconds').next('sup').empty().prepend(resultTotalClicks + ' clicks');
                },
                error: function() {
                    app.alert.show('uxmetrics-error-info', {messages: 'Fatal error.', level: 'error'});
                }
            });
        },
        lapTime: function() {
            return (this.trace[this.trace.length - 1].timestamp - this.trace[0].timestamp) / 1000;
        },
        beginTestAlert: function() {
            app.alert.show('uxmetrics-alert-info', {messages: 'You entered a test zone', level: 'success', autoClose: true});
        },
        showResults: function() {
            app.alert.show('uxmetrics-success-info', {messages: 'Test has been completed. It took you ' + this.lapTime() + ' seconds and ' + this.clicks + ' clicks to complete this task', level: "success", autoClose: true});
        }
    };
    window.UITEST = lib;

    var ui = window.UITEST;
    var logEvent = true;
    if(ui.testAuto === true) {
        /* TODO: Restrict clicks to $(#sidecar *) perhaps? */
        $('#sidecar').bind('click', '*', function(e){
            ($(e)[0]['target']['className'] === ui.beginTriger) ? ui.start() : false;
            ($(ui.endTrigger).length === 1) ? ui.end() : false;
            if(ui.testInProgress === true) {
                ui.clicks += 1;
                ui.trace.push({timestamp: new Date().getTime(), coordinates: e.pageX + ',' + e.pageY});
            }
        });
    } else {
        $('#sidecar').bind(ui.eventsCapture, '*', function(e){

            // here we detect current and previous event kind, if it's select2 related and under 300 milliseconds
            // we ignore current one, select2 triggers too many events with one click. We want to capture only the click
            if(ui.trace.length > 1){
                var prevEvent = ui.trace[ui.trace.length - 1];
                //console.log("previous event:" + prevEvent);
                if ((e.type.substring(0, 7) == "select2" || e.type == "change") &&
                    prevEvent.eventType.substring(0, 7) == "select2" &&
                    (new Date().getTime() - prevEvent.timestamp) < 300
                    ) {
                        logEvent = false;
                }
            }
            if($(e.target).hasClass('no-track')===false && ui.testInProgress===true && logEvent === true) {
                console.log('logged' + " " + ui.testInProgress + " event:" + e.type);
                ui.clicks += 1;
                ui.clickTrip = ui.clickTrip + e.clientX + "x" + e.clientY + "|";
                ui.clickedElements = ui.clickedElements + e.target.className + "|";
                ui.trace.push({timestamp: new Date().getTime(), coordinates: e.pageX + ',' + e.pageY, eventType: e.type});
            } else {
                logEvent = true;
            }
        });
        $('.uitest-remote-control .uxmetrics-test-list .btn:not(.disabled)').live('click', function(e){
            if(ui.testInProgress===true) {
                app.alert.show('uxmetrics-alert-info', {messages: 'You cannot start two tests simultaneously.', level: 'error', autoClose: true});
                return;
            }
            if($(this).hasClass('start') === true) {
                ui.testType = $(this).prev().attr('value');
                ui.start();
                $(this).attr('disabled','disabled').next().removeAttr('disabled').parent().find('.auto-manual-toggle').attr('disabled','disabled');
                $('.uxmetrics-trigger').trigger('click');
            } else if ($(this).hasClass('stop') === true) {
                ui.end();
                $(this).attr('disabled','disabled').prev().removeAttr('disabled').parent().find('.auto-manual-toggle').removeAttr('disabled');
            }

        });
        $('.uxmetrics-trigger-stop').live('click', function(){
            ui.end();
            $('li#type-' + $(this).attr('data-test-id')).find('.stop').attr('disabled', 'disabled').parent().find('.auto-manual-toggle').removeAttr('disabled');
            $(this).remove();
            $('.uxmetrics-trigger').trigger('click');
        });
        $('input[name=test-subject-email]').live('blur change', function(e){ // authenticate user
            if($(this).val().length > 0) {
                ui.testSubjectEmail = $(this).val();
                ui.testSubjectName = $('.uitest-remote-control [name=test-subject-name]').val();
                ui.initTestListRecheck();
            }
        });
    }

    $('.uxmetrics-trigger').live('click', function(){
        ($('.uitest-remote-control, .uitest-remote-control-alt').hasClass('visible')===true) ? $('.uitest-remote-control, .uitest-remote-control-alt').removeClass('visible').animate({'bottom':'-400px', 'opacity':'.075'},200).siblings('#sugarcrm').find('.uxmetrics-trigger').removeClass('active') : $('.uitest-remote-control, .uitest-remote-control-alt').addClass('visible').animate({'bottom': '40px', 'opacity':'1' },200).siblings('#sugarcrm').find('.uxmetrics-trigger, .uitest-remote-control-alt').addClass('active');
        return false;
    });

    $('.auto-manual-toggle').live('click', function(){
        if($(this).hasClass('manual') === true) {
            $(this).removeClass('manual').addClass('auto btn-primary').attr('value', 'auto on');
            $(this).parent().find('.start').attr('disabled','disabled');
            ui.testAuto = true;
        } else if($(this).hasClass('auto') === true) {
            $(this).removeClass('auto btn-primary').addClass('manual').attr('value', 'auto off');
            $(this).parent().find('.start').removeAttr('disabled');
            ui.testAuto = false;
        }
    });
    $('.remote-control-spin').live('click', function(e){
        if($('.uitest-remote-control').hasClass('spin')===true) {
            $('.uitest-remote-control, .uitest-remote-control-alt').addClass('unspin');
            setTimeout(function(){
                $('.uitest-remote-control, .uitest-remote-control-alt').removeClass('spin unspin');
            }, 1200);
        } else if ($('.uitest-remote-cotnrol').hasClass('spin')===true && $('.uitest-remote-cotnrol').hasClass('unspin')===true) {
            $('.uitest-remote-control, .uitest-remote-control-alt').removeClass('spin unspin');
        } else {
            $('.uitest-remote-control, .uitest-remote-control-alt').addClass('spin');

        }
    });
})(SUGAR.App);
