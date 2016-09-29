"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var my_date_range_picker_date_range_validator_service_1 = require('./services/my-date-range-picker.date.range.validator.service');
var MyDateRangePicker = (function () {
    function MyDateRangePicker(elem, dateValidatorRangeService) {
        var _this = this;
        this.elem = elem;
        this.dateValidatorRangeService = dateValidatorRangeService;
        this.dateRangeChanged = new core_1.EventEmitter();
        this.showSelector = false;
        this.visibleMonth = { monthTxt: '', monthNbr: 0, year: 0 };
        this.weekDays = [];
        this.dates = [];
        this.selectionDayTxt = '';
        this.invalidDateRange = false;
        this.dateRangeFormat = '';
        this.dayIdx = 0;
        this.today = null;
        this.PREV_MONTH = 1;
        this.CURR_MONTH = 2;
        this.NEXT_MONTH = 3;
        this.isBeginDate = true;
        this.beginDate = { year: 0, month: 0, day: 0 };
        this.endDate = { year: 0, month: 0, day: 0 };
        this.disableUntil = { year: 0, month: 0, day: 0 };
        this.disableSince = { year: 0, month: 0, day: 0 };
        this.dayLabels = { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' };
        this.monthLabels = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
        this.dateFormat = 'yyyy-mm-dd';
        this.clearBtnTxt = 'Clear';
        this.beginDateBtnTxt = 'Begin Date';
        this.endDateBtnTxt = 'End Date';
        this.acceptBtnTxt = 'Accept';
        this.selectBeginDateTxt = 'Select Begin Date';
        this.selectEndDateTxt = 'Select End Date';
        this.firstDayOfWeek = 'mo';
        this.sunHighlight = true;
        this.height = '34px';
        this.width = '262px';
        this.inline = false;
        this.selectionTxtFontSize = '16px';
        this.alignSelectorRight = false;
        this.indicateInvalidDateRange = true;
        this.showDateRangeFormatPlaceholder = false;
        this.today = new Date();
        var doc = document.getElementsByTagName('html')[0];
        doc.addEventListener('click', function (event) {
            if (_this.showSelector && event.target && _this.elem.nativeElement !== event.target && !_this.elem.nativeElement.contains(event.target)) {
                _this.showSelector = false;
            }
        }, false);
    }
    MyDateRangePicker.prototype.setOptions = function () {
        var options = ['dayLabels', 'monthLabels', 'dateFormat', 'clearBtnTxt', 'beginDateBtnTxt', 'endDateBtnTxt', 'acceptBtnTxt', 'selectBeginDateTxt', 'selectEndDateTxt', 'firstDayOfWeek', 'sunHighlight', 'height', 'width', 'inline', 'selectionTxtFontSize', 'alignSelectorRight', 'indicateInvalidDateRange', 'showDateRangeFormatPlaceholder'];
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var prop = options_1[_i];
            if (this.options && (this.options)[prop] !== undefined && (this.options)[prop] instanceof Object) {
                (this)[prop] = JSON.parse(JSON.stringify((this.options)[prop]));
            }
            else if (this.options && (this.options)[prop] !== undefined) {
                (this)[prop] = (this.options)[prop];
            }
        }
    };
    MyDateRangePicker.prototype.userDateRangeInput = function (event) {
        this.invalidDateRange = false;
        if (event.target.value.length === 0) {
            this.removeBtnClicked();
        }
        else {
            var daterange = this.dateValidatorRangeService.isDateRangeValid(event.target.value, this.dateFormat);
            if (daterange.beginDate.day !== 0 && daterange.beginDate.month !== 0 && daterange.beginDate.year !== 0
                && daterange.endDate.day !== 0 && daterange.endDate.month !== 0 && daterange.endDate.year !== 0) {
                this.beginDate = daterange.beginDate;
                this.endDate = daterange.endDate;
                this.rangeSelected();
            }
            else {
                this.invalidDateRange = true;
            }
        }
    };
    MyDateRangePicker.prototype.parseOptions = function () {
        this.setOptions();
        var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.dayIdx = days.indexOf(this.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            var idx = this.dayIdx;
            for (var i = 0; i < days.length; i++) {
                this.weekDays.push(this.dayLabels[days[idx]]);
                idx = days[idx] === 'sa' ? 0 : idx + 1;
            }
        }
        if (this.inline) {
            this.openBtnClicked();
        }
    };
    MyDateRangePicker.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('selDateRange')) {
            this.selectionDayTxt = changes['selDateRange'].currentValue;
            var split = this.selectionDayTxt.split(' - ');
            if (split.length === 2 && split[0].length === 10 && split[1].length === 10) {
                this.beginDate = this.parseDate(split[0]);
                this.endDate = this.parseDate(split[1]);
                this.toBeginDate();
            }
        }
        else {
            this.clearBtnClicked();
        }
        if (changes.hasOwnProperty('options')) {
            this.options = changes['options'].currentValue;
            this.weekDays.length = 0;
            this.parseOptions();
            this.dateRangeFormat = this.dateFormat + ' - ' + this.dateFormat;
        }
    };
    MyDateRangePicker.prototype.removeBtnClicked = function () {
        this.clearBtnClicked();
        this.dateRangeChanged.emit({ beginDate: {}, endDate: {}, formatted: '', beginEpoc: 0, endEpoc: 0 });
        this.invalidDateRange = false;
    };
    MyDateRangePicker.prototype.openBtnClicked = function () {
        this.showSelector = !this.showSelector;
        if (this.showSelector || this.inline) {
            this.isBeginDate = true;
            if (this.beginDate.year !== 0 && this.beginDate.month !== 0 && this.beginDate.day !== 0) {
                this.toBeginDate();
            }
            else {
                var y = this.today.getFullYear();
                var m = this.today.getMonth() + 1;
                this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, year: y };
                this.generateCalendar(m, y);
            }
        }
    };
    MyDateRangePicker.prototype.prevMonth = function () {
        var m = this.visibleMonth.monthNbr;
        var y = this.visibleMonth.year;
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y);
    };
    MyDateRangePicker.prototype.nextMonth = function () {
        var m = this.visibleMonth.monthNbr;
        var y = this.visibleMonth.year;
        if (m === 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y);
    };
    MyDateRangePicker.prototype.prevYear = function () {
        this.visibleMonth.year--;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDateRangePicker.prototype.nextYear = function () {
        this.visibleMonth.year++;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDateRangePicker.prototype.clearBtnClicked = function () {
        this.isBeginDate = true;
        this.selectionDayTxt = '';
        this.beginDate = { year: 0, month: 0, day: 0 };
        this.endDate = { year: 0, month: 0, day: 0 };
        this.disableSince = { year: 0, month: 0, day: 0 };
        this.disableUntil = { year: 0, month: 0, day: 0 };
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDateRangePicker.prototype.cellClicked = function (cell) {
        if (this.isBeginDate) {
            this.beginDate = cell.dateObj;
        }
        else {
            this.endDate = cell.dateObj;
        }
    };
    MyDateRangePicker.prototype.toEndDate = function () {
        this.isBeginDate = false;
        this.disableSince = { year: 0, month: 0, day: 0 };
        this.disableUntil = this.getPreviousDate(this.beginDate);
        if (this.endDate.year === 0 && this.endDate.month === 0 && this.endDate.day === 0) {
            this.visibleMonth = { monthTxt: this.monthText(this.beginDate.month), monthNbr: this.beginDate.month, year: this.beginDate.year };
            this.generateCalendar(this.beginDate.month, this.beginDate.year);
        }
        else {
            this.visibleMonth = { monthTxt: this.monthText(this.endDate.month), monthNbr: this.endDate.month, year: this.endDate.year };
            this.generateCalendar(this.endDate.month, this.endDate.year);
        }
    };
    MyDateRangePicker.prototype.toBeginDate = function () {
        this.isBeginDate = true;
        this.disableUntil = { year: 0, month: 0, day: 0 };
        this.disableSince = this.getNextDate(this.endDate);
        this.visibleMonth = { monthTxt: this.monthText(this.beginDate.month), monthNbr: this.beginDate.month, year: this.beginDate.year };
        this.generateCalendar(this.beginDate.month, this.beginDate.year);
    };
    MyDateRangePicker.prototype.rangeSelected = function () {
        var begin = this.formatDate(this.beginDate);
        var end = this.formatDate(this.endDate);
        this.selectionDayTxt = begin + ' - ' + end;
        this.showSelector = false;
        var beginEpoc = this.getTimeInMilliseconds(this.beginDate) / 1000.0;
        var endEpoc = this.getTimeInMilliseconds(this.endDate) / 1000.0;
        this.dateRangeChanged.emit({ beginDate: this.beginDate, endDate: this.endDate, formatted: this.selectionDayTxt, beginEpoc: beginEpoc, endEpoc: endEpoc });
        this.invalidDateRange = false;
    };
    MyDateRangePicker.prototype.isInRange = function (val) {
        if (this.beginDate.year === 0 && this.beginDate.month === 0 && this.beginDate.day === 0 || this.endDate.year === 0 && this.endDate.month === 0 && this.endDate.day === 0) {
            return false;
        }
        var input = this.getTimeInMilliseconds(val.dateObj);
        var begin = this.getTimeInMilliseconds(this.beginDate);
        var end = this.getTimeInMilliseconds(this.endDate);
        if (input >= begin && input <= end) {
            return true;
        }
        return false;
    };
    MyDateRangePicker.prototype.isRangeSelected = function () {
        if (this.beginDate.year !== 0 && this.beginDate.month !== 0 && this.beginDate.day !== 0 && this.endDate.year !== 0 && this.endDate.month !== 0 && this.endDate.day !== 0) {
            return true;
        }
        return false;
    };
    MyDateRangePicker.prototype.preZero = function (val) {
        return parseInt(val) < 10 ? '0' + val : val;
    };
    MyDateRangePicker.prototype.formatDate = function (val) {
        return this.dateFormat.replace('yyyy', val.year).replace('mm', this.preZero(val.month)).replace('dd', this.preZero(val.day));
    };
    MyDateRangePicker.prototype.monthText = function (m) {
        return this.monthLabels[m];
    };
    MyDateRangePicker.prototype.monthStartIdx = function (y, m) {
        var d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        var idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    };
    MyDateRangePicker.prototype.daysInMonth = function (m, y) {
        return new Date(y, m, 0).getDate();
    };
    MyDateRangePicker.prototype.daysInPrevMonth = function (m, y) {
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        return this.daysInMonth(m, y);
    };
    MyDateRangePicker.prototype.isCurrDay = function (d, m, y, cmo) {
        return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
    };
    MyDateRangePicker.prototype.isDisabledDay = function (date) {
        var givenDate = this.getTimeInMilliseconds(date);
        if (this.disableUntil.year !== 0 && this.disableUntil.month !== 0 && this.disableUntil.day !== 0 && givenDate <= this.getTimeInMilliseconds(this.disableUntil)) {
            return true;
        }
        if (this.disableSince.year !== 0 && this.disableSince.month !== 0 && this.disableSince.day !== 0 && givenDate >= this.getTimeInMilliseconds(this.disableSince)) {
            return true;
        }
        return false;
    };
    MyDateRangePicker.prototype.getPreviousDate = function (date) {
        var d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() - 1);
        return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    };
    MyDateRangePicker.prototype.getNextDate = function (date) {
        var d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() + 1);
        return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    };
    MyDateRangePicker.prototype.getTimeInMilliseconds = function (date) {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime();
    };
    MyDateRangePicker.prototype.getDayNumber = function (date) {
        var d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        return d.getDay();
    };
    MyDateRangePicker.prototype.sundayIdx = function () {
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    };
    MyDateRangePicker.prototype.generateCalendar = function (m, y) {
        this.dates.length = 0;
        var monthStart = this.monthStartIdx(y, m);
        var dInThisM = this.daysInMonth(m, y);
        var dInPrevM = this.daysInPrevMonth(m, y);
        var dayNbr = 1;
        var cmo = this.PREV_MONTH;
        for (var i = 1; i < 7; i++) {
            var week = [];
            if (i === 1) {
                var pm = dInPrevM - monthStart + 1;
                for (var j = pm; j <= dInPrevM; j++) {
                    var date = { year: y, month: m - 1, day: j };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(j, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                }
                cmo = this.CURR_MONTH;
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    var date = { year: y, month: m, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            }
            else {
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
                    }
                    var date = { year: y, month: cmo === this.CURR_MONTH ? m : m + 1, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            }
            this.dates.push(week);
        }
    };
    MyDateRangePicker.prototype.parseDate = function (ds) {
        var date = { day: 0, month: 0, year: 0 };
        if (ds !== '') {
            var fmt = this.options && this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
            var dpos = fmt.indexOf('dd');
            if (dpos >= 0) {
                date.day = parseInt(ds.substring(dpos, dpos + 2));
            }
            var mpos = fmt.indexOf('mm');
            if (mpos >= 0) {
                date.month = parseInt(ds.substring(mpos, mpos + 2));
            }
            var ypos = fmt.indexOf('yyyy');
            if (ypos >= 0) {
                date.year = parseInt(ds.substring(ypos, ypos + 4));
            }
        }
        return date;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MyDateRangePicker.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyDateRangePicker.prototype, "selDateRange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MyDateRangePicker.prototype, "dateRangeChanged", void 0);
    MyDateRangePicker = __decorate([
        core_1.Component({
            selector: 'my-date-range-picker',
            styles: [".mydrp{min-width:100px;border-radius:2px;line-height:1.1;display:inline-block;position:relative}.mydrp *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;padding:0;margin:0}.mydrp .selector{margin-top:2px;margin-left:-1px;position:absolute;width:262px;padding:3px;border-radius:2px;background-color:#DDD;z-index:100}.mydrp .alignselectorright{right:-1px}.mydrp .selectiongroup{position:relative;display:table;border:none;background-color:#FFF}.mydrp .selection{background-color:#FFF;display:table-cell;position:absolute;width:100%;font-size:14px;font-weight:700;padding:0 64px 0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}.mydrp .invaliddaterange{background-color:#F1DEDE}.mydrp ::-ms-clear{display:none}.mydrp .headerbtn,.mydrp .selbtngroup{display:table-cell;vertical-align:middle}.mydrp .selbtngroup{position:relative;white-space:nowrap;width:1%;text-align:right;font-size:0}.mydrp .btnclear,.mydrp .btnpicker{height:100%;width:30px;border:none;border-left:1px solid #AAA;padding:0;cursor:pointer;outline:0;font:inherit;-moz-user-select:none}.mydrp .btnclear,.mydrp .btnpicker,.mydrp .footerbtn,.mydrp .headerclearbtn{background:#FFF}.mydrp .header{width:100%;height:34px;margin-bottom:1px;background-color:#FAFAFA}.mydrp .header td{vertical-align:middle;border:none}.mydrp .currday div,.mydrp .selectedday{border:1px solid #004198}.mydrp .header td:nth-child(1){font-size:16px;padding-left:4px}.mydrp .header td:nth-child(2){text-align:center}.mydrp .header td:nth-child(3){font-size:16px;padding-right:4px}.mydrp .titlearea{text-align:center;background-color:#FFF;margin-bottom:4px}.mydrp .titleareatxt{height:26px;line-height:26px;font-size:12px;font-weight:700}.mydrp .inline{position:relative}.mydrp .caltable{table-layout:fixed;width:100%;background-color:#FFF;font-size:14px}.mydrp .caltable,.mydrp .caltable td,.mydrp .caltable th{border-collapse:collapse;color:#036;line-height:1.1}.mydrp .caltable td,.mydrp .caltable th{padding:5px;text-align:center}.mydrp .caltable th{background-color:#DDD;font-size:12px;vertical-align:middle}.mydrp .caltable td{cursor:pointer;font-weight:700;height:30px}.mydrp .nextmonth,.mydrp .prevmonth{color:#444}.mydrp .disabled{cursor:default!important;color:#444!important;background:#FFEBE6!important}.mydrp .sunday{color:#C30000}.mydrp .sundayDim{opacity:.5}.mydrp .currmonth{background-color:#F6F6F6;font-weight:700}.mydrp .range{background:#D9F2E6}.mydrp .selectedday{background-color:#8EBFFF!important;border-radius:0}.mydrp .selecteddaygreen{background-color:#28A828!important}.mydrp .selectmenu{height:24px;width:60px}.mydrp .headerbtn{background-color:#FAFAFA;cursor:pointer}.mydrp,.mydrp .caltable tbody,.mydrp .footerarea,.mydrp .footerbtn,.mydrp .header,.mydrp .headerclearbtn,.mydrp .selector,.mydrp .table,.mydrp .table td,.mydrp .table th,.mydrp .titlearea{border:1px solid #AAA}.mydrp .btnclear,.mydrp .btnpicker,.mydrp .footerbtn,.mydrp .headerbtn,.mydrp .headerclearbtn,.mydrp .headermonthtxt,.mydrp .headeryeartxt,.mydrp .selection{color:#000}.mydrp .footerbtn,.mydrp .headerclearbtn{padding:4px;border-radius:2px;cursor:pointer;font-size:11px;min-width:60px}.mydrp .headerclearbtn{min-width:60px}.mydrp .footerbtn{min-width:80px}.mydrp .btndisable{cursor:default;opacity:.5}.mydrp .footerarea{margin-top:4px;padding:3px;text-align:center;background-color:#FAFAFA}.mydrp button::-moz-focus-inner{border:0}.mydrp .headermonthtxt,.mydrp .headeryeartxt{min-width:40px;text-align:center;display:table-cell;vertical-align:middle;font-size:14px}.mydrp .headermonthtxt span,.mydrp .headeryeartxt span{vertical-align:middle}.mydrp .btnclear:focus,.mydrp .btnpicker:focus{background:#ADD8E6}.mydrp .icon-calendar,.mydrp .icon-cross{font-size:16px}.mydrp .icon-left,.mydrp .icon-right{color:#222;font-size:16px;vertical-align:middle}.mydrp table{display:table}.mydrp table td{padding:0}.mydrp .btnclear:hover,.mydrp .btnpicker:hover,.mydrp .caltable tbody tr td:hover,.mydrp .footerbtn:hover,.mydrp .headerclearbtn:hover{background-color:#8BDAF4}.mydrp .headerbtn span:hover{color:#8BDAF4}@font-face{font-family:mydaterangepicker;src:url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SAssAAAC8AAAAYGNtYXDMUczTAAABHAAAAGxnYXNwAAAAEAAAAYgAAAAIZ2x5ZmFQ1q4AAAGQAAABbGhlYWQGZuTFAAAC/AAAADZoaGVhB4IDyQAAAzQAAAAkaG10eBYAAnAAAANYAAAAIGxvY2EBdAE0AAADeAAAABJtYXhwABUAPgAAA4wAAAAgbmFtZQ5R9RkAAAOsAAABnnBvc3QAAwAAAAAFTAAAACAAAwOaAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADmBwPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAUAAAABAAEAADAAAAAQAg5gDmAuYF5gf//f//AAAAAAAg5gDmAuYF5gf//f//AAH/4xoEGgMaARoAAAMAAQAAAAAAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAAMAEAAAAPAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2ADsAABMRMxEjFyE1IRUDITUhFQERMxEjJRUzNSMTFTM1IzMVMzUjMxUzNSMBFTM1IzMVMzUjMxUzNSMTFTM1I0Bzc0ADAP0AQAOA/IADDXNz/ZOAgCCAgMCAgMCAgP6AgIDAgIDAgIAggIADAP1AAsBzc3P9c3NzAwD9QALAgMDA/sCAgICAgID/AICAgICAgAJAwMAAAAAAAgBwADADkANQAAQACQAANwEnARcDATcBB+kCp3n9WXl5Aqd5/Vl5MAKnef1ZeQKn/Vl5Aqd5AAABAOAAAAMgA4AAAwAAAQMBJQMgA/3DASADgPyAAcPfAAEA4AAAAyADgAADAAA3EwEF4AMCPf7gAAOA/j3fAAAAAQAAAAEAAF0/BsNfDzz1AAsEAAAAAADRxFAkAAAAANHEUCQAAAAAA8ADgAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAADwAABAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAAAAAAAIAAAAEAABABAAAcAQAAOAEAADgAAAAAAAKABQAHgB6AJYApgC2AAAAAQAAAAgAPAAMAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAkAAAABAAAAAAACAAcAcgABAAAAAAADAAkAPAABAAAAAAAEAAkAhwABAAAAAAAFAAsAGwABAAAAAAAGAAkAVwABAAAAAAAKABoAogADAAEECQABABIACQADAAEECQACAA4AeQADAAEECQADABIARQADAAEECQAEABIAkAADAAEECQAFABYAJgADAAEECQAGABIAYAADAAEECQAKADQAvHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclJlZ3VsYXIAUgBlAGcAdQBsAGEAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAckZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=) format('truetype');font-weight:400;font-style:normal}.mydrp .icon{font-family:mydaterangepicker;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.mydrp .icon-calendar:before{content:\"\\e600\"}.mydrp .icon-cross:before{content:\"\\e602\"}.mydrp .icon-left:before{content:\"\\e605\"}.mydrp .icon-right:before{content:\"\\e607\"}"],
            template: "<div class=\"mydrp\" [ngStyle]=\"{'height': height, 'width': width, 'border': inline ? 'none' : '1px solid #AAA'}\"><div class=\"selectiongroup\" *ngIf=\"!inline\"><input type=\"text\" class=\"selection\" maxlength=\"23\" [ngClass]=\"{'invaliddaterange': invalidDateRange&&indicateInvalidDateRange}\" placeholder=\"{{showDateRangeFormatPlaceholder?dateRangeFormat:''}}\" [ngStyle]=\"{'height': height, 'line-height': height, 'font-size': selectionTxtFontSize, 'border': 'none', 'padding-right': selectionDayTxt.length>0 ? '60px' : '30px'}\" (keyup)=\"userDateRangeInput($event)\" [value]=\"selectionDayTxt\"> <span class=\"selbtngroup\" [style.height]=\"height\"><button type=\"button\" class=\"btnclear\" *ngIf=\"selectionDayTxt.length>0\" (click)=\"removeBtnClicked()\"><span class=\"icon icon-cross\" [ngStyle]=\"{'line-height': height}\"></span></button> <button type=\"button\" class=\"btnpicker\" (click)=\"openBtnClicked()\"><span class=\"icon icon-calendar\" [ngStyle]=\"{'line-height': height}\"></span></button></span></div><div class=\"selector\" *ngIf=\"showSelector||inline\" [ngClass]=\"{'inline': inline, 'alignselectorright': alignSelectorRight}\"><div class=\"titlearea\"><div class=\"titleareatxt\">{{isBeginDate?selectBeginDateTxt:selectEndDateTxt}}</div></div><table class=\"header\"><tr><td><div style=\"float:left\"><div class=\"headerbtn\" (click)=\"prevMonth()\"><span class=\"icon icon-left\"></span></div><div class=\"headermonthtxt\"><span>{{visibleMonth.monthTxt}}</span></div><div class=\"headerbtn\" (click)=\"nextMonth()\"><span class=\"icon icon-right\"></span></div></div></td><td><button type=\"button\" class=\"headerclearbtn\" [disabled]=\"beginDate.year===0&&endDate.year===0\" [ngClass]=\"{'btndisable':beginDate.year===0&&endDate.year===0}\" (click)=\"clearBtnClicked()\">{{clearBtnTxt}}</button></td><td><div style=\"float:right\"><div class=\"headerbtn\" (click)=\"prevYear()\"><span class=\"icon icon-left\"></span></div><div class=\"headeryeartxt\"><span>{{visibleMonth.year}}</span></div><div class=\"headerbtn\" (click)=\"nextYear()\"><span class=\"icon icon-right\"></span></div></div></td></tr></table><table class=\"caltable\"><thead><tr><th *ngFor=\"let d of weekDays\">{{d}}</th></tr></thead><tbody><tr *ngFor=\"let w of dates\"><td *ngFor=\"let d of w\" [ngClass]=\"{'currmonth':d.cmo===CURR_MONTH&&!d.disabled, 'currday':d.currDay,\n                    'range': isInRange(d),\n                    'disabled': d.disabled}\" (click)=\"$event.stopPropagation(); !d.disabled && cellClicked(d)\"><div style=\"background-color:inherit\" [ngClass]=\"{'prevmonth':d.cmo===PREV_MONTH,\n                        'selectedday':beginDate.day===d.dateObj.day&&beginDate.month===d.dateObj.month&&beginDate.year===d.dateObj.year||endDate.day===d.dateObj.day&&endDate.month===d.dateObj.month&&endDate.year===d.dateObj.year,\n                        'currmonth':d.cmo===CURR_MONTH,\n                        'nextmonth':d.cmo===NEXT_MONTH,\n                        'selecteddaygreen':beginDate.day===d.dateObj.day&&beginDate.month===d.dateObj.month&&beginDate.year===d.dateObj.year&&isBeginDate&&isRangeSelected()||endDate.day===d.dateObj.day&&endDate.month===d.dateObj.month&&endDate.year===d.dateObj.year&&!isBeginDate&&isRangeSelected(),\n                        'sunday':d.dayNbr===0&&sunHighlight}\"><span [ngClass]=\"{'sundayDim': sunHighlight && d.dayNbr === 0 && (d.cmo===PREV_MONTH || d.cmo===NEXT_MONTH || d.disabled)}\">{{d.dateObj.day}}</span></div></td></tr></tbody></table><div class=\"footerarea\"><button type=\"button\" class=\"footerbtn\" *ngIf=\"isBeginDate\" [disabled]=\"beginDate.year===0\" [ngClass]=\"{'btndisable':beginDate.year===0}\" (click)=\"$event.stopPropagation();toEndDate($event)\">{{endDateBtnTxt}}</button> <button type=\"button\" class=\"footerbtn\" *ngIf=\"!isBeginDate\" (click)=\"$event.stopPropagation();toBeginDate($event)\">{{beginDateBtnTxt}}</button> <button type=\"button\" class=\"footerbtn\" *ngIf=\"!isBeginDate||endDate.year!==0\" [disabled]=\"endDate.year===0\" [ngClass]=\"{'btndisable':endDate.year===0}\" (click)=\"$event.stopPropagation();rangeSelected()\">{{acceptBtnTxt}}</button></div></div></div>",
            providers: [my_date_range_picker_date_range_validator_service_1.DateRangeValidatorService]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, my_date_range_picker_date_range_validator_service_1.DateRangeValidatorService])
    ], MyDateRangePicker);
    return MyDateRangePicker;
}());
exports.MyDateRangePicker = MyDateRangePicker;
//# sourceMappingURL=my-date-range-picker.component.js.map