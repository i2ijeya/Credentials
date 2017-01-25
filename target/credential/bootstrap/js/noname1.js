/*
 * This code is for Internal Salesforce use only, and subject to change without notice.
 * Customers shouldn't reference this file in any web pages.
 */
function ApiUtils() {}
ApiUtils.getApiURL = function(a, c) {
    var d = window.location.href,
        b = d.indexOf("/", 10);
    return d.substring(0, b) + UserContext.getUrl("/services/Soap/") + (a ? "u" : "c") + "/" + c
};
ApiUtils.getSessionId = function() {
    return getCookie("sid")
};
ApiUtils.to18CharId = function(a) {
    if (null == a || 18 == a.length) return a;
    a = a.replace(/\"/g, "");
    if (15 != a.length) return null;
    for (var c = "", d = 0; 3 > d; d++) {
        for (var b = 0, e = 0; 5 > e; e++) {
            var f = a.charAt(5 * d + e);
            "A" <= f && "Z" >= f && (b += 1 << e)
        }
        c = 25 >= b ? c + "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(b) : c + "012345".charAt(b - 26)
    }
    return a + c
};
ApiUtils.to15CharId = function(a) {
    return !a ? null : a.substring(0, 15)
};
ApiUtils.getId = function(a) {
    if (!a) return null;
    a = a.get("Id");
    a.splice && (a.length && 0 < a.length) && (a = a[0]);
    a && (a = ApiUtils.to15CharId(a));
    return a
};
ApiUtils.soqlEncode = function(a) {
    a = a.replace("\\", "\\\\");
    return a = a.replace("'", "\\'")
};

function PreferenceBits(a, d) {
    this.bitsByName = {};
    this.preferenceType = a;
    for (var c = 0; c < d.length; c++) {
        var b = d[c];
        this.bitsByName[b.name] = {
            index: b.index,
            val: b.value
        }
    }
}
PreferenceBits.prototype.csrfToken = null;
PreferenceBits.prototype.getBoolean = function(a) {
    return this.bitsByName[a].val
};
PreferenceBits.prototype.getIndexByName = function(a) {
    return this.bitsByName[a].index
};
PreferenceBits.prototype.setBoolean = function(a, d, c) {
    if ("boolean" == typeof d) {
        var b = this.bitsByName[a];
        b && b.val != d && (this.bitsByName[a].val = d, this.save(a, c))
    }
};
PreferenceBits.prototype.setBooleanNoCheck = function(a, d, c) {
    "boolean" == typeof d && this.bitsByName[a] && (this.bitsByName[a].val = d, this.save(a, c))
};
PreferenceBits.prototype.setBooleanNoCheckWithError = function(a, d, c, b) {
    "boolean" == typeof d && this.bitsByName[a] && (this.bitsByName[a].val = d, this.save(a, c, b))
};
PreferenceBits.prototype.save = function(a, d, c) {
    var b = this.bitsByName[a];
    if (b) {
        a = {};
        a.csrf = PreferenceBits.prototype.csrfToken;
        var e = {};
        e.val = b.val;
        e.bit = b.index;
        b = {};
        b.headers = a;
        b.data = e;
        b.failure = c;
        c = "";
        !this.preferenceType || "userPreferences" == this.preferenceType ? c = "/_ui/common/request/servlet/UserPreferencesServlet" : "orgPreferences" == preferenceType && (c = "/_ui/common/request/servlet/OrgPreferencesServlet");
        Sfdc.Ajax.post(UserContext.getUrl(c), d || function() {}, b)
    }
};

function DateUtil() {}
"undefined" != typeof Sfdc && Sfdc.provide && Sfdc.provide("Sfdc.Date", DateUtil);
DateUtil.MONTH_NAMES = "January February March April May June July August September October November December Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
DateUtil.DAY_NAMES = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sun Mon Tue Wed Thu Fri Sat".split(" ");
DateUtil.LZ = function(a) {
    return (0 > a || 9 < a ? "" : "0") + a
};
DateUtil.isDate = function(a, c) {
    return 0 === DateUtil.getDateFromFormat(a, c) ? !1 : !0
};
DateUtil.compareDates = function(a, c, b, h) {
    a = DateUtil.getDateFromFormat(a, c);
    b = DateUtil.getDateFromFormat(b, h);
    return 0 === a || 0 === b ? -1 : a > b ? 1 : 0
};
DateUtil.formatDate = function(a, c) {
    c += "";
    var b = "",
        h = 0,
        f = "",
        d = "",
        f = a.getFullYear() + "",
        d = a.getMonth() + 1,
        p = a.getDate(),
        q = a.getDay(),
        k = a.getHours(),
        m = a.getMinutes(),
        l = a.getSeconds(),
        e = {};
    LC.isThaiTHLocale() && (f = f - 0 + LC.BUDDHIST_CAL_OFFSET + "");
    e.y = "" + f;
    e.yyyy = f;
    e.yy = f.substring(2, 4);
    e.M = d;
    e.MM = DateUtil.LZ(d);
    e.MMM = DateUtil.MONTH_NAMES[d - 1];
    e.NNN = DateUtil.MONTH_NAMES[d + 11];
    e.d = p;
    e.dd = DateUtil.LZ(p);
    e.E = DateUtil.DAY_NAMES[q + 7];
    e.EE = DateUtil.DAY_NAMES[q];
    e.H = k;
    e.HH = DateUtil.LZ(k);
    e.h = 0 === k ? 12 : 12 < k ? k - 12 : k;
    e.hh =
        DateUtil.LZ(e.h);
    e.K = 11 < k ? k - 12 : k;
    e.k = k + 1;
    e.KK = DateUtil.LZ(e.K);
    e.kk = DateUtil.LZ(e.k);
    e.a = 11 < k ? DateUtil.getPMSymbol() : DateUtil.getAMSymbol();
    e.m = m;
    e.mm = DateUtil.LZ(m);
    e.s = l;
    for (e.ss = DateUtil.LZ(l); h < c.length;) {
        f = c.charAt(h);
        for (d = ""; c.charAt(h) == f && h < c.length;) d += c.charAt(h++);
        b = Sfdc.isDefAndNotNull(e[d]) ? b + e[d] : b + d
    }
    return b
};
DateUtil._isInteger = function(a) {
    for (var c = 0; c < a.length; c++)
        if (-1 == "1234567890".indexOf(a.charAt(c))) return !1;
    return !0
};
DateUtil._getInt = function(a, c, b, h) {
    for (; h >= b; h--) {
        var f = a.substring(c, c + h);
        if (f.length < b) break;
        if (DateUtil._isInteger(f)) return f
    }
    return null
};
DateUtil.getDateFromFormat = function(a, c) {
    a += "";
    c += "";
    for (var b = 0, h = 0, f = "", d = "", p, q, k = new Date, m = k.getFullYear(), l = k.getMonth() + 1, e = 1, g = k.getHours(), r = k.getMinutes(), k = k.getSeconds(), n = ""; h < c.length;) {
        f = c.charAt(h);
        for (d = ""; c.charAt(h) == f && h < c.length;) d += c.charAt(h++);
        if ("yyyy" == d || "yy" == d || "y" == d) {
            "yyyy" == d && (p = 2, q = 4);
            "yy" == d && (q = p = 2);
            "y" == d && (p = 2, q = 4);
            m = DateUtil._getInt(a, b, p, q);
            if (null === m) return 0;
            b += m.length;
            2 == m.length && (m = 70 < m ? 1900 + (m - 0) : 2E3 + (m - 0))
        } else if ("MMM" == d || "NNN" == d) {
            for (f = l = 0; f < DateUtil.MONTH_NAMES.length; f++) {
                var s =
                    DateUtil.MONTH_NAMES[f];
                if (a.substring(b, b + s.length).toLowerCase() == s.toLowerCase() && ("MMM" == d || "NNN" == d && 11 < f)) {
                    l = f + 1;
                    12 < l && (l -= 12);
                    b += s.length;
                    break
                }
            }
            if (1 > l || 12 < l) return 0
        } else if ("EE" == d || "E" == d)
            for (f = 0; f < DateUtil.DAY_NAMES.length; f++) {
                if (d = DateUtil.DAY_NAMES[f], a.substring(b, b + d.length).toLowerCase() == d.toLowerCase()) {
                    b += d.length;
                    break
                }
            } else if ("MM" == d || "M" == d) {
                l = DateUtil._getInt(a, b, 1, 2);
                if (null === l || 1 > l || 12 < l) return 0;
                b += l.length
            } else if ("dd" == d || "d" == d) {
            e = DateUtil._getInt(a, b, 1, 2);
            if (null ===
                e || 1 > e || 31 < e) return 0;
            b += e.length
        } else if ("hh" == d || "h" == d) {
            g = DateUtil._getInt(a, b, d.length, 2);
            if (null === g || 1 > g || 12 < g) return 0;
            b += g.length
        } else if ("HH" == d || "H" == d) {
            g = DateUtil._getInt(a, b, d.length, 2);
            if (null === g || 0 > g || 23 < g) return 0;
            b += g.length
        } else if ("KK" == d || "K" == d) {
            g = DateUtil._getInt(a, b, d.length, 2);
            if (null === g || 0 > g || 11 < g) return 0;
            b += g.length
        } else if ("kk" == d || "k" == d) {
            g = DateUtil._getInt(a, b, d.length, 2);
            if (null === g || 1 > g || 24 < g) return 0;
            b += g.length;
            g--
        } else if ("mm" == d || "m" == d) {
            r = DateUtil._getInt(a, b,
                d.length, 2);
            if (null === r || 0 > r || 59 < r) return 0;
            b += r.length
        } else if ("ss" == d || "s" == d) {
            k = DateUtil._getInt(a, b, d.length, 2);
            if (null === k || 0 > k || 59 < k) return 0;
            b += k.length
        } else if ("a" == d) {
            n = DateUtil.getAMSymbol();
            d = DateUtil.getPMSymbol();
            f = a.substring(b, b + n.length);
            s = a.substring(b, b + d.length);
            if (!(f == n || f.toUpperCase() == n))
                if (s == d || s.toUpperCase() == d) n = d;
                else return 0;
            b += n.length
        } else {
            if (a.substring(b, b + d.length) != d) return 0;
            b += d.length
        }
    }
    if (b != a.length) return 0;
    LC.isThaiTHLocale() && (m -= LC.BUDDHIST_CAL_OFFSET);
    if (2 == l)
        if (0 === m % 4 && 0 !== m % 100 || 0 === m % 400) {
            if (29 < e) return 0
        } else if (28 < e) return 0;
    if ((4 == l || 6 == l || 9 == l || 11 == l) && 30 < e) return 0;
    12 > g && n == DateUtil.getPMSymbol() ? g = g - 0 + 12 : 11 < g && n == DateUtil.getAMSymbol() && (g -= 12);
    return (new Date(m, l - 1, e, g, r, k)).getTime()
};
DateUtil.parseDate = function(a) {
    var c = 2 == arguments.length ? arguments[1] : !1;
    generalFormats = "y-M-d;MMM d, y;MMM d,y;y-MMM-d;d-MMM-y;MMM d".split(";");
    monthFirst = "M/d/y M-d-y M.d.y MMM-d M/d M-d M.d".split(" ");
    dateFirst = "d/M/y d-M-y d.M.y d-MMM d/M d-M d.M".split(" ");
    for (var c = ["generalFormats", c ? "dateFirst" : "monthFirst", c ? "monthFirst" : "dateFirst"], b = null, h = 0; h < c.length; h++)
        for (var f = window[c[h]], d = 0; d < f.length; d++)
            if (b = DateUtil.getDateFromFormat(a, f[d]), 0 !== b) return new Date(b);
    return null
};
DateUtil.TIMEZONES = null;
DateUtil.getTimezoneOffset = function() {
    var a = new Date,
        c = 6E4 * a.getTimezoneOffset(),
        b = DateUtil.getTimezoneIndex(a);
    DateUtil.TIMEZONES || (DateUtil.TIMEZONES = DateUtil.getTimezones(a));
    return DateUtil.TIMEZONES[b] + c
};
DateUtil.isBrowserAndSystemTimezoneSame = function() {
    return 0 === DateUtil.getTimezoneOffset()
};
DateUtil.getTimezoneIndex = function(a) {
    return DateUtil.formatDate(a, "yyyyMMdd")
};
DateUtil.getTimezones = function(a) {
    a = Sfdc.Url.generateUrl(UserContext.getUrl("/home/timezones.jsp"), {
        ts: a.getTime()
    });
    return (a = Sfdc.Ajax.request(a, {
        async: !1
    })) ? Sfdc.JSON.parse(a) : null
};
DateUtil.rollDate = function(a, c) {
    var b = new Date(a.getTime());
    b.setDate(b.getDate() + c);
    return b
};
DateUtil.roundDate = function(a) {
    a = new Date(a.getTime());
    a.setHours(0);
    a.setMinutes(0);
    a.setSeconds(0);
    return a
};
DateUtil.getDateStringFromUserLocale = function(a) {
    return DateUtil.formatDate(a, UserContext.dateFormat)
};
DateUtil.getDateFromUserLocale = function(a) {
    return new Date(DateUtil.getDateFromFormat(a, UserContext.dateFormat))
};
DateUtil.getDateTimeStringFromUserLocale = function(a) {
    return DateUtil.formatDate(a, UserContext.dateTimeFormat)
};
DateUtil.getDateTimeFromUserLocale = function(a) {
    return new Date(DateUtil.getDateFromFormat(a, UserContext.dateTimeFormat))
};
DateUtil.getTimeStringFromUserLocale = function(a) {
    return DateUtil.formatDate(a, UserContext.timeFormat)
};
DateUtil.getTimeFromUserLocale = function(a) {
    return new Date(DateUtil.getDateFromFormat(a, UserContext.timeFormat))
};
DateUtil.getAMSymbol = function() {
    return UserContext.initialized ? UserContext.ampm[0] : "AM"
};
DateUtil.getPMSymbol = function() {
    return UserContext.initialized ? UserContext.ampm[1] : "PM"
};
DateUtil.is24Hour = function(a) {
    return -1 < a.indexOf("k")
};
DateUtil.hasAMPM = function(a) {
    return -1 < a.indexOf("a")
};
DateUtil.equals = function(a, c) {
    return a && c && 0 === DateUtil.compare(a, c)
};
DateUtil.lessThan = function(a, c) {
    return 0 > DateUtil.compare(a, c)
};
DateUtil.greaterThan = function(a, c) {
    return 0 < DateUtil.compare(a, c)
};
DateUtil.compare = function(a, c) {
    return a.getFullYear() != c.getFullYear() ? a.getFullYear() - c.getFullYear() : a.getMonth() != c.getMonth() ? a.getMonth() - c.getMonth() : a.getDate() - c.getDate()
};
DateUtil.separators = ["/", "-", "."];
DateUtil.checkYear = function(a, c) {
    var b = a.value.toLowerCase();
    if (b = DateUtil.getCheckYearValue(b))
        if (a.value = b, c && a.onchange) a.onchange()
};
DateUtil.getCheckYearValue = function(a) {
    if (!(a && 0 < a.length)) return null;
    for (var c = null, b = 0; b < DateUtil.separators.length; b++)
        if (-1 != a.indexOf(DateUtil.separators[b])) {
            c = DateUtil.separators[b];
            break
        }
    b = DateUtil.getDateTimeFromUserLocale(UserContext.today);
    if (c)
        if (b.setDate(1), a = a.split(c), 2 == a.length) {
            if (!isNaN(parseInt(a[0], 10)) && !isNaN(parseInt(a[1], 10))) return b.setMonth(parseInt(a[0], 10) - 1), b.setDate(parseInt(a[1], 10)), DateUtil.getDateStringFromUserLocale(b)
        } else {
            if (3 == a.length && !isNaN(parseInt(a[2],
                    10)) && !isNaN(parseInt(a[0], 10)) && !isNaN(parseInt(a[1], 10))) {
                var h = parseInt(a[2], 10);
                if (1 > h / 1E3) return 60 <= h && 100 > h ? b.setFullYear(h + 1900) : b.setFullYear(h + 2E3), b.setMonth(parseInt(a[0], 10) - 1), b.setDate(parseInt(a[1], 10)), DateUtil.getDateStringFromUserLocale(b);
                if ("/" != c) return a[0] + "/" + a[1] + "/" + a[2]
            }
        }
    else return DateUtil.getEvaluateShortcutValue(a)
};
DateUtil.DAY_SHORTCUTS = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
DateUtil.evaluateShortcut = function(a, c) {
    var b = a.value.toLowerCase();
    if (b = DateUtil.getEvaluateShortcutValue(b))
        if (a.value = b, c && a.onchange) a.onchange()
};
DateUtil.getEvaluateShortcutValue = function(a) {
    if (!(a && 0 < a.length)) return null;
    var c = DateUtil.getDateTimeFromUserLocale(UserContext.today);
    if (0 === a.indexOf("tod")) return DateUtil.getDateStringFromUserLocale(c);
    if (0 === a.indexOf("yes")) return c.setDate(c.getDate() - 1), DateUtil.getDateStringFromUserLocale(c);
    if (0 === a.indexOf("tom")) return c.setDate(c.getDate() + 1), DateUtil.getDateStringFromUserLocale(c);
    if (3 <= a.length)
        for (var b = 0; b < DateUtil.DAY_SHORTCUTS.length; b++)
            if (0 === a.indexOf(DateUtil.DAY_SHORTCUTS[b].toLowerCase())) return a =
                b - c.getDay(), 0 > a && (a += 7), c.setDate(c.getDate() + a), DateUtil.getDateStringFromUserLocale(c);
    return null
};
DateUtil.differenceInMinutes = function(a, c) {
    var b = c.getTime() - a.getTime();
    return Math.round(b / 6E4)
};
DateUtil.getDateFromValue = function(a, c) {
    var b = c ? DateUtil.getDateFromFormat(a, UserContext.dateTimeFormat) : DateUtil.getDateFromFormat(a, UserContext.dateFormat);
    return 0 !== b ? new Date(b) : null
};
var AbstractAutoCompleteServlet = {
        AUTOCOMPLETE_USED_SUFFIX: "_acused",
        SUGGESTIONS: "suggestions",
        pINPUT: "inputString"
    },
    AccountAssociationSuggestionsServlet = {
        ACTION_COUNT: 3,
        DEFAULT: "DEFAULT",
        SEARCH: "SEARCH",
        pASSOCIATION_DATA_PARAM: "adp",
        pCONTACT_ID_PARAM: "adpc"
    },
    Activity = {
        ACTIVITY_TYPE: "activityType",
        DAY_OF_WEEK_FRIDAY: "32",
        DAY_OF_WEEK_MONDAY: "2",
        DAY_OF_WEEK_SATURDAY: "64",
        DAY_OF_WEEK_SUNDAY: "1",
        DAY_OF_WEEK_THURSDAY: "16",
        DAY_OF_WEEK_TUESDAY: "4",
        DAY_OF_WEEK_WEDNESDAY: "8",
        END_DATE_ID: "EndDateTime",
        END_TIME_ID: "EndDateTime_time",
        MAX_RECURRENCE_END_DATE: "maxRecurrenceEndDate",
        MAX_RECURRENCE_ERRORS: "maxRecurrenceErrors",
        MAX_RECURRENCE_SPAN_ID: "maxRecurrence",
        REMINDER_DATE_TIME_ID: "reminder_dt",
        REMINDER_LEAD_DAYS_TIME_ID: "reminder_ldt",
        REMINDER_SELECT_ID: "reminder_lt",
        REMINDER_SET_ID: "reminder_select_check",
        START_TIME_ID: "StartDateTime_time",
        WHO_BUTTON_ID: "whobtn",
        pATT_WARNING: "attWarning",
        pNEW_ATTACHMENTS: "newatt",
        pYEARLY_DAYOFMONTH: "ydom",
        pYEARLY_MONTHOFYEAR: "ymoy"
    },
    ActivityPage = {
        DISABLED_RECURRENCE_MSG_DIV: "DisabledRecurrenceMsgDiv"
    },
    ActivityReminderConstants = {
        ALL_DAY_ATTR: "all_day",
        DISMISS_ALL_ID: "dismiss_all",
        DISMISS_ID: "dismiss",
        DUE_MINUTES_ID: "minutes",
        DUE_TIME_ATTR: "due_time",
        REMINDERS_NONE: "reminders_none_active",
        REMINDERS_OK: "reminders_ready",
        REMINDER_ID: "reminder",
        SNOOZE_ID: "snooze",
        SNOOZE_TIME_ID: "snooze_time",
        SUMMARY_ID: "summary",
        pAT: "at",
        pSNOOZED_AT: "snoozed_at",
        pTEST: "test"
    },
    ActivityReminderPage = {
        pCLASS_NAME: "ui.core.activity.ActivityReminderPage"
    },
    ActivityReminderRefreshPage = {
        pCLASS_NAME: "ui.core.activity.ActivityReminderRefreshPage"
    },
    ActivityUi = {
        ALL_SUBGROUP_DIVS: "dwmy",
        MANY_WHO_ACCESS_BIT_SUFFIX: "_manyWAccessBit",
        MANY_WHO_COMPANY_ELEMENT_SUFFIX: "_manyWCompany",
        MANY_WHO_CONTACT_FIELD_NAME_SUFFIX: "_manyWContactField",
        MANY_WHO_ID_ELEMENT_SUFFIX: "_manyWId",
        MANY_WHO_NAME_ELEMENT_SUFFIX: "_manyWName",
        MANY_WHO_OWNER_ELEMENT_SUFFIX: "_manyWOwner",
        MANY_WHO_TITLE_ELEMENT_SUFFIX: "_manyWTitle",
        RECURRENCE_PATTERN_DIV: "recpat",
        WHO_TIP_DIV_ID: "whoTipText"
    },
    AddRulesToTerritory2MultiSelectList = {
        inheritCheckboxPrefix: "inherit_",
        pINHERIT_IDS: "inheritIds",
        pUNSAVED_INHERIT_IDS: "unsavedInheritIds"
    },
    AdvancedCurrencyEnable = {
        enableButton: "enableButton",
        pENABLE: "enable"
    },
    AjaxGetFieldTreeChildren = {
        FORMULA_TYPE: "formulaType",
        NODE_KEY: "nodeKey",
        NODE_LIST: "nodeList"
    },
    AjaxGetUser = {
        pLABEL_ELEMENT: "labelElement",
        pTHUMBNAIL_ELEMENT: "thumbnailElement",
        pUSERS: "users",
        pUSER_ID: "userId",
        pUSER_IDS: "userIds",
        pUSER_NAME: "userName"
    },
    AjaxGetUsersInGroups = {
        pCLASS_NAME: "common.ownership.group.AjaxGetUsersInGroups",
        pINVALID_GROUPS_MESSAGE: "invalidGroups",
        pNUM_USERS: "numUsers",
        pOWNER_ID_LIST: "ownerIdList",
        pOWNER_NAME_LIST: "ownerNameList"
    },
    AjaxInNumericRange = {
        pHIGH: "high",
        pLOW: "low",
        pRESULT: "result",
        pTO_TEST: "toTest"
    },
    AjaxLoadFieldsForControllingEntity = {
        pCONTROLLING_FIELD_ID: "controllingFieldId",
        pCUSTOM_METADATA_KEY_PREFIX: "keyPrefix",
        pDEPENDENT_FIELD_IDS: "dependentFieldIdList",
        pENTITY_DEFINITION_FIELDS: "fieldList",
        pENTITY_DEFINITION_NAME: "entity"
    },
    AjaxLoadFieldsForEntity = {
        pENTITY_NAME: "entity",
        pFIELD_LIST: "fieldList",
        pPARENT_ENTITY_NAME: "parentEntity"
    },
    AjaxLoadPLAForPageServlet = {
        PAGE_NUM: "pageNum"
    },
    AjaxLoadPLAForRecordTypeServlet = {
        RECORD_TYPE_ID: "rtId"
    },
    AjaxLoadPLAServlet = {
        PAGE_SIZE: "pageSize",
        TYPE: "type"
    },
    AjaxLoadRelatedListItem = {
        pRELATED_LIST_ID: "RelatedListId"
    },
    AjaxScanFieldsForShrinkage = {
        pENTITY_NAME: "entityName",
        pFIELD_ID: "fieldId",
        pLENGTH_SPECIFIED: "lengthSpecified"
    },
    AjaxServlet = {
        CSRF_PROTECT: "while(1);\n",
        ERROR_MSG_KEY: "errMsg",
        SESSION_TIMEOUT: "sessionTimeout"
    },
    AjaxValidateFormula = {
        RANGE_KEY: "range",
        VALID_KEY: "valid"
    },
    AjaxValidateSpanningFormulasInRelatedList = {
        pRELATED_LIST_ID: "RelatedListId",
        pSELECTED_COLUMNS: "SelectedColumns"
    },
    Aotp = {
        MY_NS: "c"
    },
    AssociationSelectElement = {
        ASSOCIATION_DATA_PREFIX: "aasead_",
        LOOKUP_NAME_PREFIX: "aaselkup_",
        PARENT_ID_NAME_PREFIX: "aasepid_",
        SELECT_NAME_PREFIX: "aasesel_",
        SERVLET_NAME: "sync.association.actions.AccountAssociationSuggestionsServlet"
    },
    BaseAssociationConstants = {
        HELP_LINK_ID: "queue_help",
        MASS_ASSOCIATION_MODE_PARAM: "massAssociationMode",
        SOURCE_PARAM_NAME: "src",
        VIDEO_LINK_ID: "queue_tutorial_video"
    },
    BaseIntermediateRedirectServlet = {
        DESTINATION_URL_PARAM_NAME: "retURL"
    },
    BlowoutServlet = {
        BLOWOUT: "blowout",
        SERVLETURL: "/_ui/system/scheduler/cron/ScheduleBlowoutServlet",
        SUCCESS: "success",
        SUFFIX: "suf"
    },
    BodyLayout = {
        BODY_CELL_ID: "bodyCell",
        BODY_TABLE_ID: "bodyTable",
        FOOTER_DIV_ID: "bodyFooter",
        NO_TABLE_BODY_ID: "noTableContainer",
        PAGE_HEADER_ID: "AppBodyHeader",
        SIDEBAR_CELL: "sidebarCell"
    },
    BounceEmailConstants = {
        HIDDEN_BOUNCE_DATE: "hidden_bounce_date",
        HIDDEN_BOUNCE_REASON: "hidden_bounce_reason",
        HIDDEN_EMAIL_ADDRESS: "hidden_email_address"
    },
    BrandingColor = {
        DEFAULT_NAME: "Default",
        TRANSPARENT_NAME: "Transparent"
    },
    BusinessHoursPageConstants = {
        p24X7_CHECKBOX: "has24x7"
    },
    BusyTimesAjaxServlet = {
        DATE_OF_THE_WEEK_PARAM: "date",
        SERVLET_NAME: "core.activity.scheduling.BusyTimesAjaxServlet",
        TIME_ZONE_PARAM: "timezone",
        USER_ID_PARAM: "userid"
    },
    CSRFConstants = {
        CSRF_TOKEN: "_CONFIRMATIONTOKEN"
    },
    CampaignManageMembers = {
        ACCOUNT_JS: "a",
        ADD_TAB: 0,
        CAMPAIGN_MEMBER_JS: "CampaignMember",
        CONTACT_JS: "c",
        DEFAULT_FILTER_ROW_COUNT: 5,
        ERROR_DIV_ID: "save_error",
        ERROR_MSG: "membersError",
        ERROR_TEXT_ID: "save_error_text",
        EXISTING_TAB: 1,
        FILTER_ID_PREFIX: "mm_filters_",
        LEAD_JS: "l",
        MEMBERS_ADDED: "membersAdded",
        MEMBERS_REMOVED: "membersRemoved",
        MEMBERS_TOTAL: "membersTotal",
        MEMBERS_UPDATED: "membersUpdated",
        NOTICE_DIV_ID: "notice",
        pCOLUMN: "col",
        pFILTER_VALUE: "fval",
        pLOOKUP_ID: "lookup",
        pOPERATOR: "oper"
    },
    CaptchaVerifierServlet = {
        CHALLENGE_PARAM: "chal",
        CLIENT_ERROR_PARAM: "error",
        RESPONSE_PARAM: "resp",
        SERVLET_NAME: "common.html.captcha.CaptchaVerifierServlet",
        VALID_KEY: "valid"
    },
    CaseUi = {
        TIMELINE_DIV: "entitlement_timeline"
    },
    ChangePasswordConstants = {
        CHANGE_PASSWORD_PARAMS: "changePasswordParams",
        IS_ALPHANUMERIC_REQ: "isAlphanumericRequired",
        IS_PASSWORD_ALLOWED_IN_ANSWER: "isPasswordAllowedInAnswer",
        IS_SPECIALCHARACTER_REQ: "isSpecialCharacterRequired",
        IS_UPPERLOWERCASE_NUMERIC_REQ: "isUpperLowerCaseNumericRequired",
        IS_UPPERLOWERCASE_NUMERIC_SEPCIALCHARACTER_REQ: "isUpperLowerCaseNumericSpecialCharacterRequired",
        LAST_PW_CHANGE_BOX: "lastPWChangeBox",
        MIN_PASSWORD_LENGTH: "minPasswordLength",
        PASSWORD_POLICY: "passwordPolicy",
        SECRET_DESC_BOX: "secretDescBox",
        WANT_LOWERCASE_LABELS: "wantLowercaseLabels",
        pANSWER_ELEM: "answer",
        pANSWER_ERROR_ELEM: "answerContainsPassword",
        pANSWER_ICON_ELEM: "answerVerify",
        pNEW_PASSWORD_CONFIRMATION_ELEM: "confirmpassword",
        pNEW_PASSWORD_CONFIRMATION_ICON_ELEM: "passVerify",
        pNEW_PASSWORD_ELEM: "newpassword",
        pNEW_PASSWORD_ICON_ELEM: "strengthImage",
        pNEW_PASSWORD_STRENGTH_ELEM: "passStrength",
        pNEW_PASSWORD_STRENGTH_INFO_ELEM: "passStrengthInfo",
        pNEW_PASSWORD_STRENGTH_PROMPT: "passStrengthPrompt",
        pOLD_PASSWORD_ELEM: "currentpassword",
        pQUESTION_ELEM: "question"
    },
    ChangeUsernameConstants = {
        pIS_USERNAME_CHANGED_ELEM: "p101",
        pNEW_USERNAME_ELEM: "p102"
    },
    ChartConstants = {
        MORE_BARS: "mbars",
        ONLY_LINE: "ol",
        pCHART_DIFF_AXIS: "chda",
        pCHART_SHOW_AS: "chsa",
        pCHART_SHOW_PERCENTAGE: "chsp",
        pCHART_SHOW_PLOT_BY_VALUES: "chspv",
        pCHART_SHOW_TOTAL: "chst",
        pCHART_SHOW_VALUES: "chsv",
        pCHART_SUMMARY: "cs",
        pCHART_SUMMARY_2: "cs2",
        pCHART_SUMMARY_3: "cs3",
        pCHART_SUMMARY_4: "cs4",
        pCHART_USE_MULTI: "chum",
        pCOMBINE_OTHERS: "chco"
    },
    ChatterDeflection = {
        KBArticleType: "KBArticle",
        QuestionType: "Question"
    },
    ChatterEmailSettingsConstants = {
        API_ONLY_DIGEST_ID: "apiOnlyDigest",
        CHATTER_EMAIL_ATTACHMENT_ID: "chatterEmailAttachment",
        COLLABORATION_EMAIL_ID: "collaborationEmail",
        DISPLAY_APP_DOWNLOAD_BADGES_ID: "appDownloadBadges",
        EMAIL_FOOTER_LOGO_DOM_ID: "footerLogo",
        EMAIL_FOOTER_TEXT_ID: "footerText",
        EMAIL_REPLY_TO_CHATTER_ID: "emailReplyToChatter",
        EMAIL_TO_CHATTER_ID: "emailToChatter",
        ORIGINAL_SENDER_ADDRESS_ID: "originalSenderAddress",
        SENDER_ADDRESS_ID: "senderAddress",
        SENDER_NAME_ID: "senderName"
    },
    ChatterFilesConstants = {
        CONTAINER_ID: "docViewerContainer",
        DOCUMENT_ID: "documentid",
        DOC_VIEWER_CONTAINER_CLASS: "docViewerContainer",
        DOC_VIEWER_CONTAINER_PARENT_CLASS: "docViewerContainerParent",
        DOC_VIEWER_OVERLAY_CLASS: "docViewerOverlay",
        EDIT_FILE_CONFIG_KEY_TYPE: "editType",
        EDIT_FILE_CONFIG_KEY_TYPE_DESCRIPTION: "editDescription",
        EDIT_FILE_CONFIG_KEY_TYPE_FILE_DETAIL: "editFileDetail",
        FEED_ACTION_PARAM_NAME: "fa",
        FILE_ADD_NEW_VERSION_PERM: "addNewVersion",
        FILE_CONFIG_KEY_DESC: "desc",
        FILE_CONFIG_KEY_DOCID: "docId",
        FILE_CONFIG_KEY_FILENAME: "fileName",
        FILE_CONFIG_KEY_VERID: "verId",
        FILE_DELETE_PERM: "delete",
        FILE_DOWNLOAD_CONFIG: "downloadCfg",
        FILE_DOWNLOAD_URL: "downloadUrl",
        FILE_EDIT_PERM: "edit",
        FILE_FIELD_CONFIG: "fieldCfg",
        FILE_PERM_CONFIG: "permCfg",
        FILE_SHARE_PERM: "share",
        FILE_SIZE: "fileSize",
        FILE_TITLE_ID: "fileTitle",
        FILE_TITLE_SMALL_FONT_CLASS: "fileTitleSmallFont",
        FILE_VIEW_CONFIG: "viewCfg",
        FILE_VIEW_JS: "viewJS",
        FILE_VIEW_PERM: "view",
        FILE_VIEW_URL: "viewUrl",
        FILE_VIEW_URL_POPUP_WINDOW: "viewUrlWindow",
        MAX_VISIBLE_COUNT: 5,
        OVERLAY_ID: "docViewerOverlay",
        UPLOAD_DIALOG_APPENDIX: "_upload"
    },
    ChatterService = {
        AFTER_DISLIKE_CLASS: "cxafterdislike",
        AFTER_LIKE_CLASS: "cxafterlike",
        APP_CONTEXT_NAME: "ChatterAnswers",
        CLASS_DROPDOWN: "cxdropdown",
        CLASS_MINX: "cxminx",
        CLASS_MINX_LINK: "cxminxlink",
        CLASS_REPORT_ABUSE_ACTION: "cxreportabuseaction",
        COOKIE_NAME: "ChatterAnswersSearchResultClick",
        DATA_CATEGORY_DELETED: "dataCategoryDeleted",
        DISLIKE_CLASS: "cxdislike",
        DOWN_VOTE_COUNT_CLASS: "downVoteCount",
        FOLLOW_CLASS: "cxfollow",
        FOLLOW_COUNT_CLASS: "followCount",
        LIKE_CLASS: "cxlike",
        REPLY_RTE_ID: "cs:replyInput",
        SEARCH_MIN_LENGTH: 3,
        SEND_NOTIFICATION: "sendNotification",
        TB_SEARCH_MAX_LENGTH: 255,
        UP_VOTE_COUNT_CLASS: "upVoteCount",
        pDATACATEGORY: "dc",
        pEMAIL_INFO_BUBBLE_CLASS: "emailInfoBubble",
        pFEEDCRITERIA: "criteria",
        pFEEDTYPE: "feedtype",
        pID: "id",
        pIsFollow: "v3",
        pQUESTION: "q",
        pQUESTIONBODY: "b",
        pSearchAskState: "s",
        pVoteTargetId: "v1",
        pVoteType: "v2"
    },
    ColorInputConstants = {
        COLOR_BOX_CSS: "colorBox",
        ERROR_COLOR_BOX_CSS: "errorColorBox"
    },
    ColorPickerConstants = {
        COLOR_VIEW_ID: "colorPickerColorView",
        DOM_ID: "colorPicker",
        HEX_VIEW_ID: "colorPickerHexView"
    },
    ColumnTypeConstants = {
        ADDRESS_CITY_OFFSET: 1,
        ADDRESS_COUNTRY_CODE_OFFSET: 6,
        ADDRESS_COUNTRY_OFFSET: 4,
        ADDRESS_LATITUDE_OFFSET: 7,
        ADDRESS_LONGITUDE_OFFSET: 8,
        ADDRESS_POSTAL_CODE_OFFSET: 3,
        ADDRESS_STATE_CODE_OFFSET: 5,
        ADDRESS_STATE_OFFSET: 2,
        ADDRESS_STREET_OFFSET: 0,
        ADDRESS_XYZ_OFFSET: 9,
        DEFAULT_CITY_LENGTH: 40,
        DEFAULT_COUNTRY_CODE_LENGTH: 10,
        DEFAULT_COUNTRY_LENGTH: 80,
        DEFAULT_FIRSTNAME_LENGTH: 40,
        DEFAULT_LASTNAME_LENGTH: 80,
        DEFAULT_LATITUDE_LENGTH: -1,
        DEFAULT_LONGITUDE_LENGTH: -1,
        DEFAULT_MIDDLENAME_LENGTH: 40,
        DEFAULT_PREFERREDNAME_LENGTH: 80,
        DEFAULT_SALUTATION_LENGTH: 40,
        DEFAULT_STATE_CODE_LENGTH: 10,
        DEFAULT_STATE_LENGTH: 80,
        DEFAULT_STREET_LENGTH: 255,
        DEFAULT_SUFFIX_LENGTH: 40,
        DEFAULT_TEXTNAME_LENGTH: 255,
        DEFAULT_XYZ_LENGTH: 60,
        DEFAULT_ZIP_LENGTH: 20,
        FILE_BODY_OFFSET: 4,
        FILE_CONTENTTYPE_LENGTH: 120,
        FILE_CONTENTTYPE_OFFSET: 2,
        FILE_FIELDDATA_OFFSET: 0,
        FILE_LENGTH_OFFSET: 3,
        FILE_NAME_LENGTH: 40,
        FILE_NAME_OFFSET: 1,
        LOCATION_LATITUDE_OFFSET: 0,
        LOCATION_LONGITUDE_OFFSET: 1,
        PERSONNAME_FIRSTNAME_OFFSET: 1,
        PERSONNAME_INFORMALNAME_OFFSET: 4,
        PERSONNAME_LASTNAME_OFFSET: 2,
        PERSONNAME_MIDDLENAME_OFFSET: 3,
        PERSONNAME_SALUTATION_OFFSET: 0,
        PERSONNAME_SUFFIX_OFFSET: 5
    },
    CompactLayoutAssignmentConstants = {
        CUSTOM_COMPACT_LAYOUT: "c",
        INHERIT_COMPACT_LAYOUT: "i",
        SYSTEM_COMPACT_LAYOUT: "s"
    },
    CompactLayoutUiConst = {
        hideItemsLeft: "hideItemsLeft",
        hideItemsRight: "hideItemsRight",
        saveButtonId: "saveButton",
        showItemsLeft: "showItemsLeft",
        showItemsRight: "showItemsRight",
        switchColumnToLeft: "switchColumnLeft",
        switchColumnToRight: "switchColumnRight"
    },
    ConsoleSidebarSetupEditor = {
        CANVAS_APP_ID_PARAM_NAME: "canvasAppId",
        CANVAS_ID: "canvas_id_",
        CHECKBOX_ID_CONTAINER_AUTOSIZE: "pContainerAutoSize",
        CHECKBOX_ID_RELATED_LIST: "relatedListCheckBoxId",
        CHECKBOX_ID_RELATED_LIST_HIDE_ON_DETAIL: "relatedListHideInDetailCheckBoxId",
        COLUMN_IMAGE_CONTAINER_POSTFIX: ".jpg",
        COLUMN_IMAGE_PREFIX: "/img/support/setup/contextpaneeditor/",
        COMPONENTS_LIST: "componentsList",
        COMPONENT_HEADER_ID: "cmpHeaderId_",
        COMPONENT_LABEL: "componentLabel",
        COMPONENT_LOOKUP_ID: "pComponentLookupFields",
        COMPONENT_SELECT_ELEMENT_CLASS: "sourceTypeSelectElement",
        COMPONENT_SIZE: "cpStackSize",
        COMPONENT_SIZE_CLASS: "componentSizeClass",
        COMPONENT_TABLE: "componentTable",
        COMPONENT_TYPE_ID: "componentType",
        CONTAINER_TYPE: "pContainerType",
        ID_INFO_BUBBLE_IMG: "info_bubble_img_",
        ID_INFO_BUBBLE_LABEL: "info_label_",
        IMAGE_ACCORDION_NAME: "accordion_",
        IMAGE_STACK_NAME: "stacked_",
        IMAGE_TABBED_NAME: "tabbed_",
        REMOVE_LINK_ID: "removeLink",
        TYPE_CONFIG_NA: "NOT_APPLICABLE",
        TYPE_CONFIG_PARAM_COMPONENT_LABEL: "componentLabel",
        TYPE_CONFIG_PARAM_DIV: "paramDiv",
        TYPE_CONFIG_PARAM_IS_AUTO_SIZABLE: "isAutoSizable",
        TYPE_CONFIG_PARAM_IS_LABEL_CUSTOMIZABLE: "isLabelCustomizable",
        TYPE_CONFIG_PARAM_SELECTOR_PREFIX: "selectorPrefix",
        TYPE_CONFIG_PARAM_SELECTOR_TYPE: "selectorType",
        TYPE_CONFIG_SELECTOR_LOOKUP: "LOOKUP_WIDGET",
        TYPE_CONFIG_SELECTOR_PICKLIST: "PICKLIST_WIDGET",
        VF_PAGE_ID_PARAM_NAME: "vfPageId",
        VISUALFORCE_ID: "visualforce_id_",
        IBUBBLE_TEXT_AUTOSIZE: "tBubbleAutoSize"
    },
    ContextPaneEditor = {
        CANVAS_ID: "canvas_id_",
        COMPONENT_HEADER_ID: "cmpHeaderId_",
        COMPONENT_SELECT_ELEMENT_CLASS: "sourceTypeSelectElement",
        LOOKUP_ID: "lookup_id_",
        VISUALFORCE_ID: "visualforce_id_"
    },
    CreateNewElement = {
        DOM_ID: "createNew"
    },
    CreateNewList = {
        DHTML_ID: "newEntityList"
    },
    CriteriaInputConstants = {
        BOOL_FILTER_NAME: "bool_filter",
        CLEAR_FILTERS_LINK: "clrFiltersLnk",
        ERROR_CLS: "FAErrorCell",
        ERROR_MESSAGE: "ErrorMessage",
        FILTER_SECTION_ID: "filterSection",
        F_ROW: "frow",
        HAS_ERROR_OR_WARNING: "HasErrorOrWarning",
        INFO_MESSAGE: "InfoMessage",
        INSERT_DEP_BUTTON_ID: "insertDepButton",
        INSERT_DEP_ID_PREFIX: "dep_",
        INVALID_FIELD_VALUE: "invalid__",
        INVALID_PREFIX: "fk__",
        IS_ACTIVE: "Active",
        IS_DEFAULT_MESSAGE: "isDefaultMsg",
        IS_OPTIONAL: "IsOptional",
        LABEL_PREFIX: "labelFor",
        LOOKUP_FILTER_SECTION_ID: "lookupFilterSection",
        MAX_ROWS_ID: "maxRowsReached",
        RESET_ERROR_MESSAGE: "rstErrMsg",
        RESET_ERROR_MESSAGE_LINK: "rstErrMsgLnk",
        SHOW_SUMMARY_FILTER: "filterControl",
        pCOL: "critfld",
        pFIELD_VAL: "critfld_val",
        pFLD: "pFLD",
        pIS_FLD: "pIS_FLD",
        pLOOKUP: "pLOOKUP",
        pOP: "critop",
        pVAL: "pVAL",
        pVal: "pBLANK"
    },
    CrtConstants = {
        MAX_OBJECTS: 4,
        OBJECT_PREFIX: "o",
        PICKLIST_VALUE_ID_SEPARATOR: "|",
        PICKLIST_VALUE_TABLE_FIELD_SEPARATOR: "."
    },
    CrtLayoutElement = {
        ACTIONREF: "actionRef",
        ACTIONREF_NAME: "name",
        ACTIONREF_ORDER: "order",
        AVAIL_CELL: "availCell",
        COLUMN: "column",
        COLUMN_ID: "columnId",
        COLUMN_NAME: "columnName",
        CSS_CLASS_LAYOUT_CELL: "layoutCell",
        CSS_CLASS_LAYOUT_ITEM: "itemCell",
        CSS_CLASS_LAYOUT_ITEM_SEPARATOR: "sepCell",
        DEFAULT_NUM_COLS: "defaultNumCols",
        FIELD_TYPE_SELECT_NAME: "availableDropDown",
        HOVER_DIV: "MOUSE_HOVER_DIV",
        ITEM: "item",
        ITEM_BEHAVIOR: "behavior",
        ITEM_CUSTOMLABEL: "customLabel",
        ITEM_DEFAULT_CHECKED: "defaultChecked",
        ITEM_HEIGHT: "height",
        ITEM_ID: "itemId",
        ITEM_LAYOUT_IDS: "lIds",
        ITEM_NAME: "name",
        ITEM_POS_X: "xPos",
        ITEM_SHOWLABEL: "showLabel",
        ITEM_SHOWSCROLLBARS: "showScrollbars",
        ITEM_TYPE: "itemType",
        ITEM_WIDTH: "width",
        LAST_SEC_SEP_DIV: "LAST_SEC_SEP_DIV",
        LAYOUT_FIELDS_LIMIT: 1E3,
        LAYOUT_NAME: "name",
        LEFT_SECTION_ID: "layoutdndLeft",
        MAIN_TABLE_DIV_ID: "mainTableDiv",
        MAX_DISPLAY_FIELD_LENGTH: 15,
        NUM_LAYOUT_COLS: 4,
        ROOT_CONTAINER: "root",
        SCROLL_BUFFER_ID: "scrollBuffer",
        SECTION: "section",
        SECTION_AVAIL_WRAPPER_ID: "availableSectionWrapper",
        SECTION_CAN_EDIT_LABEL: "canEditLabel",
        SECTION_DETAIL_HEADING: "detailHeading",
        SECTION_DIV_SUFFIX: "availSectionDiv",
        SECTION_EDIT_HEADING: "editHeading",
        SECTION_HEADER_ID_PREFIX: "sec_",
        SECTION_ID: "sectionId",
        SECTION_MASTER_LABEL: "masterLabel",
        SECTION_NAME: "name",
        SECTION_NUM_COLUMNS: "numColumns",
        SECTION_SEP_DIV_PREFIX: "LayoutSectionSeparator_",
        SECTION_SORT_ORDER: "sortOrder",
        SECTION_SORT_ORDER_HORIZONTAL: "h",
        SECTION_TABLE_ID_PREFIX: "table",
        SEPARATOR_PREFIX: "rp_",
        XML_FORM_NAME: "submitForm",
        cAVAILABLE_HIGHLIGHT: "#000000",
        cFIELD_EMPTY: "#FFFFFF",
        cFIELD_IN_SECTION: "#CCCCCC",
        cFIELD_SELECTED: "#6699CC",
        cFIELD_UNUSED: "#CCCCAA",
        cFIELD_USED: "#EEEEEE",
        cFIELD_USED_FONT: "#B0B0B0",
        cSEPARATOR_ON: "#000000",
        pSAVE_AND_CLOSE: "saveAndClose",
        pVALUE: "val"
    },
    CrtLookupConstants = {
        CONTROL_ELEM_1: "controlLinks1",
        LOOKUP_DEPTH_LIMIT: 4,
        LOOKUP_ELEM: "lookupBox",
        LOOKUP_HEADER: "lookupInnerHeader",
        PATH_ELEM: "pathBox"
    },
    CrtObjectElement = {
        ELBOW_INNER: "elbow_inner",
        ELBOW_OUTER: "elbow_outer",
        EST_OBJECT_LABEL: "estObjLabel",
        GHOST0: "ghost0",
        GHOST1: "ghost1",
        GHOST_ELBOW: "ghost_elbow",
        INNER_JOIN_OPTION: "inner_join_option",
        INNER_JOIN_SELECT: "inner_select",
        JOIN_RADIO: "radio",
        LEVEL: "level",
        MAX_OBJECTS_WARNING: "warning",
        OUTER_JOIN_OPTION: "outer_join_option",
        OUTER_JOIN_SELECT: "outer_select",
        REMOVE_OBJECT_LINK: "remove",
        TERMINAL_OBJECT_WARNING: "endWarning"
    },
    CustomFieldDefinitionUiModel = {
        DEFAULT_READONLY_TO_TRUE: "defaultReadonlyToTrue",
        FLS_PROPERTIES: "flsProperties",
        FLS_VALUES: "flsValues",
        READONLY_CHECKBOX_DISABLED: "readOnlyCheckboxDisabled",
        VISIBLE_CHECKBOX_DISABLED: "visibleCheckboxDisabled"
    },
    CustomMotifDefinitionPageConst = {
        COLOR_ELEMENT: "ce",
        MOTIF_ICON_PARAM: "file_id"
    },
    CustomObjectTeamMemberUiConstants = {
        MEMBERS_TABLE: "tm_t",
        MEMBERS_TABLE_ROW_PREFIX: "tm_t_r_",
        REMOVED_MEMBERS_CONTAINER: "rmc",
        REMOVED_TEAMS_CONTAINER: "rtc",
        TEAMS_TABLE: "tt_t",
        TEAMS_TABLE_ROW_PREFIX: "tt_t_r_",
        pCSP_PORTAL_PREFIX: "csp_",
        pMEMBERS_COUNT: "tmc",
        pMEMBER_PREFIX: "tm_",
        pREMOVED_MEMBERS_PREFIX: "rm_",
        pREMOVED_TEAMS_PREFIX: "rt_",
        pROLE_PREFIX: "tmr_",
        pSHARE_ACCESS_PREFIX: "sa_",
        pTEAM_RECORDS_COUNT: "ttc",
        pTEAM_RECORD_PREFIX: "tt_"
    },
    CustomObjectTeamTemplateUiConstants = {
        REMOVED_CONTAINER: "rmc",
        pCSP_PORTAL_PREFIX: "csp_",
        pMEMBERS_COUNT: "tmc",
        pMEMBER_PREFIX: "tm_",
        pREMOVED_PREFIX: "rm_",
        pROLE_PREFIX: "tmr_",
        pSHARE_ACCESS_PREFIX: "sa_"
    },
    CustomSchemaObjectDefinitionUiModel = {
        AUTONUMBER_HELP_HTML: "autonumberHelpHtml",
        CLOB_LENGTH_CONFIG: "clobLengthConfig",
        DOMAIN_ENUM_OR_ID_CONFIG: "domainEnumOrIdConfig",
        EDITABLE_PROPERTIES: "editableProperties",
        ENCRYPTED_EXAMPLE_CONFIG: "encryptedExampleConfig",
        IS_NEW: "isNew",
        PROPERTY_VALUES: "propertyValues",
        SUMMARY_FIELD_CONFIG: "summaryFieldConfig",
        TYPE_INDEPENDENT_NAME_TO_UNIQUE_NAME: "typeIndependentNameToUniqueName",
        VALID_PROPERTIES: "validProperties"
    },
    DashboardConstants = {
        CHART_RADIO_BUTTON_VALUE: "0",
        CHART_RANGE_MANUAL_ELEMENT_NAME: "p21",
        CHART_RANGE_MAX_ELEMENT_NAME: "p20",
        CHART_RANGE_MIN_ELEMENT_NAME: "p19",
        CUSTOM_REPORT_ELEMENT_NAME: "p2",
        DASHBOARD_COMPONENT_TYPE_ELEMENT_NAME: "p3",
        DRILLTYPE_DETAIL_VALUE: "Detail",
        DRILLTYPE_FILTER_VALUE: "FilterReport",
        DRILLTYPE_REPORT_VALUE: "Report",
        DRILLTYPE_URL_VALUE: "URL",
        DRILL_TYPE: "p25",
        LEGEND_POSITION_ELEMENT_NAME: "p17",
        NUMBER_OF_TABLE_COLUMNS: "4",
        NUMBER_ROWS_ELEMENT_NAME: "p9",
        SORT_BY_ELEMENT_NAME: "p8",
        TABLE_COLUMN1_ELEMENT_NAME: "pCol1",
        TABLE_COLUMN1_LABEL_NAME: "pCol1Lbl",
        TABLE_COLUMN2_ELEMENT_NAME: "pCol2",
        TABLE_COLUMN2_LABEL_NAME: "pCol2Lbl",
        TABLE_COLUMN3_ELEMENT_NAME: "pCol3",
        TABLE_COLUMN3_LABEL_NAME: "pCol3Lbl",
        TABLE_COLUMN4_ELEMENT_NAME: "pCol4",
        TABLE_COLUMN4_LABEL_NAME: "pCol4Lbl",
        TABLE_COLUMN_GROUP_NAME: "tcColGrp",
        TABLE_COLUMN_SORT_ASCENDING_VALUE: "ASC",
        TABLE_COLUMN_SORT_DESCENDING_VALUE: "DSC",
        TABLE_COLUMN_SORT_LBL_ID: "tcSortByLbl",
        TABLE_SORT_BY_PICKLIST: "tcSbp",
        TABLE_SORT_COLUMN_ELEMENT_NAME: "pSortCol",
        TABLE_SORT_RADIO_ELEMENT_NAME: "tcSbr",
        USE_MULTI_COLUMN: "useMultiColumnTable",
        USE_MULTI_COLUMN_LABEL_NAME: "umcLbl"
    },
    DataDotComCleanConstants = {
        ENTITY_ENABLE_SUFFIX: "_entityEnable",
        ENTITY_OPTION_SUFFIX: "_entityOption",
        FIELD_OPTION_SUFFIX: "_fieldOption",
        JOBBYPASS_OPTION_SUFFIX: "_bypassJobs",
        MATCH_OPTION_NAME: "cleanAcctMatchOption"
    },
    DatePickerIds = {
        DOM_ID: "datePicker",
        MONTH_PICKER: "calMonthPicker",
        TABLE_ID: "datePickerCalendar",
        YEAR_PICKER: "calYearPicker"
    },
    Desktop = {
        AUC: "auc",
        AgentConsoleFE: "AgentConsoleFE",
        AgentConsoleS: "AgentConsoleS",
        AgentConsoleX: "AgentConsoleX",
        AgentConsoleY: "AgentConsoleY",
        BROWSER_MAX_URL: "2048",
        CLOSETAB_ACTION: "closeTab",
        CUSTOM_SIDEBAR_COMPONENTS: "sidebarCts",
        ENCLOSING_VIEW_ENTITY_ID: "id",
        IS_DESKTOP: "isdtp",
        IS_IN_CONTEXT_PANE: "inContextPane",
        IS_STD_FOOTER_WIDGET: "isftw",
        IS_WORKSPACE_VIEW: "isWsVw",
        LOCK: "lk",
        NAVIGATOR: "nv",
        NONCE: "nonce",
        OPEN_POPUP_FOCUS: "openPopupFocus",
        OPEN_POPUP_MODAL_FOCUS: "openPopupModalFocus",
        PERF_AUTOMEASURE: "Complete",
        PROJECTONE: "p1",
        REQUEST_ORIGIN: "consoleReqOrigin",
        REQUEST_ORIGIN_MRU_HOVER: "mruhover",
        RESIZE_WIDTH: "resizeWidth",
        SFDCIFRAMEORIGIN: "sfdcIFrameOrigin",
        SIDEBAR_NORMAL_WIDTH_STYLE_PX: "200",
        VIEW: "vw",
        VIEW_HEIGHT_MIN_RATIO: 0.5,
        VIEW_LAYOUT_ID: "layoutId",
        VIEW_WIDTH_MIN_RATIO: 0.5,
        pGOTO_ID: "goToId",
        pGOTO_URL: "goToUrl"
    },
    DesktopSidebarComponents = {
        GOOGLETALK_CONTAINER_ID: "googleTalk",
        MRU_LIST_CONTAINER_ID: "mruList",
        SOFTPHONE_CONTAINER_ID: "softphoneContainer"
    },
    DetailElement = {
        BOTTOM_BUTTON_ROW: "bottomButtonRow",
        DEFAULT_DETAIL_ELEMENT_ID: "ep",
        DEFAULT_ERROR_DIV_ID: "errorDiv_ep",
        TOP_BUTTON_ROW: "topButtonRow"
    },
    DeveloperSettings = {
        LICENSE_MGR_CHOICE_STR: "licenseMgr"
    },
    DurationInputElement = {
        pHOURS_NAME: "hh",
        pMINUTES_NAME: "mi"
    },
    DynamicContent = {
        pCOOKIE_PARAM: "cookieParam",
        pERROR_DESC: "errorDesc",
        pERROR_TITLE: "errorTitle",
        pTYME: "tyme"
    },
    EditElement = {
        CHECKBOX_SUFFIX: "_chkbox",
        ERROR_CLASS: "error",
        FIELD_NAME_CITY: "city",
        FIELD_NAME_COUNTRY: "country",
        FIELD_NAME_FIRST: "name_first",
        FIELD_NAME_INFORMAL: "name_informal",
        FIELD_NAME_LAST: "name_last",
        FIELD_NAME_LATITUDE: "latitude",
        FIELD_NAME_LONGITUDE: "longitude",
        FIELD_NAME_MIDDLE: "name_middle",
        FIELD_NAME_SALUTATION: "name_salutation",
        FIELD_NAME_STATE: "state",
        FIELD_NAME_STREET: "street",
        FIELD_NAME_SUFFIX: "name_suffix",
        FIELD_NAME_ZIP: "zip",
        SELECTED_ID_SUFFIX: "_selected",
        STREET_NUM_COLS: 27,
        STREET_NUM_ROWS: 2,
        UNSELECTED_ID_SUFFIX: "_unselected",
        pAUTO_SUBMITTED_FROM: "lspffrom",
        pBASE_NAME: "lknm",
        pID_SUFFIX: "_lkid",
        pMOD_SUFFIX: "_mod",
        pOLD_NAME_SUFFIX: "_lkold",
        pTYPE_SUFFIX: "_lktp"
    },
    EditEventMultiUserCalendarElementConstants = {
        ADD_AND_REMOVE_INVITEE: 2,
        ADD_INVITEES: 0,
        EDIT_PAGE_CALENDAR: "editEventCalendar",
        EDIT_PAGE_CALENDAR_ADD_INVITEES_FN: "addInvitees",
        EDIT_PAGE_CALENDAR_ADD_INVITEES_ID: "addInviteesButton",
        EDIT_PAGE_CALENDAR_MARKER: "\x3d\x3d\x3dxyzCALENDARzyx\x3d\x3d\x3d",
        REMOVE_INVITEE: 1
    },
    EditPageConstants = {
        NOSAVE: "nosave",
        pCANCEL: "cancel",
        pEDIT_PAGE: "editPage",
        pQUICK_SAVE: "quick_save",
        pSAVE: "save",
        pSAVE_ATTACH: "save_attach",
        pSAVE_CLOSE: "save_close",
        pSAVE_NEW: "save_new",
        pSAVE_NEW_URL: "save_new_url"
    },
    EmailAddrEditConstants = {
        pPASS_IN_EMAIL_ADDRESS: "pass_in_email_address",
        pSAVE_CANCEL: "saveCancel"
    },
    EmailAttachmentManagementConstants = {
        END_DATE_ID: "end_date",
        FILE_NAME_ID: "file_name",
        LOOKUP_URL_ID: "lookup_url",
        SEARCH_BY_DATA: "data",
        SEARCH_BY_URL: "url",
        SENDER_LOOKUP_ID: "sender",
        START_DATE_ID: "start_date"
    },
    EmailAuthorConstants = {
        EMAIL_ADDR_DELIM: "; "
    },
    EmailCCBccLookupConstants = {
        ADDITIONAL_TO_ADDR_ID: "additional_to_addr",
        ADDITIONAL_TO_ID: "additional_to",
        ADDITIONAL_TO_NAME_ID: "additional_to_name",
        BCC_ADDR_ID: "bcc_addr",
        BCC_ID: "bcc",
        BCC_NAME_ID: "bcc_name",
        CC_ADDR_ID: "cc_addr",
        CC_ID: "cc",
        CC_NAME_ID: "cc_name",
        REF_ID: "ref"
    },
    EmailChangeVerification = {
        APP_CONTEXT: "appContext"
    },
    EmailRelayConstants = {
        ACTIVATE_EMAIL_RELAY_ID: "activate_email_relay",
        ACTIVATE_RESTRICT_TO_DOMAINS_ID: "activate_restrict_to_domains",
        EMAIL_HOST_ID: "email_host",
        EMAIL_HOST_PORT_ID: "email_host_port",
        EMAIL_RELAY_TLS_SETTING_ID: "email_relay_tls_setting",
        RESTRICT_TO_DOMAINS_HIDDEN_ID: "restrict_to_domains_hidden",
        RESTRICT_TO_DOMAINS_ID: "restrict_to_domains"
    },
    EmailSyncConfigConstants = {
        ADD_CASE_ID: "add_case",
        ADVANCED_SETTINGS_PARAM: "advanced_settings",
        ADVANCED_SETTINGS_ROW_PREFIX: "adv_row_",
        ADVANCED_SETTINGS_TABLE_ID: "advSettingsTable",
        ALLOW_USER_MODIFY: "_usrMod",
        CONFLICT_RES_STATIC_SUFFIX: "_conf_res_static",
        CONFLICT_RES_SUFFIX: "_conf_res",
        FM_HIDE_SUFFIX: "_fmHideLink",
        FM_ROW_SUFFIX: "_fmRow",
        FM_SHOW_SUFFIX: "_fmShowLink",
        FOLDER_NAME_TXT: "_fdrTxt",
        LAST_ACTIVITY: "lastActivity",
        LAST_MODIFIED: "lastModified",
        MATCH_PREF: "_matchPref",
        MATCH_PREF_DIV: "_matchPrefDiv",
        MATCH_PREF_LABEL: "_matchPrefLabel",
        OLDEST: "oldest",
        OVERRIDE_CONFLICT_SUFFIX: "ocr",
        OVERRIDE_ENT_SUFFIX: "oes",
        OVERRIDE_FOLDERNM_SUFFIX: "fnm",
        OVERRIDE_MAPPINGS_SUFFIX: "ofm",
        OVERRIDE_SYNCDIR_SUFFIX: "osd",
        OWNERSHIP_ALL: "ownership_all",
        OWNERSHIP_SELECTED: "ownership_selected",
        ROUTING_ADDRESS_ID: "outlook_routing_address",
        MANUAL_ES_LABEL: "_manual_es_label",
        MANUAL_ENTITY_SUFFIX: "_manual_entity_sync",
        MANUAL_ENTITY_STATIC_SUFFIX: "_manual_entity_sync_static",
        SYNC_DIR_SUFFIX: "_sync_dir"
    },
    EmailTaskDescriptionServlet,
    TaskDescriptionServlet = {
        TASK_ID_PARAM_KEY: "tid"
    },
    EmailTemplatePreviewConstants = {
        ID_REQUIRED_BLOCK_ID: "_id_required_block",
        LOOKUP_REQUIRED_BLOCK_ID: "_lookup_required_block",
        REQUIRED_BLOCK_CLASS: "requiredBlock"
    },
    EntitySharingConstants = {
        ENTITY_ID: "entityId",
        SHAREDWITH_COMPANY: "c",
        SHAREDWITH_GROUPS: "g",
        SHAREDWITH_NETWORK: "n",
        SHAREDWITH_PARAM: "sw",
        SHAREDWITH_PEOPLE: "p",
        SHARE_OPTION_PARAM_NAME: "so",
        SHARING_CURRENT_TYPE: "currentType",
        SHARING_TYPE: "sharingType"
    },
    EventDescriptionServlet = {
        EVENT_ID_PARAM_KEY: "eid"
    },
    EventObject = {
        ONE_DAY_IN_MINUTES: 1440
    },
    EventPage = {
        CALENDAR_IFRAME_ID: "calendarIFrame",
        MINI_CANCEL_BUTTON_ID: "miniCancel",
        MINI_CANCEL_SAVE_ID: "miniSave",
        MINI_EDIT_PAGE_LINK_ID: "miniEditPageLink"
    },
    EventUi = {
        ALL_DAY_PARAM_NAME: "allDayId",
        CURRENT_USER: "currUser",
        END_DATE_PARAM_NAME: "endDateId",
        END_TIME_PARAM_NAME: "endTimeId",
        EVENT_CONVERT: "convert",
        EVENT_OWNER: "eventOwner",
        LEAD_PREFIX_PARAM_NAME: "leadPrefix",
        PRIVATE_CHECKBOX_PARAM_NAME: "privateCheckboxId",
        RECURRING_EVENT_PARAM_NAME: "isRecurringId",
        REMINDER_DATE_TIME_PARAM_NAME: "reminderDateTimeTimeId",
        START_DATE_PARAM_NAME: "startDateId",
        START_TIME_PARAM_NAME: "startTimeId",
        VISIBLE_IN_SS_PARAM_NAME: "isVisibleInSelfServiceId",
        WHAT_ID_PARAM_NAME: "whatIdId",
        WHAT_LINK_PARAM_NAME: "whatLinkId",
        WHAT_NAME_PARAM_NAME: "whatNameId",
        WHAT_TYPE_PARAM_NAME: "whatTypeId",
        WHO_ID_PARAM_NAME: "whoId",
        WHO_LINK_PARAM_NAME: "whoLinkId",
        WHO_NAME_PARAM_NAME: "whoNameId",
        WHO_TYPE_PARAM_NAME: "whoTypeId",
        pADD_INVITEE_ID: "addInvId",
        pISPERSONACCOUNT: "pip"
    },
    FieldTreeConstants = {
        COLUMN_TYPE: "columnType",
        DB_NAME: "dbName",
        SELECT_ID: "FieldTreeSelect",
        TYPE: "type"
    },
    FilterEditConstants = {
        pCOLUMN: "fcol",
        pDEV_NAME: "devname",
        pNAME: "fname",
        pOPERATOR: "fop",
        pSCOPE: "fscope",
        pVALUE: "fval"
    },
    FilterEditPageConstants = {
        pSEARCH_ANCHOR: "searchAnchor"
    },
    FilterSelectionElement = {
        ON_LOAD_CRITERIA: "onLoadCriteria",
        pCOLUMN: "col",
        pFILTER_VALUE: "fval",
        pOPERATOR: "oper"
    },
    FindSimilarOppsFilter = {
        MAX_DISPLAY_ROWS: 300
    },
    ForecastRoleUser = {
        FORECAST_SHARE_RADIO: "forecastSharingRadios",
        pCAN_SHARE: "allowMgrFctSharing",
        pUSER: "user"
    },
    ForecastSettings = {
        pALLOW_FM_SHARING: "allowFMSharing",
        pFORECAST_SHARING: "forecastSharing"
    },
    ForecastSharingPrefPopup = {
        CAN_SHARE_RADIO: "enableRadio",
        DISABLE_CHECKBOX: "disableCheckbox",
        pIS_FCT_SHARE_ENABLED: "isFctShareEnabled"
    },
    ForecastSummaryPage = {
        pLOOKUP_INPUT_ENTERED: "lookupEntered"
    },
    ForecastingDateRangeServlet = {
        PERIODDURATION: "periodDuration",
        PERIODTYPE: "periodType",
        STARTPERIOD: "startPeriod",
        pDATERANGETYPE: "dateRangeType",
        pPERIODLABELS: "periodLabels"
    },
    ForecastingDisplayedTypeServlet = {
        TYPE_ID: "typeId"
    },
    ForecastingJumpToUserServlet = {
        THUMBNAILURL: "thumbnailUrl",
        USERID: "userId",
        USERNAME: "userName",
        pSEARCH: "search"
    },
    ForecastingPage = {
        BEGIN_PERIOD_CONTROL_NAME: "beginPeriod",
        PERIODS_DISPLAYED_CONTROL_NAME: "periodsDisplayed",
        PERIOD_TYPE: "periodSelect",
        QUANTITY_CONTROL_NAME: "enableQuantity",
        REVENUE_CONTROL_NAME: "enableRevenue"
    },
    ForecastingTabPage = {
        CORP_CONVERSION_SPAN_ID: "corpConvert",
        CURRENCY_INDICATOR: "currencyIndicator",
        CURRENCY_INDICATOR_NAME: "currencyIndicatorName",
        CURRENCY_OVERLAY_CONTENT_DIV_ID: "currencyOverlayContent",
        CURRENCY_SELECT_ERROR_ID: "currencySelectError",
        CURRENCY_SELECT_ID: "currencySelect"
    },
    ForecastingTree = {
        HAS_MY_OVERRIDE_HAS_OTHER_OVERRIDE_INT: 3,
        HAS_MY_OVERRIDE_NO_OTHER_OVERRIDE_INT: 1,
        NO_MY_OVERRIDE_HAS_OTHER_OVERRIDE_INT: 2,
        NO_MY_OVERRIDE_NO_OTHER_OVERRIDE_INT: 0
    },
    ForecastingViewingIsoServlet = {
        CURRENCY: "currency",
        ISO: "iso",
        NAME: "name",
        TYPE: "type"
    },
    GenerateRelationshipDefaults = {
        pAGGREGATE_NAME: "aggregateName",
        pENTITY_NAME: "entityName",
        pMASTER_LABEL: "masterLabel",
        pRELATED_LIST_LABEL: "relatedListLabel",
        pTARGET_ENTITY_NAME: "targetEntityName"
    },
    GoogleDocCreator = {
        CREATE: 0,
        DIALOG_ID: "DocNameInputId",
        DOC_NAME: "docName",
        DOC_TYPE: "docType",
        DOC_UPLOAD: "docUpload",
        DOC_UPLOAD_NAME: "docUploadName",
        FORM_NAME: "googleDocForm",
        METHOD: "method",
        PARENT_ID: "parentId",
        UPLOAD: 1
    },
    GoogleTalkConstants = {
        COLLAPSED_COOKIE: "gTalkCollapsed",
        COLLAPSED_HEIGHT: 0,
        EXPANDED_HEIGHT: 400,
        HEIGHT_COOKIE: "gTalkHeight",
        MIN_EXPANDED_HEIGHT: 22
    },
    HTPortal = {
        pBODY: "body",
        pCLASS_DAY: "R_DAY",
        pCLASS_NAME: "cname",
        pFEATURE: "feature",
        pID: "id",
        pLOCATION: "loc",
        pORG_ID: "orgId",
        pSECTION: "section",
        pSELECT_LOCATION: "sel_loc",
        pTARGET: "target",
        pTRACK: "track"
    },
    HelpBubbleConstants = {
        CLASS_ADD_GROUP_MEMBERS_HELP_BUBBLE: "addGroupMembersHelpBubble",
        CLASS_CHANGE_EMAIL_SETTINGS_HELP_BUBBLE: "changeGroupEmailSettingsHelpBubble",
        CLASS_CHATTER_INVITE_HELP_BUBBLE: "chatterInviteHelpBubble",
        CLASS_CREATE_GROUP_HELP_BUBBLE: "createGroupHelpBubble",
        CLASS_FOLLOW_PEOPLE_HELP_BUBBLE: "followPeopleHelpBubble",
        CLASS_INVITE_PEOPLE_BUBBLE: "invitePeopleHelpBubble",
        CLASS_JOIN_GROUP_HELP_BUBBLE: "joinGroupHelpBubble"
    },
    HighlightsPanelConstants = {
        CELL_DIV_CLASS: "hp_cell",
        DRAWER_ID: "highlights_panel_drawer",
        HIGHLIGHTS_PANEL_ID: "highlights_panel",
        HOVER_CLASS: "hp_hover",
        HOVER_ICON_CONTAINER_CLASS: "hp_hover_icons",
        HOVER_LABEL_CLASS: "hp_hover_label",
        HOVER_VALUE_CLASS: "hp_hover_value",
        LABEL_CLASS: "hp_label",
        LABEL_ELLIPSIS_CLASS: "hp_label_ellipsis",
        ROW_PREFIX_CLASS: "hp_row",
        SINGLE_ITEM_COLUMN_CLASS: "hp_single_item_col",
        VALUE_CLASS: "hp_value",
        VALUE_ELLIPSIS_CLASS: "hp_value_ellipsis"
    },
    HolidayUi = {
        END_TIME_PARAM: "endtime",
        START_TIME_PARAM: "sttime"
    },
    HomeCalendarAjaxServlet = {
        ACTIVE_TAB_ID: "activeTabId",
        HOME_CALENDAR_ID: "homeCalendarSection",
        HTML_PAYLOAD_PARAM: "htmlPayload",
        PROPOSED_EVENT_TAB_PARAM: "pe",
        SERVLET_NAME: "core.activity.scheduling.HomeCalendarAjaxServlet"
    },
    HoverTooltipElement = {
        DEFAULT_CLASS_TEXT: "mouseOverText"
    },
    IFrameElement = {
        BLANK_SRC: "javascript: ''",
        EmptyRelatedListDoc: "emptyHtmlDoc.html"
    },
    Ideas = {
        COOKIE_IDEA_TOGGLE: "ideaToggle"
    },
    InlineEditConstants = {
        AFTER_SAVE_REDIRECT_URL: "afterSaveUrl",
        CANCEL_BUTTON: "inlineEditCancel",
        CELL_ID: "_ilecell",
        COLUMN_ID: "columnId",
        COLUMN_LABEL: "label",
        COLUMN_NAME: "columnName",
        CONSOLE_LOOKUP_DOMID: "luDomId",
        DYNAMIC_DATA: "dynamicData",
        EDITABLE: "editable",
        ENTITY_ID: "entityId",
        ENTITY_TYPE: "entityType",
        EVAL_JAVASCRIPT: "evalJavascript",
        FIELD_DATA: "fields",
        FIELD_ID: "fieldId",
        FIELD_REQUIRED: "required",
        FIELD_STATE: "state",
        FIELD_TYPE: "fieldType",
        FIELD_VALUE: "initialValue",
        IDS: "recordIds",
        INIT_HOOK: "initHook",
        INNER_ID: "_ileinner",
        IS_PERSON: "isPerson",
        IS_TASK: "isTask",
        LAST_MOD: "sysMod",
        LAYOUT_INFO: "layoutInfo",
        MASS_EDITABLE: "massEditable",
        MAX_SAVE: 200,
        NAME_LABEL: "nameLabel",
        NON_SPECIFIC_ERRORS: "nonSpecificErrors",
        NULLABLE: "nullable",
        OVERRIDE_TYPE: "overrideType",
        ROLODEXABLE: "useRolodex",
        SAVED: "saved",
        SAVE_BUTTON: "inlineEditSave",
        SAVE_URL: "saveUrl",
        SORTABLE: "isSortable",
        SUCCESS: "success",
        VALIDATION_ERRORS: "validationErrors",
        VF_ENABLED: "visualforce"
    },
    InlineHelp = {
        CLASS_NAME: "helpButton",
        CLASS_NAME_HOVER: "helpButtonOn",
        DISPLAY_DIV_CLASS: "helpText",
        ID_SUFFIX: "-_help",
        ORB: "helpOrb",
        SUFFIX_DELIMITER: "-_"
    },
    InlineScontrolElement = {
        DEFAULT_HEIGHT: 200,
        DEFAULT_WIDTH: -100
    },
    InviterLookup = {
        EMAIL_ADDRESS_REQUIRED: "emailreq",
        HIDE_SEARCH_TYPES: "hidetype",
        MAX_TOTAL_ATTENDEES: "maxtotalattendees",
        RETURN_INVITEE_DATA: "returnmore",
        pINVITED_IDS: "invtdids",
        pINVITEE_ID_SELECTED: "invsel"
    },
    InviterLookupMatch = {
        EMAIL: "email",
        ID: "id",
        NAME: "name",
        TYPE: "type",
        TYPE_CONTACT: "contact",
        TYPE_LEAD: "lead",
        TYPE_USER: "user"
    },
    JSPDispatcher = {
        NONSTANDARD_PACKAGE_PREFIX: "_ui/",
        PACKAGE_MARKER: "p/",
        STANDARD_PACKAGE: "ui"
    },
    JigsawImport = {
        EI: "ei",
        ERRORS: "globalErrors",
        IMPORT_ALL: "importAll",
        IMPORT_SELECTED: "importSelected",
        IMPORT_TARGET_TYPE: "targetType",
        MESSAGE: "message",
        METHOD: "method",
        RESULT: "result",
        SELECTED_IDS: "selectedIds",
        SUCCESS: "globalSuccess",
        TOTAL_ROWS: "totalRows"
    },
    JigsawSearch = {
        COMPANY_SEARCH_OPTIONS: "companySearchOptions",
        CONTACT_SEARCH_OPTIONS: "contactSearchOptions",
        EI: "ei",
        ST: "st"
    },
    Kb2Id = {
        MAIN_ARTICLE_LIST_ID: "articleList"
    },
    KnowledgeSettingsUI = {
        LANG_CONFIG_ADDER_ROW: -1,
        LANG_CONFIG_TABLE: "langtbl",
        WRAPPING_NEWROW_DIV: "newLanguageSetting",
        pASSIGNEE_PREFIX: "da_",
        pEXISTING_LANG_COUNT: "oldlangc",
        pLANG_PREFIX: "la_",
        pLANG_SELECT_PREFIX: "las_",
        pMAX_LANG_ROW_INDEX: "mlangri",
        pREMOVE_PREFIX: "rm_",
        pREVIEW_PREFIX: "dr_",
        pSTATUS_PREFIX: "st_"
    },
    ListView = {
        ACTION_COLUMN: "ACTION_COLUMN",
        ACTION_COLUMN_LABELS: "ACTION_COLUMN_LABELS",
        CHECKBOX_COLUMN: "checkbox",
        CHECKBOX_ID: "ids",
        DEFAULT_ROWS_PER_PAGE: 25,
        ID_COLUMN: "LIST_RECORD_ID",
        SELECT_ALL_BOX_ID: "allBox",
        RESULT_ICON_COLUMN: "RESULT_ICON_COLUMN"
    },
    LiveAgentAddToTranscriptSearch = {
        ADD_TO_TRANSCRIPT_SEARCH_ENT_PARAM: "addToTranscriptEntitySearch",
        ADD_TO_TRANSCRIPT_SEARCH_VAL_PARAM: "addToTranscriptValueSearch",
        JSON_ADD_TO_TRANSCRIPT_KEYWORD_TOO_SHORT_KEY: "addToTranscriptKeywordTooShort",
        JSON_ADD_TO_TRANSCRIPT_SEARCH_KEY: "addToTranscriptSearchPageUrl",
        JSON_ISADD_TO_TRANSCRIPT_SEARCH_KEY: "isAddToTranscriptSearch"
    },
    LiveAgentAutoQuery = {
        DETAILS_PARAM: "details",
        JSON_DETAILPAGEURL_KEY: "detailPageUrl",
        JSON_NORESULTS_KEY: "noResults",
        PAGE_URL: "/liveagent/autoquery.apexp"
    },
    LiveAgentConsoleAjaxServlet = {
        ADDTOTRANSCRIPT_SEARCH_COMMAND: "ADDTOTRANSCRIPT_SEARCH",
        AUTOQUERY_SEARCH_COMMAND: "AUTOQUERY_SEARCH",
        CHAT_KEY_PARAM: "chatKey",
        COMMAND_PARAM: "cmd",
        ENTITIES_ID_PARAM: "eids",
        ENTITY_ID_PARAM: "eid",
        FILEADD_PARAM: "isAdd",
        FILETOKEN_COMMAND: "FILETOKEN",
        FINDORCREATE_COMMAND: "FINDORCREATE",
        GET_NAME_COMMAND: "GET_NAME",
        JSON_ENTITIES_NAME: "names",
        JSON_ENTITY_NAME: "name",
        JSON_ENTITY_TYPE: "type",
        JSON_FILE_TOKEN: "token",
        JSON_STATUS: "status",
        JSON_SUCCESS_KEY: "success",
        SERVLET_URL: "/_ui/support/liveagent/servicedesk/ajax/ConsoleAjaxServlet"
    },
    LiveAgentConstants = {
        CHAT_ID_PARAM: "chatId"
    },
    LiveAgentFindOrCreate = {
        FINDORCREATE_PARAM: "findorcreate",
        ISTRANSFERRED_PARAM: "isTransferred",
        JSON_FINDORCREATE_KEY: "findOrCreatePageUrl",
        JSON_ISFINDORCREATE_KEY: "isFindOrCreate",
        SAVE_TO_TRANSCRIPT: "SaveToTranscript"
    },
    LiveChatButtonConstants = {
        pAND: "fand",
        pERROR: "ferror",
        pID: "fid",
        pNAME: "fname",
        pOP: "fop",
        pORDER: "fo",
        pROW: "frow",
        pTYPE: "ftype",
        pVALUE: "fval"
    },
    LookupInputElement = {
        DIALOG_ID: "LookupOverlayDialog",
        LOOKUP_IFRAME: "lookupIFrame",
        pLOOKUP_WIDGET: "_lkwgt"
    },
    LookupUi = {
        pSEARCH_VALUE: "lksrch"
    },
    LookupValidationServlet = {
        pDEPDATA_NAME: "aclkdata",
        pENTITY_NAME: "acent",
        pFILTER_RESULTS: "filterresults",
        pLKENTITY_NAME: "aclkent",
        pLKFIELD_NAME: "aclkfield",
        pLKID_NAME: "aclkid"
    },
    LookupsUi = {
        FIELD: "field",
        LOOKUPS: "lookups",
        PATH: "path"
    },
    MCFilterPaneParams = {
        NONE_SCOPE_VALUE: "-1",
        pMAX_RECORD_RADIO: "maxRecordRadio",
        pNO_LIMIT: "noLimit",
        pORDER_BY_DIV: "orderBySection",
        pSCOPE: "ofscope",
        pSET_LIMIT: "setLimit"
    },
    MCXHRParams = {
        pAction: "ACT",
        pCollisionParam: "LMT",
        pData: "data",
        pFilterItemCount: "itemCount",
        pIsSuccess: "isSuccess",
        pLoadObjId: "LOI",
        pLoadObjRelField: "LORF",
        pLoadObjType: "LOT",
        pQSTestResults: "qsTestResults",
        pSaveObjId: "SOI",
        pSaveObjParentId: "SPI",
        pSaveObjRelField: "SORF",
        pSaveObjType: "SOT",
        pScope: "scope",
        pTestResultConfigError: "configError",
        pTestResultDataSize: "dataSize",
        pTestResultQSID: "id",
        pTestResultRecordCount: "recordCount",
        pTotalsElement: "totalsElement"
    },
    MRUAutoCompleteServlet = {
        DEPDATA_PARAM: "aclkdata"
    },
    MWPicker = {
        ADD_BUTTON: "add_button",
        CANCEL_BUTTON: "cancel_btn",
        DONE_BUTTON: "save_btn",
        FOUND_LABEL: "found_label",
        FOUND_LIST: "found_list_id",
        HEADER_LABEL_ID: "header_label",
        INNER_SELECTED_DIV: "inner_selected_div",
        INVITEE_PICKER_ID: "invitee_picker_",
        LIMIT_EXCEEDED_MESSAGE: "limit_exceeded_message",
        LISTS_AREA: "list_area",
        LIST_ITEM_PREFIX: "list_item_",
        LIST_ROW: "list_row",
        LOADING_ICON_DIV: "loading_icon_div",
        MAX_EVENT_INVITEES: 1E3,
        MAX_RECURRING_EVENT_INVITEES: 100,
        MW_PICKER_ID: "mw_picker_",
        OVERLAY_DIV: "overlay_div",
        OVERLAY_PANEL: "overlay_panel",
        OVER_LIMIT_MESSAGE: "overlimit_results_message",
        PRIMARY_BUTTON: "primary_button",
        REMOVE_BUTTON: "remove_button",
        SEARCH_BUTTON: "search_btn",
        SEARCH_CLEAR_TEXT_BUTTON: "search_clear_text_btn",
        SEARCH_INPUT: "search_prefix",
        SEARCH_TABLE: "search_table",
        SEARCH_TYPES: "search_types",
        SELECTED_LABEL: "selected_label",
        SELECTED_LIST: "selected_list_id",
        SERVLET_NAME: "core.activity.ActivityRelationSearchServlet",
        TELL_ME_MORE_LINK: "tell_me_more_link",
        WHO_COUNT_MAX: 50
    },
    MacroPage = {
        ACTION_SELECT_ELEMENT_CLASS: "actionSelectElement",
        ACTION_TABLE: "actionTable",
        COMPONENTS_LIST: "componentsList",
        CONTEXT: "pContext",
        INPUT_FIELD: "pInput_Field",
        INPUT_VALUE_RECORD_ARTICLE: "pInput_Value_Record_Article",
        INPUT_VALUE_RECORD_EMAILTEMPLATE: "pInput_Value_Record_EmailTemplate",
        INPUT_VALUE_RECORD_QUICKTEXT: "pInput_Value_Record_QuickText",
        INPUT_VALUE_TEXT: "pInput_Value_Text",
        INPUT_VALUE_TEXTAREA: "pInput_Value_TextArea",
        OPERATION: "pOperation",
        REMOVE_LINK_ID: "removeLink",
        TARGET: "pTarget",
        TARGET_RECORD_QUICKACTION: "pTarget_Record_QuickAction"
    },
    MailmergeTemplateSelectElementConst = {
        TEMPLATE_DESCRIPTION: "mmtse_description",
        TEMPLATE_ID: "mmtse_id",
        TEMPLATE_TITLE: "mmtse_title",
        TEMPLATE_VIEW_BUTTON: "mmtse_preview"
    },
    ManageableInfo = {
        DHTML_ID: "manageableInfo",
        MORE_INFO_CLASS: "manageableMoreInfo"
    },
    MapServletParams = {
        APP_VERSION: "version",
        MAP_DATA_PARAM: "mapData",
        MAP_REQUEST_TYPE: "ApexMap",
        ORIG_REQUEST_ID: "origRequestId",
        REQUEST_TYPE: "type",
        SIGNATURE_PARAM_NAME: "AuthSignature",
        TIMESTAMP: "timestamp"
    },
    MenuButtonElement = {
        BUTTON: "Button",
        GO_BUTTON: "Go",
        LABEL: "Label",
        MENU: "Menu",
        SELECT: "Select"
    },
    MobilePushServiceTest = {
        pRecipientLookup: "recipient_lookup"
    },
    MotifInputElementConst = {
        FIELD_NAME_DESCRIPTION: "motifClass",
        FIELD_NAME_ICON: "motifIcon",
        FIELD_NAME_MOTIF: "motifName",
        MOTIF_ELEMENT_SUFFIX: "motifElement"
    },
    MouseOverElement = {
        DEFAULT_CLASS: "mouseOverInfoOuter",
        DEFAULT_CLASS_INNER: "mouseOverInfo"
    },
    MultiLookupInputElement = {
        MULTI_LOOKUP_BUTTON_SUFFIX: "_mlbtn",
        MULTI_LOOKUP_SELECT_SUFFIX: "_mlktp"
    },
    MultiSelectList = {
        allOrNoneCheckbox: "allOrNone",
        availableCheckboxPrefix: "chk_",
        availableFrameId: "available",
        availableRowPrefix: "row_",
        availableTableId: "availableTable",
        deselectLabelId: "deselectLabel",
        listEmptyLabelId: "listEmptyLabel",
        nameCellPrefix: "name_",
        pFILTER_TYPE: "filterType",
        pIDS: "selectedIds",
        pSELECT_ALL: "msl_selectAll",
        pTOTAL_ROW_COUNT: "msl_totalRowCount",
        pTOTAL_ROW_COUNT_FILTER: "msl_totalRowCountFilter",
        pUNSAVED_IDS: "unsavedIds",
        selectLabelId: "selectLabel",
        selectedCheckboxPrefix: "uch_",
        selectedFrameId: "selected",
        selectedRowPrefix: "sel_",
        selectionsTableId: "selections"
    },
    MultiUserCalendar = {
        SHOW_NAMES_BOTH: "0",
        SHOW_NAMES_LEFT: "1",
        SHOW_NAMES_NONE: "3",
        SHOW_NAMES_RIGHT: "2"
    },
    MyCustomObjectConstants = {
        ANALYTICS_REPORT_OVERLAY_ID: "myCustomObjectReportOverlayDialogId",
        DETAILPAGE_ACTION_PANEL_CREATE_REPORT_ID: "actionCreateReportId",
        DETAILPAGE_ACTION_PANEL_DELETE_TABLE_ID: "actionDeleteTableId",
        DETAILPAGE_ACTION_PANEL_EDITDETAILS_ID: "actionEditDetailsId",
        DETAILPAGE_ACTION_PANEL_EDITTABLE_ID: "actionEditTableId",
        DETAILPAGE_ACTION_PANEL_SHARE_ID: "actionShareId",
        DETAILPAGE_GRIDPANEL_ID: "myCustomObjectViewerPanelId",
        DETAILPAGE_REPORTS_SHOW_ALL_LINK_ID: "viewAllReportsLinkId",
        EDITPAGE_TOOLBAR_ADDCOLUMN_ID: "toolbarButtonAddColumnId",
        EDITPAGE_TOOLBAR_ADDROW_ID: "toolbarButtonAddRowId",
        EDITPAGE_TOOLBAR_CLOSE_ID: "toolbarButtonCloseId",
        EDITPAGE_TOOLBAR_CREATEREPORT_ID: "toolbarButtonCreateReportId",
        EDITPAGE_TOOLBAR_PROMOTE_ID: "toolbarButtonPromoteId",
        EDITPAGE_TOOLBAR_SAVE_ID: "toolbarButtonSaveId",
        EDITPAGE_TOOLBAR_SHARE_ID: "toolbarButtonShareId",
        EDIT_TABLE_CONFIG_KEY_TYPE: "editType",
        EDIT_TABLE_CONFIG_KEY_TYPE_DESCRIPTION: "editTableDescription",
        EDIT_TABLE_CONFIG_KEY_TYPE_TABLE_DETAIL: "editTableDetail",
        MAX_VISIBLE_COUNT: 5,
        TABLE_CONFIG_KEY_MCOID: "mcoId",
        TABLE_CONFIG_KEY_TABLENAME: "tableName",
        TABLE_CONFIG_KEY_TABLE_DESCRIPTION: "tableDescription"
    },
    NewLayoutEditor = {
        AURA_COMPONENT_ID_PREFIX: "AURA__",
        BLANK_ID: "__BLANK",
        CANVAS_ID_PREFIX: "CANVAS__",
        PAGE_ID_PREFIX: "PG__",
        RELATED_LOOKUP_ID_PREFIX: "RLo__",
        RL_ID_PREFIX: "RL__",
        STD_BTN_PREFIX: "BTN__"
    },
    NonUddKeyConstants = {
        SUBKEY_SEPARATOR: "___"
    },
    OrganizerPage = {
        MAX_TOTAL_ATTENDEES: 50,
        PROPOSE_TIME_MODE_AUTO: "AUTO",
        PROPOSE_TIME_MODE_MANUAL: "MANUAL"
    },
    PersonalSetup = {
        PERSONAL_SETUP_MODERATORS: "Moderators",
        PERSONAL_SETUP_NODE_STR: "PersonalSetup"
    },
    PersonalSetupConstants = {
        HELP_URL: "helpUrl",
        SHOW_HIDE_HELP_LINK: "showHideHelpLink"
    },
    PortalStyleConfigEditorConstants = {
        PARAM_PREFIX: "p_"
    },
    ProfileEditConstants = {
        CRUD_CREATE: "crudCreate",
        CRUD_CUSTOMIZE_SETUP: "crudCustomizeSetup",
        CRUD_DELETE: "crudDelete",
        CRUD_DELETE_SETUP: "crudDeleteSetup",
        CRUD_MODIFY_ALL: "crudModifyAll",
        CRUD_READ: "crudRead",
        CRUD_UPDATE: "crudUpdate",
        CRUD_VIEW_ALL: "crudViewAll",
        CRUD_VIEW_SETUP: "crudViewSetup"
    },
    ProfileListInlineEditConstants = {
        DISABLE_PERMISSION: "disabledPermissionHtml",
        ENABLE_PERMISSION: "enabledPermissionHtml"
    },
    QuickTextAutoCompleteServlet = {
        CHANNEL_PARAM: "channel",
        QUICK_TEXT_BULKUPDATEMRU: "qtBulkUpdateMru",
        QUICK_TEXT_ID_PARAM: "qtIdParam",
        QUICK_TEXT_TRIGGER_KEY: "qtTrig",
        QUICK_TEXT_WHAT_ID: "qtWhatId",
        QUICK_TEXT_WHO_ID: "qtWhoId",
        REQUEST_TYPE_LOOKUP: "1",
        REQUEST_TYPE_PARAM: "reqType",
        REQUEST_TYPE_SEARCH: "0",
        REQUEST_TYPE_UPDATEMRU: "2"
    },
    RelatedListPrioritizationServlet = {
        pCONFIG_KEY: "configKey",
        pMOVED: "moved",
        pPOSITION: "position",
        pRELATIVE: "relative"
    },
    RelatedListServlet = {
        pParentId: "parentId",
        pRlId: "rlId"
    },
    RelatedListSuppressionServlet = {
        pCONFIG_KEY: "configKey",
        pSUPPRESS: "suppress"
    },
    ReportChartMetadataServlet = {
        HAS_CHART: "hasChart",
        HAS_DASHBOARDSETTINGS: "hasDBSettings",
        IS_MULTIBLOCK_REPORT: "isMultiBlockReport",
        NAME_FROM_DASHBOARDSETTINGS: "nameFromDbSettings",
        REPORT_AGGREGATES: "reportAggregates",
        REPORT_CHART_AGGS: "chartAggs",
        REPORT_CHART_DIMS: "chartDims",
        REPORT_GROUPINGS: "reportGroupings",
        REPORT_ID: "reportId",
        SERVLETURL: "analytics.dashboard.servlet.ReportChartMetadataServlet",
        SUCCESS: "success",
        TOPN: "topN",
        TOPN_NAMES: "topNNames",
        TOPN_VALUES: "topNValues",
        VALUE_FROM_DASHBOARDSETTINGS: "valueFromDbSettings"
    },
    ReportConstants = {
        YES: "yes",
        pDELREP: "delrep",
        pDRILLDOWN: "drilldown",
        pDRILLDOWN_BREAK: "drillbreak",
        pDRILLDOWN_COL: "drillcol",
        pDRILLDOWN_OPERATOR: "drillop",
        pDRILLDOWN_VAL: "drillval",
        pEDIT: "edit",
        pSubTotalBy0: "subtotalBy0"
    },
    ReportsFch = {
        FCH_AREA: "fchArea",
        FLOATING_HEADER: "floatingHeader",
        HEADER_ROW: "headerRow"
    },
    RequestInfo = {
        pSID: "sid"
    },
    RoleTreeCookieConstants = {
        COOKIE_KEY: "roleopen"
    },
    RtaImageServlet = {
        RTA_IMAGE_SERVLET_URL: "/servlet/rtaImage?"
    },
    RuleFilterPageConstants = {
        NO_REASSIGN_SUFFIX: "_noReassign"
    },
    ScheduleElement = {
        pDailyEveryNDays: "dn",
        pDailyRec: "dr",
        pDayOfWeek: "ww",
        pEndDate: "end",
        pFreq: "freq",
        pMonthlyOnDayN: "mdom",
        pMonthlyOnNDayOfWeek: "mdn",
        pMonthlyOnNthDay: "mond",
        pMonthlyRec: "mr",
        pOtherPrefTimeLabelDiv: "otherPrefTimeLabel",
        pOuterBox: "outerBox",
        pPrefTime: "pst",
        pPrefTimeDiv: "prefTime",
        pPrefTimeLabelDiv: "prefTimeLabel",
        pPrefTimeLoadingDiv: "prefTimeLoad",
        pStartDate: "start"
    },
    SchedulePage = {
        pBlowout: "bout",
        pDuelOuter: "duelOuter",
        pEmailUrog: "eurog",
        pIsOffPeak: "isoffpeak",
        pJobType: "jt",
        pNotifyMe: "nm",
        pNotifyOthers: "no"
    },
    SchedulingUtils = {
        OVERLAY_DIALOG_WIDTH: "877",
        SCHEDULING_URL_KEY: "sched"
    },
    SchemaBuilder = {
        FILTER_ALL: "all",
        FILTER_CUSTOM: "cus",
        FILTER_SELECTED: "sel",
        FILTER_STANDARD: "std",
        FILTER_SYSTEM: "sys",
        HIERARCHY: "hi",
        LOOKUP: "lu",
        MASTER_DETAIL: "md",
        NON_SPECIFIC_ERROR: "nonSpecificError",
        pALL_FLDS_LOADED: "afl",
        pCHECKBOXLABEL: "checkBoxLabel",
        pDATAEXPORTMESSAGE: "dataExportMessage",
        pDATATYPE: "dt",
        pDATATYPE_FORMULA: "Z",
        pDELETEMSG: "deleteMsg",
        pDOMAIN: "d",
        pEDIT_PROFILE_FLAG: "epf",
        pENTITYID: "eid",
        pFIELDS: "flds",
        pFILTER_OPTIONS: "filter_opts",
        pHASERRORFLAG: "hasError",
        pHIDDEN: "h",
        pHIDE_LEGEND_FLAG: "hlf",
        pID: "id",
        pIS_CUSTOM: "cust",
        pLABEL: "l",
        pLAYOUTID: "sblid",
        pLAYOUT_ITEM_ID: "sblitemid",
        pLEFT: "le",
        pLISTELEMENTLABELS: "listElementLabels",
        pMANAGED_STATE: "man",
        pMESSAGETOP: "messageTop",
        pNAME: "n",
        pOBJECTS: "objs",
        pRELATEDELEMENT: "relatedElement",
        pRELATIONSHIP: "rel",
        pREL_FIELDS: "rflds",
        pREQUIRED: "r",
        pSBLAYOUT: "sbl",
        pSHOW_LABELS_FLAG: "slf",
        pSHOW_RELATIONSHIP_FLAG: "srf",
        pSOFTDELETEINFOMESSAGE: "softDeleteInfoMessage",
        pTOP: "to",
        pTYPE: "t",
        pURL: "u",
        pWASDELETEDFLAG: "wasDeleted"
    },
    SchemaBuilderConfig = {
        MAX_FIELDS: 25,
        MAX_OBJECTS: 200
    },
    SearchClickLogging = {
        CLK_ENTITY_BUCKET_RANK_PARAM_NAME: "clkBucketRank",
        CLK_ENTITY_NAME_PARAM_NAME: "clkEntityName",
        CLK_FILTER_PARAM_NAME: "clkFilter",
        CLK_ID_HASH_PARAM_NAME: "clkIdHash",
        CLK_IS_TAGGING_PARAM_NAME: "clkIsTagging",
        CLK_LOG_FLAG_PARAM_NAME: "clkLogFlag",
        CLK_NUM_RESULTS_FOR_ENTITY_BEFORE_DB_PARAM_NAME: "clkNumResultsForEntityBeforeDb",
        CLK_NUM_RESULTS_PER_PAGE_PARAM_NAME: "clkNumResultsPerPage",
        CLK_PAGE_NUM_PARAM_NAME: "clkPageNum",
        CLK_QUERY_GUID_PARAM_NAME: "clkQueryGuid",
        CLK_RANK_PARAM_NAME: "clkRank",
        CLK_RECORDID_PARAM_NAME: "clkRecordId",
        CLK_RESULT_LIST_PARAM_NAME: "clkResultList",
        CLK_RESULT_ORDERING_PARAM_NAME: "clkSort",
        CLK_TOTAL_RESULTS_FOR_ENTITY_PARAM_NAME: "clkCount",
        MAC_LOG_FLAG_PARAM_NAME: "macLogFlag",
        MAC_POSITION_PARAM_NAME: "macPosition",
        MAC_RECORD_ID_PARAM_NAME: "macRecordId",
        MAC_RECORD_NAME_PARAM_NAME: "macRecordName",
        MAC_SEARCH_AREA_PARAM_NAME: "macSearchArea",
        MAC_SEARCH_STRING_PARAM_NAME: "macSearchString"
    },
    SearchRelatedList = {
        ALL_STATES_PREFIX: "allStates_",
        COLUMN_PARAMETER: "columns",
        COLUMN_SELECTOR_PREFIX: "selector_",
        COMBO_BUTTON_ID: "comboButton",
        ENTITY_PARAMETER: "entity",
        ERROR_DIV_ID_PREFIX: "srchErrorDiv_",
        FILTER_FIELDS_PARAM: "sFltrFields",
        FILTER_FIELDS_PREFIX: "field_name_",
        FILTER_FIELDS_SAVE_PREFIX: "save_filter_",
        FILTER_FIELD_FORM_PREFIX: "field_name_form_",
        HIDE_FILTERS_ID: "hideFiltersId",
        LIST_LAYOUT_TYPE_PARAMETER: "layoutType",
        PER_ENTITY_VALUE: "perEntityValue",
        SEARCH_ACTION_IDENTIFIER_PARAM: "aId",
        SEARCH_IDENTIFIER_PARAM: "searchId",
        SHOW_FILTERS_ID: "showFiltersId",
        SearchFilterInfoServletName: "SearchFilterInfo",
        SearchUserLayoutServletName: "UserSearchListLayout",
        ShouldNotLookUp: "noLookUp",
        pENTITY_ALL: "0",
        pSEARCH: "search",
        pSEARCH_STR: "str"
    },
    SearchSettingsConstants = {
        DEFAULT_SEARCH_ENTITY_CHECKBOX_ID: "defaultSearchEntityCheckbox",
        DEFAULT_SEARCH_ENTITY_PICKLIST_ID: "defaultSearchEntityPicklist",
        OPTIMIZE_SEARCH_FOR_CJK_NAME: "optimizeSearchForCJK",
        OPTIMIZE_SEARCH_FOR_CJK_WARNING: "optimizeSearchForCJKWarning",
        SIDEBAR_SEARCH_ENTITY_PICKER_ID: "enableSidebarSearchEntityPicker"
    },
    SeascLogRecordHandler = {
        ASC_POSITION_FIELD: "position",
        ASC_RECORD_ID_FIELD: "recordId",
        ASC_SEARCH_STRING_FIELD: "searchString",
        ASC_SUGGESTION_TYPE_FIELD: "suggestionType"
    },
    SectionElement = {
        LEFT_TABLE_CLASS: "detailList",
        NAME_VALUE_BLOCK_CLASS: "nameValueBlock",
        WIDE_FIELD_CLASS: "wideField"
    },
    ServiceDeskHotkeyEditor = {
        ACTIVE_CHECKBOX_PARAM: "pActiveCheckbox",
        ADD_CUSTOM_HOTKEY_ID: "_addHotkey",
        ATTRIBUTE_HOTKEY_TYPE: "hotkeytype",
        CATEGORY: "category",
        CONFIG_SECTION_ID: "keyConfigSectionId",
        CUSTOM_HOTKEY_PARAM: "pCustomHotkey",
        C_DELETE_DIALOG_ID: "customDeleteHotkeyId",
        C_DIALOG_KEY_COMBO_ID: "c_keyComboDialogId",
        C_DIALOG_KEY_DESC_ID: "c_keyDescriptionDialogId",
        C_DIALOG_KEY_EVENT_ID: "c_keyEventDialogId",
        C_DIALOG_KEY_NAME_ID: "c_keyNameDialogId",
        C_HOTKEY_DIALOG_ID: "customHotkeyDialogId",
        C_HOTKEY_ROW_ID: "customHotkeyRowId",
        C_HOTKEY_TABLE: "customHotkeyTable",
        C_TABLE_KEY_COMBO_ID: "c_keyComboTableId",
        C_TABLE_KEY_DESC_ID: "c_keyDescTableId",
        C_TABLE_KEY_EVENT_ID: "c_keyEventTableId",
        C_TABLE_KEY_NAME_ID: "c_keyNameTableId",
        DEFAULT_HOTKEY_DIALOG_ID: "defaultHotkeyDialogId",
        DEFAULT_HOTKEY_PARAM: "pDefaultHotkey",
        DIALOG_KEY_COMBO_ID: "dialogKeyComboId",
        DIALOG_KEY_NAME_ID: "dialogKeyNameId",
        KEY_COMBO_CELL: "keyComboCell",
        K_EVENT_NAME: "eventName",
        K_ID: "id",
        K_KEY_COMBO: "keyCombo",
        K_KEY_DESC: "keyDesc",
        K_KEY_NAME: "keyName",
        TABLE_KEY_COMBO_ID: "tableKeyComboId",
        TABLE_KEY_NAME_ID: "tableKeyNameId"
    },
    ServiceDeskPage = {
        SERVICE_DESK_TAB_STATES_VALID: "sdtsvalid"
    },
    SessionTimeServlet = {
        TIMEOUT: "sr",
        TIMEOUTP: "sp"
    },
    SetupSearchElement = {
        ATT_SEARCH_TEXT: "searchText",
        SETUP_SEARCH_PARAM: "setupSearch"
    },
    SetupTreeNodeConstants = {
        COOKIE_KEY: "setupopen"
    },
    SideTabPreferenceServlet = {
        pCONFIG_KEY: "configKey",
        pCONFIG_LIST: "configList",
        pIS_COLLAPSED_PARAM: "isCollapsed",
        pQUERY_ORDER_PARAM: "tabIndex",
        pSAVE: "save",
        pTAB_NAME_PARAM: "tabName"
    },
    SidebarConstants = {
        HANDLEBAR_CONTAINER: "handlebarContainer",
        HANDLE_ID: "handle",
        PIN2_INDICATOR_ID: "pinIndicator2",
        PIN_INDICATOR_ID: "pinIndicator",
        SIDEBAR_COLLAPSED_CLASS: "sidebarCollapsed",
        SIDEBAR_DIV_ID: "sidebarDiv",
        SIDEBAR_PINNED_COOKIE: "sidebarPinned",
        pSEARCH_SIDEBAR_STR: "sbstr"
    },
    SidetabConstants = {
        BACK_TO_TOP_BTN_ID: "st:BackToTopBtn",
        CANVAS_BODY_PANEL_ID: "st:CanvasBodyPanel",
        DEALVIEW_DETAIL_PANEL_DIV_ID: "dvDetailsPanelDiv",
        DEALVIEW_FEED_PANEL_DIV_ID: "dvFeedPanelDiv",
        DEALVIEW_GENIUS_PANEL_DIV_ID: "dvGeniusPanelDiv",
        DEALVIEW_LOADING_IMG_ID: "dvLoadingImg",
        DEALVIEW_LOADING_MESSAGE_PANE_ID: "dvLoadingMessagePane",
        DEALVIEW_MAIN_CELL_ID: "sales-main-content-cell",
        DEALVIEW_SIDETABS_CELL_CLASS: "sales-sidetabs-cell",
        DEALVIEW_SIDETABS_DIV_ID: "dvSidetabsDiv",
        DETAIL_SIDETAB_ID: "st:DetailTab",
        DETAIL_SIDETAB_NAME: "DetailTab",
        FEED_SIDETAB_ID: "st:FeedTab",
        FEED_SIDETAB_NAME: "FeedTab",
        GENIUS_SIDETAB_ID: "st:GeniusTab",
        GENIUS_SIDETAB_NAME: "GeniusTab",
        HIDDEN_LIST_ID: "st:HiddenList",
        HIDDEN_LIST_PANEL_DROP_COVER_ID: "st:HiddenListPanelDropCover",
        HIDDEN_LIST_PANEL_ID: "st:HiddenListPanel",
        HIDDEN_LIST_PANE_ID: "st:HiddenListPane",
        HIDDEN_LIST_SHOW_LINK_ID: "st:HiddenListShowLink",
        HIDDEN_LIST_TOGGLE_LINK_ID: "st:HiddenListToggleLink",
        HIDE_BUCKET_ID: "st:HideBucket",
        ITEM_FLYOUT_ID: "RLPanelShadow",
        ITEM_PROXY_ID: "st:ItemProxy",
        SIDETAB_ID_PREFIX: "st:",
        SIDETAB_ITEM_ID_SUFFIX: ":item",
        SIDE_TABS_ID: "st:SideTabs"
    },
    SlaProcessUi = {
        ENTRY_DATE_FIELD_DIV: "edfield",
        EXIT_CRITERIA_DIV: "exitcrt",
        TIMELINE_DIV: "entitlement_timeline"
    },
    SoftphoneConstants = {
        MODULE_CLASS: "softphoneModule",
        OPEN_CTI_MODULE_CLASS: "openCTISoftphoneModule",
        SIDEBAR_SOFTPHONE_WIDTH_STYLE_PX: "220",
        SOFTPHONE_ID: "softphone"
    },
    SoftphoneLayoutEditorConstants = {
        CALL_TYPE_PREFIX: "callType_",
        CALL_TYPE_PREVIEW_PREFIX: "callTypePreview_",
        FIRST_FLIPPY_CSS: "firstFlippy",
        FLIPPY_CONTROL_PREFIX: "control_",
        FLIPPY_PREFIX: "flippy_",
        HIDDEN_IFRAME_ID: "previewIframe",
        LISTING_PREFIX: "listing_",
        RESULT_FIELDS_KEY: "resultFields",
        XSLT_INFO_FIELDS_CSS: "infoFields",
        XSLT_RELATED_OBJS_CSS: "relatedObjects"
    },
    SoftphoneMatchTypeEnum = {
        MULTIPLE_MATCHES: "MultipleMatches",
        NO_MATCH: "NoMatch",
        SINGLE_MATCH: "SingleMatch"
    },
    SoftphoneScreenPopTypeEnum = {
        DO_NOT_POP: "DoNotPop",
        POP_TO_ENTITY: "PopToEntity",
        POP_TO_SEARCH: "PopToSearch",
        POP_TO_VISUALFORCE: "PopToVisualforce"
    },
    StageManager = {
        pWIZARD_RET_URL: "wizardRetUrl"
    },
    SuggestedTimeProvider = {
        TARGET_SUGGESTION_NUMBER: 5
    },
    SummaryFieldConstants = {
        OPERATION_CONTAINER_ID: "operationCtr"
    },
    SummaryLayoutEditor = {
        SUMMARY_LAYOUT_MAX_COL: 4,
        SUMMARY_LAYOUT_MIN_COL: 1
    },
    SynonymConstants = {
        SORT_COLUMN_PARAM_NAME: "sortColumn",
        SORT_DIRECTION_PARAM_NAME: "sortDirection",
        SYNONYM_GROUP_DISPLAY_STRING_PARAM: "synGroupDispStr",
        SYNONYM_NAME_FILTER_PARAM_VALUE: "synonymFilterValue",
        SYNONYM_PAGE_PARAM: "page"
    },
    TabOrganizerConstants = {
        MORE_TABS_LIST_ID: "MoreTabs_List",
        MORE_TABS_TAB_ID: "MoreTabs_Tab",
        TAB_BAR_ID: "tabBar",
        ZEN_TAB_CONTAINER_ID: "tabContainer"
    },
    TabSetPageConstants = {
        LC_WORKSPACE_TABLE_ID: "lcWorkspaceTable",
        ROW_PREFIX: "row",
        WORKSPACE_MAPPING_ROW_CLASS: "workspaceMappingRow",
        WORKSPACE_MAPPING_TABLE_ID: "workspaceMappingTable"
    },
    TagConstants = {
        BROWSER_LIST_ID: "browseTags",
        BROWSER_SEARCH_HEADER_CLASS: "pbTagBrowserSearch",
        BROWSER_TAG_TABLE_ID: "browseTagsTable",
        CHANGE_TAGS_IDS: "changeTagsIds",
        CHANGE_TAGS_NAMES: "changeTagsNames",
        EDIT_AREA_ID: "tag_edit_area",
        EDIT_SECTION_ID: "editSectionId",
        EDIT_TAGS_PAGE: "/ui/tag/TagsEditPage",
        ERROR_DIV_ID: "tagHomeErrorDiv",
        HIDDEN_TAG_ID_LIST: "hidden_tag_id_list",
        HIDDEN_TAG_LIST: "hidden_tag_list",
        HIDING_PUBLIC_SECTION_ID: "layoutPublicEditSection",
        HIDING_SECTION_ID: "layoutEditSection",
        IS_DELETE: "isDelete",
        LOOKUP_TAGS_PAGE: "/ui/tag/LookupTagsPage",
        NOTIFY_MSG_ID: "successNotifyId",
        PUBLIC_TAG_IDS_ELEM: "pTagIds",
        PUBLIC_TAG_NAMES_ELEM: "pTagNames",
        ROLODEX_SEARCH_VALUE: "-10",
        SAVED_TAG_SEARCH: "savedTagSearch",
        SAVE_TAGS_PAGE: "/ui/tag/SaveTagsPage",
        TAG_CANCEL_ID: "tag_cancel",
        TAG_DISPLAY_CONTAINER: "tag_display_container",
        TAG_DISPLAY_LIST: "tag_display_list",
        TAG_DROP_DOWN_CONTENTS_ID: "tag_drop_down_contents",
        TAG_DROP_DOWN_ID: "tag_drop_down",
        TAG_EDIT_ERROR_ID: "tag_edit_error",
        TAG_EDIT_ID: "tag_edit",
        TAG_EDIT_LIST: "tag_edit_list",
        TAG_EDIT_TEXT_ID: "tag_edit_text",
        TAG_HEADER: "tag_header",
        TAG_IDS_ELEM: "tagIds",
        TAG_ID_LIST: "tIdList",
        TAG_MERGE_CHECK: "/ui/tag/TagMergeCheckServlet",
        TAG_NAMES_ELEM: "tagNames",
        TAG_RESULTS_BODY_ID: "tagListBody",
        TAG_RESULTS_ID: "tagResults",
        TAG_ROLODEX_ID: "tagRolodexId",
        TAG_SAVE_ID: "tag_save",
        TAG_SEARCH_FIELD: "tagsSearch",
        TAG_SEARCH_RESULTS_URL: "/search/TagSearchResults",
        TAG_SET_HAS_RECORDS: "tagSetHasRecords",
        TAG_SUMMARY_ID: "tagSummary",
        TAG_UPDATE_STRING: "tagUpdate",
        TAG_VALUE_FOR_UPDATE: "tValForUpdate",
        pTAG_SCOPE_MODE: "scopeMode"
    },
    TagMode = {
        PERSONAL: "personal",
        PUBLIC: "public"
    },
    TaskMassAction = {
        ROW_LIMIT: 200
    },
    TaskOwnerLookup = {
        DONE_BUTTON_ID: "doneButton",
        pLOOKUP_UROG_SUFFIX: "_lkurogid",
        pTABBED_TMU_LOOKUP: "tabbedTmuLookup"
    },
    TaskUi = {
        ASSIGNEE_SEPARATOR: ",",
        MAX_TMU_ASSIGNEES: 100,
        pLOOKUP_BUTTON_MULTI_OWNER_SUFFIX: "m",
        pLOOKUP_DISPLAY_SUFFIX: "_dsp",
        pLOOKUP_SUMMARY_SUFFIX: "_sum",
        pMAX_ASSIGNEE_TEXT_LENGTH: 200,
        pNOTIFY_PREFERENCE_GROUP_ELEMENT: "prefEl",
        pSHOW_PREFERENCE: "show_pref"
    },
    Territory2RuleLookup = {
        ATTR_RULE_DETAILS: "ruleDetails",
        ATTR_RULE_ID: "ruleId",
        ATTR_DETAIL_CALLOUT: "detailCallout",
        calloutPrefix: "ruleDetailCallout_",
        criteriaPrefix: "ruleCriteria_",
        pRULE_ID: "ruleId",
        rulePrefix: "rule_"
    },
    TimePickerInputElementConstants = {
        EMPTY_TIME_STANDIN: "HH:MM"
    },
    Udd = {
        EMPTY_KEY: "000000000000000"
    },
    UiData = {
        pCANCEL_URL: "cancelURL",
        pFAIL_RET_URL: "failRetURL",
        pID: "id",
        pRET_URL: "retURL",
        pSAVE_URL: "saveURL"
    },
    UnifiedSearchComponents = {
        COMPONENT_TRACKING_DRILL_DOWN_SIDETAB: "DrillDownFromSidetab",
        COMPONENT_TRACKING_DRILL_DOWN_SUMMARY: "DrillDownFromSummary",
        COMPONENT_TRACKING_FEEDS_TOGGLE: "FeedsToggle",
        COMPONENT_TRACKING_RECORDS_TOGGLE: "RecordsToggle",
        COMPONENT_TRACKING_SEARCH_ALL: "SearchAll",
        COMPONENT_TRACKING_SECONDARY_SEARCH: "SecondarySearch",
        SUB_COMPONENT_FROM_SIDETABS: "FromSidetabs",
        SUB_COMPONENT_FROM_SUMMARY_VIEW: "FromSummaryView"
    },
    UnifiedSearchUI = {
        CACHE_TIMEOUT_MILLIS: 3E5,
        CSS_CLASS_SUMMARY_VIEW_SHOW_MORE_LINK: "summaryShowMoreLink",
        FIRST_PAGE_QUERY_ID_OVERRIDE: "firstPageQueryIdOverride",
        FOCUSED_ENTITY_PARAM_NAME: "fen",
        GLOBAL_NAV_HEADER_SEARCH_BOX_LENGTH: 100,
        GLOBAL_SEARCH_BUTTON_ID: "phSearchButton",
        GLOBAL_SEARCH_CLEAR_BUTTON_DEFAULT_CLASS: "headerSearchClearButton",
        GLOBAL_SEARCH_CLEAR_BUTTON_ID: "phSearchClearButton",
        GLOBAL_SEARCH_CONTAINER_ID: "phSearchContainer",
        GLOBAL_SEARCH_FORM_ID: "phSearchForm",
        GLOBAL_SEARCH_INPUT_ID: "phSearchInput",
        GLOBAL_SEARCH_P1_ENHANCEMENTS: "globalSearchP1Enhancements",
        GLOBAL_SEARCH_P2_ENHANCEMENTS: "globalSearchP2Enhancements",
        GLOBAL_SEARCH_SUGGESTED_SCOPES: "suggestedScopes",
        GUIDED_TOUR_LINK_ID: "guidedTourLink",
        HEADER_SEARCH_OPTIONS_CONTAINER_ID: "searchOptionsContainer",
        HEADER_SEARCH_SCOPE_INDICATOR_MAX_LENGTH: 38,
        INITIAL_VIEW_MODE: "initialViewMode",
        INITIAL_VIEW_MODE_DETAIL: "detail",
        INITIAL_VIEW_MODE_FEEDS: "feeds",
        INITIAL_VIEW_MODE_SUMMARY: "summary",
        MAX_VALID_MRU_SUGGESTIONS: 10,
        RESERVED_CHAR_REGEX: '[\\(\\)"\\?\\*]',
        SEARCHRESULT_HOLDER_DIV_ID: "searchResultsHolderDiv",
        SEARCH_ALL_ID: "searchAll",
        SEARCH_ALL_SUMMARY_VIEW_ID: "searchAllSummaryView",
        SEARCH_LOGGING_HANDLER: "search",
        SEARCH_MORE_OBJECTS_ID: "searchMoreObjects",
        SEARCH_SCOPE_DIALOG_WIDTH: 655,
        SECOND_SEARCH_BUTTON_ID: "secondSearchButton",
        SECOND_SEARCH_DIV_ID: "secondSearchDiv",
        SECOND_SEARCH_FORM_ID: "secondSearchForm",
        SECOND_SEARCH_INFO_ICON_ID: "secondSearchInfo",
        SECOND_SEARCH_TEXT_ID: "secondSearchText",
        SELECTED_OBJECTS_ID: "selectedObjects",
        SIDETABS_EDIT_ID: "sidetabsSearchOptionsTop",
        SIDETABS_FEED_RESULTS_ID: "feedToggle",
        SIDETABS_ID: "searchSidetabs",
        SIDETABS_LEFT_NAV_WRAPPER_ID: "leftnavwrapper",
        SIDETABS_RECORDS_SLIDE_ID: "records",
        SIDETABS_RECORD_RESULTS_ID: "recordToggle",
        SIDETABS_SELECTED_DRILLDOWN_ID: "selectedDrilldown",
        SIDETABS_SELECTED_SUMMARY_ID: "selectedSummary",
        UNIFIED_SEARCH_AJAX_SERVLET_CSRF_TOKEN: "ajaxServletCSRFToken",
        UNIFIED_SEARCH_PAGE_VERSION: "unifiedSearchPageVersion"
    },
    UserDeactivate = {
        pREMOVE_FROM_ACCOUNT_TEAMS: 1,
        pREMOVE_FROM_ADHOC_CASE_TEAMS: 6,
        pREMOVE_FROM_CLOSED_OPP_TEAMS: 2,
        pREMOVE_FROM_OPEN_OPP_TEAMS: 3,
        pREMOVE_FROM_PREDEFINED_CASE_TEAMS: 5,
        pSPLITS_REMOVAL_NOTE: 4
    },
    UserInterfaceUI = {
        pALOHA_CHATTER_MSG: "alohaChatterMsg",
        pALOHA_SKIN: "alohaSkin",
        pCLICK_AND_CREATE_ON_CALENDAR_NAME: "clickAndCreateOnCalendar",
        pDRAG_AND_DROP_ON_CALENDAR_NAME: "dragAndDropOnCalendar",
        pINLINE_SCHEDULING_NAME: "inlineScheduling",
        pINLINE_SCHEDULING_NAME_MESSAGE: "inlineSchedulingMessage",
        pNEW_LIST_VIEW_NAME: "newListView",
        pS1_DESKTOP_ENABLED_NAME: "s1DesktopEnabled",
        pS1_USE_ALOHA_NAME: "s1UseAloha",
        pUSE_PROFILE_CUSTOM_TABSETS: "useProfileCustomTabsets",
        pUSE_SETUP_SEARCH_NAME: "useSetupSearch",
        pUSE_SETUP_V2_NAME: "useSetupV2",
        AJAX_RELATED_LISTS_NAME: "ajaxRelatedLists",
        XDS_ASYNC_RELATED_LISTS_NAME: "xDSAsyncRelatedLists"
    },
    ViralInviteSignupConstants = {
        DEFAULT_PAGE_BLOCK_STAGE: "DefaultPageBlockStage",
        LOGIN_ID: "p1",
        NEXT_BUTTON_DOM_ID: "goNext",
        ORG_NAME_ID: "org_name",
        PAGE_BLOCK_STAGE: "PageBlockStage",
        PREVIOUS_BUTTON_DOM_ID: "goPrevious",
        READONLY_ORG_NAME_ID: "org_name_readonly",
        SPINNER_IMAGE_ID: "finishSpinnerImgId",
        STAGE_ACCOUNT: "ACCOUNT",
        VIRAL_INVITE_SIGNUP_PAGE_ID: "ViralInviteSignup"
    },
    VisualforceConstants = {
        CHANGED_STYLE_CLASS: "visualforce_changedStyleClass",
        CURRENT_VALUE: "currentValue",
        EDITOR_NAME: "SFDC_INTERNAL_EDITOR",
        ERROR: "visualforce_error",
        HIDE_BUTTONS: "visualforce_hidebuttons",
        IFRAME_SUFFIX: "_frame",
        LABEL: "visualforce_label",
        PICKLIST_INFO: "visualforce_picklist",
        RESET_FUNCTION: "visualforce_resetFunction",
        RTA_LIBRARY: "",
        SHOW_BUTTONS: "visualforce_showbuttons",
        UPDATE_VALUE: "UV"
    },
    WhoWhatQueue = {
        ARROW_IMG: "aqarrow_",
        DONT_ASSIGN_MESSAGE_PREFIX: "da_msg_",
        HIDDEN_WHO_DISAMBIGUATION_SELECTOR_INPUT_NAME: "whoDisambiguationSelectId",
        LEFT_ARROW: "/img/twistyRoundLeft.png",
        NO_DESC_TEXT_ID: "qNoDescTextId",
        RECOMMENDATION_MADE_TRACKER_SUFFIX: "_recommendationMade",
        RECOMMENDATION_PICKED_TRACKER_SUFFIX: "_recommendationPicked",
        RIGHT_ARROW: "/img/twistyRoundRight.jpeg",
        TR_PREFIX: "aqtr_",
        TURN_RECOMMENDER_OFF_LINK_ID: "whatRecommenderOffId",
        TURN_RECOMMENDER_ON_LINK_ID: "whatRecommenderOnId",
        WHAT_LOOKUP_NAME_PREFIX: "qselkupwhat_",
        WHAT_RECOMMENDER_CONTROL_PREFIX: "whatRecommender_",
        WHAT_RECOMMENDER_INPUT_TEXT_SUFFIX: "_input",
        WHO_LOOKUP_NAME_PREFIX: "qselkupwho_"
    },
    findSimilarQueryPage = {
        SEARCH_QUERY_STRING: "srch"
    },
    vaSelectElementConst = {
        DOWN_CLASS: "down",
        UP_CLASS: "up"
    };
(function(a) {
    a.LC || (a.LC = function() {}, a.LC.getLabel = function() {
            return a.LC.getLabelWithArray.apply(a.LC, arguments)
        }, a.LC.getLabelWithArray = function() {
            var c = Array.prototype.slice.call(arguments),
                b = "";
            if (2 > c.length) return b;
            a.LC.labels ? b = a.LC.labels[c[0]][c[1]] : "undefined" != typeof $A && (b = $A.get("$Label." + c[0] + "." + c[1]));
            return a.LC._substituteVariables(b, c.slice(2))
        }, a.LC._substituteVariables = function(a, b) {
            for (var d = 0; d < b.length; d++) a = a.replace(RegExp("\\{" + d + "\\}", "g"), b[d]);
            return a
        }, a.LC.isEnglishLanguage =
        function() {
            return UserContext.initialized && "en_US" == UserContext.language
        }, a.LC.isUSLocale = function() {
            return UserContext.initialized && "en_US" == UserContext.locale
        }, a.LC.isEnglishUS = function() {
            return a.LC.isEnglishLanguage() && a.LC.isUSLocale()
        }, a.LC.isThaiTHLocale = function() {
            return "th_TH" == UserContext.locale
        }, a.LC.isRtlPage = function() {
            return "rtl" == getCurrentStyle(document.body, "direction")
        }, a.LC.BUDDHIST_CAL_OFFSET = 543);
    a.Sfdc && Sfdc.provide && Sfdc.provide("Sfdc.Labels", a.LC)
})(this);
var UserContext = UserContext || {
    initialized: !1,
    locale: "",
    language: "",
    startOfWeek: 0,
    dateFormat: "",
    dateTimeFormat: "",
    timeFormat: "",
    ampm: null,
    today: "",
    isAccessibleMode: !1,
    userPreferences: null,
    orgPreferences: null,
    siteUrlPrefix: "",
    userId: "",
    userName: "",
    uiSkin: "",
    renderMode: "",
    labelLastModified: "",
    networkId: "",
    isDefaultNetwork: !0,
    isCurrentlySysAdminSU: !1,
    cloud: null,
    isS1Desktop: !1,
    salesforceURL: "",
    vfDomainPattern: "",
    auraDomain: "",
    initialize: function(a) {
        a ? UserContext.processValues(a) : UserContext.initializeFromServlet()
    },
    initializeFromServlet: function(a, b) {
        if (a && UserContext.initialized) b && b();
        else {
            var d = UserContext.getUrl("/_ui/system/context/UserContextServlet");
            Sfdc.Ajax.get(d, function(a) {
                a = Sfdc.JSON.parseWithCSRF(a);
                UserContext.processValues(a);
                b && b()
            })
        }
    },
    reloadFromServlet: function(a, b) {
        a = a || function() {};
        Sfdc.Ajax.get("/_ui/system/context/UserContextServlet", function(b) {
            var c;
            try {
                var e = Sfdc.JSON.parseWithCSRF(b);
                UserContext.processValues(e)
            } catch (f) {
                c = f
            }
            a(c)
        }, {
            failure: b
        })
    },
    processValues: function(a) {
        for (var b in a) "undefined" !=
            typeof UserContext[b] && (UserContext[b] = "userPreferences" == b || "orgPreferences" == b ? new PreferenceBits(b, a[b]) : a[b]);
        UserContext.initialized = !0
    },
    getUrl: function(a) {
        return "undefined" == typeof a || ("undefined" == typeof UserContext.siteUrlPrefix || !UserContext.siteUrlPrefix) || 0 !== a.indexOf("/") || 0 === a.indexOf(UserContext.siteUrlPrefix) ? a : UserContext.siteUrlPrefix + a
    }
};
"undefined" != typeof Sfdc && Sfdc.provide && Sfdc.provide("Sfdc.UserContext", UserContext);
Array.isArray || (Array.isArray = function(a) {
    return "[object Array]" === Object.prototype.toString.call(a)
});
Date.now || (Date.now = function() {
    return +new Date
});
Function.prototype.bind || (Function.prototype.bind = function(a) {
    var b = this,
        c = Array.prototype.slice.call(arguments, 1);
    return function() {
        return b.apply(a, c.concat(Array.prototype.slice.call(arguments, 0)))
    }
});
this.Node || (this.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
});
Object.keys || (Object.keys = function() {
    var e = Object.prototype.hasOwnProperty,
        f = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        c = "toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "),
        g = c.length;
    return function(b) {
        if ("object" !== typeof b && "function" !== typeof b || null === b) throw new TypeError("Object.keys called on non-object");
        var d = [],
            a;
        for (a in b) e.call(b, a) && d.push(a);
        if (f)
            for (a = 0; a < g; a++) e.call(b, c[a]) && d.push(c[a]);
        return d
    }
}());
String.prototype.trim || (String.prototype.trim = function(a) {
    return Sfdc.String.trim(this, a)
});
String.prototype.includes || (String.prototype.includes = function(a) {
    return -1 != this.indexOf(a)
});
if ("undefined" === typeof Mustache) var Mustache;
(function(r) {
    "undefined" !== typeof module && module.exports ? module.exports = r : "function" === typeof define ? define(r) : Mustache = r
})(function() {
    function r(a) {
        return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$\x26")
    }

    function t(a) {
        this.tail = this.string = a;
        this.pos = 0
    }

    function n(a, b) {
        this.view = a;
        this.parent = b;
        this.clearCache()
    }

    function h() {
        this.clearCache()
    }

    function y(a) {
        for (var b = a[3], c = b, d;
            (d = a[4]) && d.length;) a = d[d.length - 1], c = a[3];
        return [b, c]
    }

    function u(a) {
        function b(a, b, g) {
            if (!c[a]) {
                var e = u(b);
                c[a] = function(a,
                    b) {
                    return e(a, b, g)
                }
            }
            return c[a]
        }
        var c = {};
        return function(c, f, g) {
            for (var e = "", m, l, k = 0, h = a.length; k < h; ++k) switch (m = a[k], m[0]) {
                case "#":
                    l = g.slice.apply(g, y(m));
                    e += c._section(m[1], f, l, b(k, m[4], g));
                    break;
                case "^":
                    e += c._inverted(m[1], f, b(k, m[4], g));
                    break;
                case "\x3e":
                    e += c._partial(m[1], f);
                    break;
                case "\x26":
                    e += c._name(m[1], f);
                    break;
                case "name":
                    e += c._escaped(m[1], f);
                    break;
                case "text":
                    e += m[1]
            }
            return e
        }
    }

    function v(a) {
        if (2 !== a.length) throw Error("Invalid tags: " + a.join(" "));
        return [RegExp(r(a[0]) + "\\s*"), RegExp("\\s*" +
            r(a[1]))]
    }
    var l = {
        name: "mustache.js",
        version: "0.7.0",
        tags: ["{{", "}}"]
    };
    l.Scanner = t;
    l.Context = n;
    l.Writer = h;
    var z = /\s*/,
        A = /\s+/,
        B = /\S/,
        w = /\s*=/,
        C = /\s*\}/,
        D = /#|\^|\/|>|\{|&|=|!/,
        x = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        },
        E = {
            "\x26": "\x26amp;",
            "\x3c": "\x26lt;",
            "\x3e": "\x26gt;",
            '"': "\x26quot;",
            "'": "\x26#39;",
            "/": "\x26#x2F;"
        };
    l.escape = function(a) {
        return String(a).replace(/[&<>"'\/]/g, function(a) {
            return E[a]
        })
    };
    t.prototype.eos = function() {
        return "" === this.tail
    };
    t.prototype.scan = function(a) {
        return (a = this.tail.match(a)) && 0 === a.index ? (this.tail = this.tail.substring(a[0].length), this.pos += a[0].length, a[0]) : ""
    };
    t.prototype.scanUntil = function(a) {
        var b = this.tail.search(a);
        switch (b) {
            case -1:
                a = this.tail;
                this.pos += this.tail.length;
                this.tail = "";
                break;
            case 0:
                a = "";
                break;
            default:
                a = this.tail.substring(0, b), this.tail = this.tail.substring(b), this.pos += b
        }
        return a
    };
    n.make = function(a) {
        return a instanceof n ? a : new n(a)
    };
    n.prototype.clearCache = function() {
        this._cache = {}
    };
    n.prototype.push =
        function(a) {
            return new n(a, this)
        };
    n.prototype.lookup = function(a) {
        var b = this._cache[a];
        if (!b) {
            if ("." === a) b = this.view;
            else
                for (var c = this; c;) {
                    if (0 < a.indexOf("."))
                        for (var d = a.split("."), f = 0, b = c.view; b && f < d.length;) b = b[d[f++]];
                    else b = c.view[a];
                    if (null != b) break;
                    c = c.parent
                }
            this._cache[a] = b
        }
        "function" === typeof b && (b = b.call(this.view));
        return b
    };
    h.prototype.clearCache = function() {
        this._cache = {};
        this._partialCache = {}
    };
    h.prototype.compile = function(a, b) {
        var c = this._cache[a];
        c || (c = l.parse(a, b), c = this._cache[a] =
            this.compileTokens(c, a));
        return c
    };
    h.prototype.compilePartial = function(a, b, c) {
        b = this.compile(b, c);
        return this._partialCache[a] = b
    };
    h.prototype.compileTokens = function(a, b) {
        var c = u(a),
            d = this;
        return function(a, g) {
            if (g)
                if ("function" === typeof g) d._loadPartial = g;
                else
                    for (var e in g) d.compilePartial(e, g[e]);
            return c(d, n.make(a), b)
        }
    };
    h.prototype.render = function(a, b, c) {
        return this.compile(a)(b, c)
    };
    h.prototype._section = function(a, b, c, d) {
        a = b.lookup(a);
        switch (typeof a) {
            case "object":
                if (x(a)) {
                    c = "";
                    for (var f = 0,
                            g = a.length; f < g; ++f) c += d(this, b.push(a[f]));
                    return c
                }
                return a ? d(this, b.push(a)) : "";
            case "function":
                var e = this;
                d = a.call(b.view, c, function(a) {
                    return e.render(a, b)
                });
                return null != d ? d : "";
            default:
                if (a) return d(this, b)
        }
        return ""
    };
    h.prototype._inverted = function(a, b, c) {
        a = b.lookup(a);
        return !a || x(a) && 0 === a.length ? c(this, b) : ""
    };
    h.prototype._partial = function(a, b) {
        !(a in this._partialCache) && this._loadPartial && this.compilePartial(a, this._loadPartial(a));
        var c = this._partialCache[a];
        return c ? c(b) : ""
    };
    h.prototype._name =
        function(a, b) {
            var c = b.lookup(a);
            "function" === typeof c && (c = c.call(b.view));
            return null == c ? "" : String(c)
        };
    h.prototype._escaped = function(a, b) {
        return l.escape(this._name(a, b))
    };
    l.parse = function(a, b) {
        b = b || l.tags;
        for (var c = v(b), d = new t(a), f = [], g = [], e = !1, m = !1, h, k, p; !d.eos();) {
            h = d.pos;
            if (p = d.scanUntil(c[0]))
                for (var n = 0, s = p.length; n < s; ++n)
                    if (k = p.charAt(n), RegExp.prototype.test.call(B, k) ? m = !0 : g.push(f.length), f.push(["text", k, h, h + 1]), h += 1, "\n" === k) {
                        if (e && !m)
                            for (; g.length;) f.splice(g.pop(), 1);
                        else g = [];
                        m = e = !1
                    }
            h =
                d.pos;
            if (!d.scan(c[0])) break;
            e = !0;
            k = d.scan(D) || "name";
            d.scan(z);
            "\x3d" === k ? (p = d.scanUntil(w), d.scan(w), d.scanUntil(c[1])) : "{" === k ? (p = RegExp("\\s*" + r("}" + b[1])), p = d.scanUntil(p), d.scan(C), d.scanUntil(c[1]), k = "\x26") : p = d.scanUntil(c[1]);
            if (!d.scan(c[1])) throw Error("Unclosed tag at " + d.pos);
            f.push([k, p, h, d.pos]);
            if ("name" === k || "{" === k || "\x26" === k) m = !0;
            "\x3d" === k && (b = p.split(A), c = v(b))
        }
        for (var c = f, q, f = [], g = 0; g < c.length; ++g) d = c[g], q && "text" === q[0] && "text" === d[0] ? (q[1] += d[1], q[3] = d[3]) : (q = d, f.push(d));
        q = f;
        e = c = [];
        d = [];
        for (g = 0; g < q.length; ++g) switch (f = q[g], f[0]) {
            case "#":
            case "^":
                f[4] = [];
                d.push(f);
                e.push(f);
                e = f[4];
                break;
            case "/":
                if (0 === d.length) throw Error("Unopened section: " + f[1]);
                e = d.pop();
                if (e[1] !== f[1]) throw Error("Unclosed section: " + e[1]);
                e = 0 < d.length ? d[d.length - 1][4] : c;
                break;
            default:
                e.push(f)
        }
        if (e = d.pop()) throw Error("Unclosed section: " + e[1]);
        return c
    };
    var s = new h;
    l.clearCache = function() {
        return s.clearCache()
    };
    l.compile = function(a, b) {
        return s.compile(a, b)
    };
    l.compilePartial = function(a, b, c) {
        return s.compilePartial(a,
            b, c)
    };
    l.compileTokens = function(a, b) {
        return s.compileTokens(a, b)
    };
    l.render = function(a, b, c) {
        return s.render(a, b, c)
    };
    l.to_html = function(a, b, c, d) {
        a = l.render(a, b, c);
        if ("function" === typeof d) d(a);
        else return a
    };
    return l
}());
(function(G) {
    function r(a, b, c, d) {
        var e, f, g, s, k, w = b && b.ownerDocument,
            u = b ? b.nodeType : 9;
        c = c || [];
        if ("string" !== typeof a || !a || 1 !== u && 9 !== u && 11 !== u) return c;
        if (!d && ((b ? b.ownerDocument || b : x) !== h && H(b), b = b || h, B)) {
            if (11 !== u && (s = va.exec(a)))
                if (e = s[1])
                    if (9 === u)
                        if (f = b.getElementById(e)) {
                            if (f.id === e) return c.push(f), c
                        } else return c;
            else {
                if (w && (f = w.getElementById(e)) && Q(b, f) && f.id === e) return c.push(f), c
            } else {
                if (s[2]) return I.apply(c, b.getElementsByTagName(a)), c;
                if ((e = s[3]) && p.getElementsByClassName && b.getElementsByClassName) return I.apply(c,
                    b.getElementsByClassName(e)), c
            }
            if (p.qsa && !T[a + " "] && (!v || !v.test(a))) {
                if (1 !== u) w = b, k = a;
                else if ("object" !== b.nodeName.toLowerCase()) {
                    (g = b.getAttribute("id")) ? g = g.replace(ka, la): b.setAttribute("id", g = n);
                    f = R(a);
                    for (e = f.length; e--;) f[e] = "#" + g + " " + U(f[e]);
                    k = f.join(",");
                    w = ba.test(a) && ca(b.parentNode) || b
                }
                if (k) try {
                    return I.apply(c, w.querySelectorAll(k)), c
                } catch (q) {} finally {
                    g === n && b.removeAttribute("id")
                }
            }
        }
        return ma(a.replace(V, "$1"), b, c, d)
    }

    function da() {
        function a(c, d) {
            b.push(c + " ") > l.cacheLength && delete a[b.shift()];
            return a[c + " "] = d
        }
        var b = [];
        return a
    }

    function A(a) {
        a[n] = !0;
        return a
    }

    function C(a) {
        var b = h.createElement("fieldset");
        try {
            return !!a(b)
        } catch (c) {
            return !1
        } finally {
            b.parentNode && b.parentNode.removeChild(b)
        }
    }

    function ea(a, b) {
        for (var c = a.split("|"), d = c.length; d--;) l.attrHandle[c[d]] = b
    }

    function na(a, b) {
        var c = b && a,
            d = c && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
        if (d) return d;
        if (c)
            for (; c = c.nextSibling;)
                if (c === b) return -1;
        return a ? 1 : -1
    }

    function wa(a) {
        return function(b) {
            return "input" === b.nodeName.toLowerCase() &&
                b.type === a
        }
    }

    function xa(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return ("input" === c || "button" === c) && b.type === a
        }
    }

    function oa(a) {
        return function(b) {
            return "label" in b && b.disabled === a || "form" in b && b.disabled === a || "form" in b && !1 === b.disabled && (b.isDisabled === a || b.isDisabled !== !a && ("label" in b || !ya(b)) !== a)
        }
    }

    function K(a) {
        return A(function(b) {
            b = +b;
            return A(function(c, d) {
                for (var e, f = a([], c.length, b), g = f.length; g--;)
                    if (c[e = f[g]]) c[e] = !(d[e] = c[e])
            })
        })
    }

    function ca(a) {
        return a && "undefined" !== typeof a.getElementsByTagName &&
            a
    }

    function pa() {}

    function U(a) {
        for (var b = 0, c = a.length, d = ""; b < c; b++) d += a[b].value;
        return d
    }

    function W(a, b, c) {
        var d = b.dir,
            e = b.next,
            f = e || d,
            g = c && "parentNode" === f,
            s = za++;
        return b.first ? function(c, b, e) {
            for (; c = c[d];)
                if (1 === c.nodeType || g) return a(c, b, e)
        } : function(c, b, u) {
            var q, y, m = [D, s];
            if (u)
                for (; c = c[d];) {
                    if ((1 === c.nodeType || g) && a(c, b, u)) return !0
                } else
                    for (; c = c[d];)
                        if (1 === c.nodeType || g)
                            if (y = c[n] || (c[n] = {}), y = y[c.uniqueID] || (y[c.uniqueID] = {}), e && e === c.nodeName.toLowerCase()) c = c[d] || c;
                            else {
                                if ((q = y[f]) && q[0] ===
                                    D && q[1] === s) return m[2] = q[2];
                                y[f] = m;
                                if (m[2] = a(c, b, u)) return !0
                            }
        }
    }

    function fa(a) {
        return 1 < a.length ? function(b, c, d) {
            for (var e = a.length; e--;)
                if (!a[e](b, c, d)) return !1;
            return !0
        } : a[0]
    }

    function X(a, b, c, d, e) {
        for (var f, g = [], s = 0, k = a.length, w = null != b; s < k; s++)
            if (f = a[s])
                if (!c || c(f, d, e)) g.push(f), w && b.push(s);
        return g
    }

    function ga(a, b, c, d, e, f) {
        d && !d[n] && (d = ga(d));
        e && !e[n] && (e = ga(e, f));
        return A(function(f, s, k, w) {
            var u, q, y = [],
                m = [],
                l = s.length,
                h;
            if (!(h = f)) {
                h = b || "*";
                for (var t = k.nodeType ? [k] : k, p = [], n = 0, v = t.length; n < v; n++) r(h,
                    t[n], p);
                h = p
            }
            h = a && (f || !b) ? X(h, y, a, k, w) : h;
            t = c ? e || (f ? a : l || d) ? [] : s : h;
            c && c(h, t, k, w);
            if (d) {
                u = X(t, m);
                d(u, [], k, w);
                for (k = u.length; k--;)
                    if (q = u[k]) t[m[k]] = !(h[m[k]] = q)
            }
            if (f) {
                if (e || a) {
                    if (e) {
                        u = [];
                        for (k = t.length; k--;)
                            if (q = t[k]) u.push(h[k] = q);
                        e(null, t = [], u, w)
                    }
                    for (k = t.length; k--;)
                        if ((q = t[k]) && -1 < (u = e ? L(f, q) : y[k])) f[u] = !(s[u] = q)
                }
            } else t = X(t === s ? t.splice(l, t.length) : t), e ? e(null, s, t, w) : I.apply(s, t)
        })
    }

    function ha(a) {
        var b, c, d, e = a.length,
            f = l.relative[a[0].type];
        c = f || l.relative[" "];
        for (var g = f ? 1 : 0, s = W(function(a) {
                return a ===
                    b
            }, c, !0), k = W(function(a) {
                return -1 < L(b, a)
            }, c, !0), h = [function(a, c, d) {
                a = !f && (d || c !== Y) || ((b = c).nodeType ? s(a, c, d) : k(a, c, d));
                b = null;
                return a
            }]; g < e; g++)
            if (c = l.relative[a[g].type]) h = [W(fa(h), c)];
            else {
                c = l.filter[a[g].type].apply(null, a[g].matches);
                if (c[n]) {
                    for (d = ++g; d < e && !l.relative[a[d].type]; d++);
                    return ga(1 < g && fa(h), 1 < g && U(a.slice(0, g - 1).concat({
                        value: " " === a[g - 2].type ? "*" : ""
                    })).replace(V, "$1"), c, g < d && ha(a.slice(g, d)), d < e && ha(a = a.slice(d)), d < e && U(a))
                }
                h.push(c)
            }
        return fa(h)
    }

    function Aa(a, b) {
        var c = 0 < b.length,
            d = 0 < a.length,
            e = function(e, g, s, k, w) {
                var u, q, y, m = 0,
                    n = "0",
                    p = e && [],
                    t = [],
                    v = Y,
                    x = e || d && l.find.TAG("*", w),
                    z = D += null == v ? 1 : Math.random() || 0.1,
                    A = x.length;
                for (w && (Y = g === h || g || w); n !== A && null != (u = x[n]); n++) {
                    if (d && u) {
                        q = 0;
                        !g && u.ownerDocument !== h && (H(u), s = !B);
                        for (; y = a[q++];)
                            if (y(u, g || h, s)) {
                                k.push(u);
                                break
                            }
                        w && (D = z)
                    }
                    c && ((u = !y && u) && m--, e && p.push(u))
                }
                m += n;
                if (c && n !== m) {
                    for (q = 0; y = b[q++];) y(p, t, g, s);
                    if (e) {
                        if (0 < m)
                            for (; n--;) !p[n] && !t[n] && (t[n] = Ba.call(k));
                        t = X(t)
                    }
                    I.apply(k, t);
                    w && (!e && 0 < t.length && 1 < m + b.length) && r.uniqueSort(k)
                }
                w &&
                    (D = z, Y = v);
                return p
            };
        return c ? A(e) : e
    }
    var O, p, l, Z, qa, R, ia, ma, Y, J, P, H, h, z, B, v, M, $, Q, n = "sizzle" + 1 * new Date,
        x = G.document,
        D = 0,
        za = 0,
        ra = da(),
        sa = da(),
        T = da(),
        ja = function(a, b) {
            a === b && (P = !0);
            return 0
        },
        Ca = {}.hasOwnProperty,
        N = [],
        Ba = N.pop,
        Da = N.push,
        I = N.push,
        ta = N.slice,
        L = function(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] === b) return c;
            return -1
        },
        Ea = /[\x20\t\r\n\f]+/g,
        V = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
        Fa = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
        Ga = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,
        Ha = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
        Ia = RegExp(":((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)"),
        Ja = /^(?:\\.|[\w-]|[^\x00-\xa0])+$/,
        aa = {
            ID: /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
            CLASS: /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
            TAG: /^((?:\\.|[\w-]|[^\x00-\xa0])+|[*])/,
            ATTR: RegExp("^\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\]"),
            PSEUDO: RegExp("^:((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)"),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
            bool: RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
            needsContext: RegExp("^[\\x20\\t\\r\\n\\f]*[\x3e+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?\x3d[^-]|$)",
                "i")
        },
        Ka = /^(?:input|select|textarea|button)$/i,
        La = /^h\d$/i,
        S = /^[^{]+\{\s*\[native \w/,
        va = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        ba = /[+~]/,
        E = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/ig,
        F = function(a, b, c) {
            a = "0x" + b - 65536;
            return a !== a || c ? b : 0 > a ? String.fromCharCode(a + 65536) : String.fromCharCode(a >> 10 | 55296, a & 1023 | 56320)
        },
        ka = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
        la = function(a, b) {
            return b ? "\x00" === a ? "\ufffd" : a.slice(0, -1) + "\\" + a.charCodeAt(a.length - 1).toString(16) + " " : "\\" + a
        },
        ua = function() {
            H()
        },
        ya = W(function(a) {
            return !0 === a.disabled
        }, {
            dir: "parentNode",
            next: "legend"
        });
    try {
        I.apply(N = ta.call(x.childNodes), x.childNodes), N[x.childNodes.length].nodeType
    } catch (Na) {
        I = {
            apply: N.length ? function(a, b) {
                Da.apply(a, ta.call(b))
            } : function(a, b) {
                for (var c = a.length, d = 0; a[c++] = b[d++];);
                a.length = c - 1
            }
        }
    }
    p = r.support = {};
    qa = r.isXML = function(a) {
        return (a = a && (a.ownerDocument || a).documentElement) ? "HTML" !== a.nodeName : !1
    };
    H = r.setDocument = function(a) {
        var b;
        a = a ? a.ownerDocument || a : x;
        if (a === h || 9 !== a.nodeType || !a.documentElement) return h;
        h = a;
        z = h.documentElement;
        B = !qa(h);
        if (x !== h && (b = h.defaultView) && b.top !== b) b.addEventListener ? b.addEventListener("unload", ua, !1) : b.attachEvent && b.attachEvent("onunload", ua);
        p.attributes = C(function(a) {
            a.className = "i";
            return !a.getAttribute("className")
        });
        p.getElementsByTagName = C(function(a) {
            a.appendChild(h.createComment(""));
            return !a.getElementsByTagName("*").length
        });
        p.getElementsByClassName = S.test(h.getElementsByClassName);
        p.getById = C(function(a) {
            z.appendChild(a).id = n;
            return !h.getElementsByName || !h.getElementsByName(n).length
        });
        p.getById ? (l.find.ID = function(a, b) {
            if ("undefined" !== typeof b.getElementById && B) {
                var e = b.getElementById(a);
                return e ? [e] : []
            }
        }, l.filter.ID = function(a) {
            var b = a.replace(E, F);
            return function(a) {
                return a.getAttribute("id") === b
            }
        }) : (delete l.find.ID, l.filter.ID = function(a) {
            var b = a.replace(E, F);
            return function(a) {
                return (a = "undefined" !== typeof a.getAttributeNode && a.getAttributeNode("id")) && a.value === b
            }
        });
        l.find.TAG = p.getElementsByTagName ? function(a, b) {
            if ("undefined" !== typeof b.getElementsByTagName) return b.getElementsByTagName(a);
            if (p.qsa) return b.querySelectorAll(a)
        } : function(a, b) {
            var e, f = [],
                g = 0,
                s = b.getElementsByTagName(a);
            if ("*" === a) {
                for (; e = s[g++];) 1 === e.nodeType && f.push(e);
                return f
            }
            return s
        };
        l.find.CLASS = p.getElementsByClassName && function(a, b) {
            if ("undefined" !== typeof b.getElementsByClassName && B) return b.getElementsByClassName(a)
        };
        M = [];
        v = [];
        if (p.qsa = S.test(h.querySelectorAll)) C(function(a) {
            z.appendChild(a).innerHTML = "\x3ca id\x3d'" + n + "'\x3e\x3c/a\x3e\x3cselect id\x3d'" + n + "-\r\\' msallowcapture\x3d''\x3e\x3coption selected\x3d''\x3e\x3c/option\x3e\x3c/select\x3e";
            a.querySelectorAll("[msallowcapture^\x3d'']").length && v.push("[*^$]\x3d[\\x20\\t\\r\\n\\f]*(?:''|\"\")");
            a.querySelectorAll("[selected]").length || v.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
            a.querySelectorAll("[id~\x3d" + n + "-]").length || v.push("~\x3d");
            a.querySelectorAll(":checked").length || v.push(":checked");
            a.querySelectorAll("a#" + n + "+*").length || v.push(".#.+[+~]")
        }), C(function(a) {
            a.innerHTML =
                "\x3ca href\x3d'' disabled\x3d'disabled'\x3e\x3c/a\x3e\x3cselect disabled\x3d'disabled'\x3e\x3coption/\x3e\x3c/select\x3e";
            var b = h.createElement("input");
            b.setAttribute("type", "hidden");
            a.appendChild(b).setAttribute("name", "D");
            a.querySelectorAll("[name\x3dd]").length && v.push("name[\\x20\\t\\r\\n\\f]*[*^$|!~]?\x3d");
            2 !== a.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled");
            z.appendChild(a).disabled = !0;
            2 !== a.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled");
            a.querySelectorAll("*,:x");
            v.push(",.*:")
        });
        (p.matchesSelector = S.test($ = z.matches || z.webkitMatchesSelector || z.mozMatchesSelector || z.oMatchesSelector || z.msMatchesSelector)) && C(function(a) {
            p.disconnectedMatch = $.call(a, "*");
            $.call(a, "[s!\x3d'']:x");
            M.push("!\x3d", ":((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\x00-\\xa0])+)(?:[\\x20\\t\\r\\n\\f]*([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|((?:\\\\.|[\\w-]|[^\x00-\\xa0])+))|)[\\x20\\t\\r\\n\\f]*\\])*)|.*)\\)|)")
        });
        v = v.length && RegExp(v.join("|"));
        M = M.length && RegExp(M.join("|"));
        Q = (b = S.test(z.compareDocumentPosition)) || S.test(z.contains) ? function(a, b) {
            var e = 9 === a.nodeType ? a.documentElement : a,
                f = b && b.parentNode;
            return a === f || !(!f || !(1 === f.nodeType && (e.contains ? e.contains(f) : a.compareDocumentPosition && a.compareDocumentPosition(f) & 16)))
        } : function(a, b) {
            if (b)
                for (; b = b.parentNode;)
                    if (b === a) return !0;
            return !1
        };
        ja = b ? function(a, b) {
            if (a === b) return P = !0, 0;
            var e = !a.compareDocumentPosition - !b.compareDocumentPosition;
            if (e) return e;
            e = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
            return e & 1 || !p.sortDetached && b.compareDocumentPosition(a) === e ? a === h || a.ownerDocument === x && Q(x, a) ? -1 : b === h || b.ownerDocument === x && Q(x, b) ? 1 : J ? L(J, a) - L(J, b) : 0 : e & 4 ? -1 : 1
        } : function(a, b) {
            if (a === b) return P = !0, 0;
            var e, f = 0;
            e = a.parentNode;
            var g = b.parentNode,
                s = [a],
                k = [b];
            if (!e || !g) return a === h ? -1 : b === h ? 1 : e ? -1 : g ? 1 : J ? L(J, a) - L(J, b) : 0;
            if (e === g) return na(a, b);
            for (e = a; e = e.parentNode;) s.unshift(e);
            for (e = b; e = e.parentNode;) k.unshift(e);
            for (; s[f] ===
                k[f];) f++;
            return f ? na(s[f], k[f]) : s[f] === x ? -1 : k[f] === x ? 1 : 0
        };
        return h
    };
    r.matches = function(a, b) {
        return r(a, null, null, b)
    };
    r.matchesSelector = function(a, b) {
        (a.ownerDocument || a) !== h && H(a);
        b = b.replace(Ha, "\x3d'$1']");
        if (p.matchesSelector && B && !T[b + " "] && (!M || !M.test(b)) && (!v || !v.test(b))) try {
            var c = $.call(a, b);
            if (c || p.disconnectedMatch || a.document && 11 !== a.document.nodeType) return c
        } catch (d) {}
        return 0 < r(b, h, null, [a]).length
    };
    r.contains = function(a, b) {
        (a.ownerDocument || a) !== h && H(a);
        return Q(a, b)
    };
    r.attr = function(a,
        b) {
        (a.ownerDocument || a) !== h && H(a);
        var c = l.attrHandle[b.toLowerCase()],
            c = c && Ca.call(l.attrHandle, b.toLowerCase()) ? c(a, b, !B) : void 0;
        return void 0 !== c ? c : p.attributes || !B ? a.getAttribute(b) : (c = a.getAttributeNode(b)) && c.specified ? c.value : null
    };
    r.escape = function(a) {
        return (a + "").replace(ka, la)
    };
    r.error = function(a) {
        throw Error("Syntax error, unrecognized expression: " + a);
    };
    r.uniqueSort = function(a) {
        var b, c = [],
            d = 0,
            e = 0;
        P = !p.detectDuplicates;
        J = !p.sortStable && a.slice(0);
        a.sort(ja);
        if (P) {
            for (; b = a[e++];) b === a[e] &&
                (d = c.push(e));
            for (; d--;) a.splice(c[d], 1)
        }
        J = null;
        return a
    };
    Z = r.getText = function(a) {
        var b, c = "",
            d = 0;
        if (b = a.nodeType)
            if (1 === b || 9 === b || 11 === b) {
                if ("string" === typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += Z(a)
            } else {
                if (3 === b || 4 === b) return a.nodeValue
            }
        else
            for (; b = a[d++];) c += Z(b);
        return c
    };
    l = r.selectors = {
        cacheLength: 50,
        createPseudo: A,
        match: aa,
        attrHandle: {},
        find: {},
        relative: {
            "\x3e": {
                dir: "parentNode",
                first: !0
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: !0
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            ATTR: function(a) {
                a[1] = a[1].replace(E, F);
                a[3] = (a[3] || a[4] || a[5] || "").replace(E, F);
                "~\x3d" === a[2] && (a[3] = " " + a[3] + " ");
                return a.slice(0, 4)
            },
            CHILD: function(a) {
                a[1] = a[1].toLowerCase();
                "nth" === a[1].slice(0, 3) ? (a[3] || r.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && r.error(a[0]);
                return a
            },
            PSEUDO: function(a) {
                var b, c = !a[6] && a[2];
                if (aa.CHILD.test(a[0])) return null;
                if (a[3]) a[2] = a[4] || a[5] || "";
                else if (c && Ia.test(c) && (b = R(c, !0)) && (b = c.indexOf(")",
                        c.length - b) - c.length)) a[0] = a[0].slice(0, b), a[2] = c.slice(0, b);
                return a.slice(0, 3)
            }
        },
        filter: {
            TAG: function(a) {
                var b = a.replace(E, F).toLowerCase();
                return "*" === a ? function() {
                    return !0
                } : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                }
            },
            CLASS: function(a) {
                var b = ra[a + " "];
                return b || (b = RegExp("(^|[\\x20\\t\\r\\n\\f])" + a + "([\\x20\\t\\r\\n\\f]|$)")) && ra(a, function(a) {
                    return b.test("string" === typeof a.className && a.className || "undefined" !== typeof a.getAttribute && a.getAttribute("class") || "")
                })
            },
            ATTR: function(a,
                b, c) {
                return function(d) {
                    d = r.attr(d, a);
                    if (null == d) return "!\x3d" === b;
                    if (!b) return !0;
                    d += "";
                    return "\x3d" === b ? d === c : "!\x3d" === b ? d !== c : "^\x3d" === b ? c && 0 === d.indexOf(c) : "*\x3d" === b ? c && -1 < d.indexOf(c) : "$\x3d" === b ? c && d.slice(-c.length) === c : "~\x3d" === b ? -1 < (" " + d.replace(Ea, " ") + " ").indexOf(c) : "|\x3d" === b ? d === c || d.slice(0, c.length + 1) === c + "-" : !1
                }
            },
            CHILD: function(a, b, c, d, e) {
                var f = "nth" !== a.slice(0, 3),
                    g = "last" !== a.slice(-4),
                    s = "of-type" === b;
                return 1 === d && 0 === e ? function(a) {
                    return !!a.parentNode
                } : function(b, c, h) {
                    var q,
                        l, m, p, r;
                    c = f !== g ? "nextSibling" : "previousSibling";
                    var t = b.parentNode,
                        v = s && b.nodeName.toLowerCase();
                    h = !h && !s;
                    q = !1;
                    if (t) {
                        if (f) {
                            for (; c;) {
                                for (m = b; m = m[c];)
                                    if (s ? m.nodeName.toLowerCase() === v : 1 === m.nodeType) return !1;
                                r = c = "only" === a && !r && "nextSibling"
                            }
                            return !0
                        }
                        r = [g ? t.firstChild : t.lastChild];
                        if (g && h) {
                            m = t;
                            l = m[n] || (m[n] = {});
                            l = l[m.uniqueID] || (l[m.uniqueID] = {});
                            q = l[a] || [];
                            q = (p = q[0] === D && q[1]) && q[2];
                            for (m = p && t.childNodes[p]; m = ++p && m && m[c] || (q = p = 0) || r.pop();)
                                if (1 === m.nodeType && ++q && m === b) {
                                    l[a] = [D, p, q];
                                    break
                                }
                        } else if (h &&
                            (m = b, l = m[n] || (m[n] = {}), l = l[m.uniqueID] || (l[m.uniqueID] = {}), q = l[a] || [], q = p = q[0] === D && q[1]), !1 === q)
                            for (; m = ++p && m && m[c] || (q = p = 0) || r.pop();)
                                if ((s ? m.nodeName.toLowerCase() === v : 1 === m.nodeType) && ++q)
                                    if (h && (l = m[n] || (m[n] = {}), l = l[m.uniqueID] || (l[m.uniqueID] = {}), l[a] = [D, q]), m === b) break;
                        q -= e;
                        return q === d || 0 === q % d && 0 <= q / d
                    }
                }
            },
            PSEUDO: function(a, b) {
                var c, d = l.pseudos[a] || l.setFilters[a.toLowerCase()] || r.error("unsupported pseudo: " + a);
                return d[n] ? d(b) : 1 < d.length ? (c = [a, a, "", b], l.setFilters.hasOwnProperty(a.toLowerCase()) ?
                    A(function(a, c) {
                        for (var g, h = d(a, b), k = h.length; k--;) g = L(a, h[k]), a[g] = !(c[g] = h[k])
                    }) : function(a) {
                        return d(a, 0, c)
                    }) : d
            }
        },
        pseudos: {
            not: A(function(a) {
                var b = [],
                    c = [],
                    d = ia(a.replace(V, "$1"));
                return d[n] ? A(function(a, b, c, h) {
                    h = d(a, null, h, []);
                    for (var k = a.length; k--;)
                        if (c = h[k]) a[k] = !(b[k] = c)
                }) : function(a, f, g) {
                    b[0] = a;
                    d(b, null, g, c);
                    b[0] = null;
                    return !c.pop()
                }
            }),
            has: A(function(a) {
                return function(b) {
                    return 0 < r(a, b).length
                }
            }),
            contains: A(function(a) {
                a = a.replace(E, F);
                return function(b) {
                    return -1 < (b.textContent || b.innerText ||
                        Z(b)).indexOf(a)
                }
            }),
            lang: A(function(a) {
                Ja.test(a || "") || r.error("unsupported lang: " + a);
                a = a.replace(E, F).toLowerCase();
                return function(b) {
                    var c;
                    do
                        if (c = B ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                    while ((b = b.parentNode) && 1 === b.nodeType);
                    return !1
                }
            }),
            target: function(a) {
                var b = G.location && G.location.hash;
                return b && b.slice(1) === a.id
            },
            root: function(a) {
                return a === z
            },
            focus: function(a) {
                return a === h.activeElement && (!h.hasFocus || h.hasFocus()) &&
                    !(!a.type && !a.href && !~a.tabIndex)
            },
            enabled: oa(!1),
            disabled: oa(!0),
            checked: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && !!a.checked || "option" === b && !!a.selected
            },
            selected: function(a) {
                a.parentNode && a.parentNode.selectedIndex;
                return !0 === a.selected
            },
            empty: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling)
                    if (6 > a.nodeType) return !1;
                return !0
            },
            parent: function(a) {
                return !l.pseudos.empty(a)
            },
            header: function(a) {
                return La.test(a.nodeName)
            },
            input: function(a) {
                return Ka.test(a.nodeName)
            },
            button: function(a) {
                var b =
                    a.nodeName.toLowerCase();
                return "input" === b && "button" === a.type || "button" === b
            },
            text: function(a) {
                var b;
                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
            },
            first: K(function() {
                return [0]
            }),
            last: K(function(a, b) {
                return [b - 1]
            }),
            eq: K(function(a, b, c) {
                return [0 > c ? c + b : c]
            }),
            even: K(function(a, b) {
                for (var c = 0; c < b; c += 2) a.push(c);
                return a
            }),
            odd: K(function(a, b) {
                for (var c = 1; c < b; c += 2) a.push(c);
                return a
            }),
            lt: K(function(a, b, c) {
                for (b = 0 > c ? c + b : c; 0 <= --b;) a.push(b);
                return a
            }),
            gt: K(function(a, b, c) {
                for (c = 0 > c ? c + b : c; ++c < b;) a.push(c);
                return a
            })
        }
    };
    l.pseudos.nth = l.pseudos.eq;
    for (O in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) l.pseudos[O] = wa(O);
    for (O in {
            submit: !0,
            reset: !0
        }) l.pseudos[O] = xa(O);
    pa.prototype = l.filters = l.pseudos;
    l.setFilters = new pa;
    R = r.tokenize = function(a, b) {
        var c, d, e, f, g, h, k;
        if (g = sa[a + " "]) return b ? 0 : g.slice(0);
        g = a;
        h = [];
        for (k = l.preFilter; g;) {
            if (!c || (d = Fa.exec(g))) d && (g = g.slice(d[0].length) || g), h.push(e = []);
            c = !1;
            if (d = Ga.exec(g)) c = d.shift(), e.push({
                value: c,
                type: d[0].replace(V, " ")
            }), g = g.slice(c.length);
            for (f in l.filter)
                if ((d = aa[f].exec(g)) && (!k[f] || (d = k[f](d)))) c = d.shift(), e.push({
                    value: c,
                    type: f,
                    matches: d
                }), g = g.slice(c.length);
            if (!c) break
        }
        return b ? g.length : g ? r.error(a) : sa(a, h).slice(0)
    };
    ia = r.compile = function(a, b) {
        var c, d = [],
            e = [],
            f = T[a + " "];
        if (!f) {
            b || (b = R(a));
            for (c = b.length; c--;) f = ha(b[c]), f[n] ? d.push(f) : e.push(f);
            f = T(a, Aa(e, d));
            f.selector = a
        }
        return f
    };
    ma = r.select = function(a, b, c, d) {
        var e, f, g, h, k = "function" === typeof a && a,
            n = !d && R(a = k.selector || a);
        c = c || [];
        if (1 === n.length) {
            f = n[0] = n[0].slice(0);
            if (2 < f.length && "ID" === (g = f[0]).type && p.getById && 9 === b.nodeType && B && l.relative[f[1].type]) {
                if (b = (l.find.ID(g.matches[0].replace(E, F), b) || [])[0]) k && (b = b.parentNode);
                else return c;
                a = a.slice(f.shift().value.length)
            }
            for (e = aa.needsContext.test(a) ? 0 : f.length; e--;) {
                g = f[e];
                if (l.relative[h = g.type]) break;
                if (h = l.find[h])
                    if (d = h(g.matches[0].replace(E, F), ba.test(f[0].type) && ca(b.parentNode) || b)) {
                        f.splice(e, 1);
                        a = d.length && U(f);
                        if (!a) return I.apply(c, d), c;
                        break
                    }
            }
        }(k || ia(a,
            n))(d, b, !B, c, !b || ba.test(a) && ca(b.parentNode) || b);
        return c
    };
    p.sortStable = n.split("").sort(ja).join("") === n;
    p.detectDuplicates = !!P;
    H();
    p.sortDetached = C(function(a) {
        return a.compareDocumentPosition(h.createElement("fieldset")) & 1
    });
    C(function(a) {
        a.innerHTML = "\x3ca href\x3d'#'\x3e\x3c/a\x3e";
        return "#" === a.firstChild.getAttribute("href")
    }) || ea("type|href|height|width", function(a, b, c) {
        if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
    });
    (!p.attributes || !C(function(a) {
        a.innerHTML = "\x3cinput/\x3e";
        a.firstChild.setAttribute("value", "");
        return "" === a.firstChild.getAttribute("value")
    })) && ea("value", function(a, b, c) {
        if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue
    });
    C(function(a) {
        return null == a.getAttribute("disabled")
    }) || ea("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", function(a, b, c) {
        var d;
        if (!c) return !0 === a[b] ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
    });
    var Ma = G.Sizzle;
    r.noConflict =
        function() {
            G.Sizzle === r && (G.Sizzle = Ma);
            return r
        };
    "function" === typeof define && define.amd ? define(function() {
        return r
    }) : "undefined" !== typeof module && module.exports ? module.exports = r : G.Sizzle || (G.Sizzle = r)
})(window);
var TWEEN = TWEEN || function() {
    var a, d, c = 60,
        b = !1,
        e = [];
    return {
        setFPS: function(a) {
            c = a || 60
        },
        start: function(a) {
            0 != arguments.length && this.setFPS(a);
            d = setInterval(this.update, 1E3 / c)
        },
        stop: function() {
            clearInterval(d)
        },
        setAutostart: function(a) {
            (b = a) && !d && this.start()
        },
        add: function(a) {
            e.push(a);
            b && !d && this.start()
        },
        getAll: function() {
            return e
        },
        removeAll: function() {
            e = []
        },
        remove: function(b) {
            a = e.indexOf(b); - 1 !== a && e.splice(a, 1)
        },
        update: function(c) {
            a = 0;
            num_tweens = e.length;
            for (c = c || Date.now(); a < num_tweens;) e[a].update(c) ?
                a++ : (e.splice(a, 1), num_tweens--);
            0 == num_tweens && !0 == b && this.stop()
        }
    }
}();
TWEEN.Tween = function(a) {
    var d = {},
        c = {},
        b = {},
        e = 1E3,
        h = 0,
        k = null,
        p = TWEEN.Easing.Linear.EaseNone,
        l = null,
        m = null,
        n = null;
    this.to = function(c, d) {
        null !== d && (e = d);
        for (var f in c) null !== a[f] && (b[f] = c[f]);
        return this
    };
    this.start = function(q) {
        TWEEN.add(this);
        k = q ? q + h : Date.now() + h;
        for (var e in b) null !== a[e] && (d[e] = a[e], c[e] = b[e] - a[e]);
        return this
    };
    this.stop = function() {
        TWEEN.remove(this);
        return this
    };
    this.delay = function(a) {
        h = a;
        return this
    };
    this.easing = function(a) {
        p = a;
        return this
    };
    this.chain = function(a) {
        l = a
    };
    this.onUpdate =
        function(a) {
            m = a;
            return this
        };
    this.onComplete = function(a) {
        n = a;
        return this
    };
    this.update = function(b) {
        var g, f;
        if (b < k) return !0;
        b = (b - k) / e;
        b = 1 < b ? 1 : b;
        f = p(b);
        for (g in c) a[g] = d[g] + c[g] * f;
        null !== m && m.call(a, f);
        return 1 == b ? (null !== n && n.call(a), null !== l && l.start(), !1) : !0
    }
};
TWEEN.Easing = {
    Linear: {},
    Quadratic: {},
    Cubic: {},
    Quartic: {},
    Quintic: {},
    Sinusoidal: {},
    Exponential: {},
    Circular: {},
    Elastic: {},
    Back: {},
    Bounce: {}
};
TWEEN.Easing.Linear.EaseNone = function(a) {
    return a
};
TWEEN.Easing.Quadratic.EaseIn = function(a) {
    return a * a
};
TWEEN.Easing.Quadratic.EaseOut = function(a) {
    return -a * (a - 2)
};
TWEEN.Easing.Quadratic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
};
TWEEN.Easing.Cubic.EaseIn = function(a) {
    return a * a * a
};
TWEEN.Easing.Cubic.EaseOut = function(a) {
    return --a * a * a + 1
};
TWEEN.Easing.Cubic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a : 0.5 * ((a -= 2) * a * a + 2)
};
TWEEN.Easing.Quartic.EaseIn = function(a) {
    return a * a * a * a
};
TWEEN.Easing.Quartic.EaseOut = function(a) {
    return -(--a * a * a * a - 1)
};
TWEEN.Easing.Quartic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a * a : -0.5 * ((a -= 2) * a * a * a - 2)
};
TWEEN.Easing.Quintic.EaseIn = function(a) {
    return a * a * a * a * a
};
TWEEN.Easing.Quintic.EaseOut = function(a) {
    return (a -= 1) * a * a * a * a + 1
};
TWEEN.Easing.Quintic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2)
};
TWEEN.Easing.Sinusoidal.EaseIn = function(a) {
    return -Math.cos(a * Math.PI / 2) + 1
};
TWEEN.Easing.Sinusoidal.EaseOut = function(a) {
    return Math.sin(a * Math.PI / 2)
};
TWEEN.Easing.Sinusoidal.EaseInOut = function(a) {
    return -0.5 * (Math.cos(Math.PI * a) - 1)
};
TWEEN.Easing.Exponential.EaseIn = function(a) {
    return 0 == a ? 0 : Math.pow(2, 10 * (a - 1))
};
TWEEN.Easing.Exponential.EaseOut = function(a) {
    return 1 == a ? 1 : -Math.pow(2, -10 * a) + 1
};
TWEEN.Easing.Exponential.EaseInOut = function(a) {
    return 0 == a ? 0 : 1 == a ? 1 : 1 > (a *= 2) ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
};
TWEEN.Easing.Circular.EaseIn = function(a) {
    return -(Math.sqrt(1 - a * a) - 1)
};
TWEEN.Easing.Circular.EaseOut = function(a) {
    return Math.sqrt(1 - --a * a)
};
TWEEN.Easing.Circular.EaseInOut = function(a) {
    return 1 > (a /= 0.5) ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
};
TWEEN.Easing.Elastic.EaseIn = function(a) {
    var d, c = 0.1,
        b = 0.4;
    if (0 == a) return 0;
    if (1 == a) return 1;
    b || (b = 0.3);
    !c || 1 > c ? (c = 1, d = b / 4) : d = b / (2 * Math.PI) * Math.asin(1 / c);
    return -(c * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a - d) * Math.PI / b))
};
TWEEN.Easing.Elastic.EaseOut = function(a) {
    var d, c = 0.1,
        b = 0.4;
    if (0 == a) return 0;
    if (1 == a) return 1;
    b || (b = 0.3);
    !c || 1 > c ? (c = 1, d = b / 4) : d = b / (2 * Math.PI) * Math.asin(1 / c);
    return c * Math.pow(2, -10 * a) * Math.sin(2 * (a - d) * Math.PI / b) + 1
};
TWEEN.Easing.Elastic.EaseInOut = function(a) {
    var d, c = 0.1,
        b = 0.4;
    if (0 == a) return 0;
    if (1 == a) return 1;
    b || (b = 0.3);
    !c || 1 > c ? (c = 1, d = b / 4) : d = b / (2 * Math.PI) * Math.asin(1 / c);
    return 1 > (a *= 2) ? -0.5 * c * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a - d) * Math.PI / b) : 0.5 * c * Math.pow(2, -10 * (a -= 1)) * Math.sin(2 * (a - d) * Math.PI / b) + 1
};
TWEEN.Easing.Back.EaseIn = function(a) {
    return a * a * (2.70158 * a - 1.70158)
};
TWEEN.Easing.Back.EaseOut = function(a) {
    return (a -= 1) * a * (2.70158 * a + 1.70158) + 1
};
TWEEN.Easing.Back.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * (3.5949095 * a - 2.5949095) : 0.5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
};
TWEEN.Easing.Bounce.EaseIn = function(a) {
    return 1 - TWEEN.Easing.Bounce.EaseOut(1 - a)
};
TWEEN.Easing.Bounce.EaseOut = function(a) {
    return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
};
TWEEN.Easing.Bounce.EaseInOut = function(a) {
    return 0.5 > a ? 0.5 * TWEEN.Easing.Bounce.EaseIn(2 * a) : 0.5 * TWEEN.Easing.Bounce.EaseOut(2 * a - 1) + 0.5
};
this.Sfdc || (Sfdc = {});
if ("undefined" === typeof SfdcFramework) {
    var SfdcFramework = function(k, b) {
        function x(a, c, d) {
            var e = !1;
            b.isArray(d) && (e = !r(d));
            m[a] = {
                pending: e,
                name: a,
                ctr: c,
                dependencies: d
            };
            e ? b.require(d, function() {
                var b = m[a];
                b && (b.pending = !1);
                u(a)
            }) : u(a)
        }

        function u(a) {
            if (a in n) {
                for (var c = n[a], d = [], e, f = 0; f < c.length; f++) e = s[c[f]], r(e) && d.push(c[f]);
                delete n[a];
                a = d
            } else a = [];
            if (b.isArray(a) && 0 < a.length)
                for (c = 0; c < a.length; c++) t(a[c], s[a[c]])
        }

        function t(a, c) {
            var d = [];
            b.isArray(c) || (c = []);
            for (var e, f, g = 0; g < c.length; g++)(e =
                m[c[g]]) && !e.pending && (f = t(e.ctr, e.dependencies)), d.push(f);
            return a.apply(this, d)
        }

        function r(a) {
            b.assert(b.isArray(a), "Required ModulesList is an Array");
            for (var c, d = 0; d < a.length; d++)
                if (c = a[d], b.isEmpty(c) && b.error("A specified ModuleName must be a non empty string"), c = m[c], !c || c.pending) return !1;
            return !0
        }
        b || (b = {});
        var v = k.Sizzle,
            p = k.document,
            w = [],
            y = 0,
            q = Object.prototype.toString,
            m = {},
            s = {},
            n = {};
        b.isDebug = function() {
            var a = p && (p.head || p.getElementsByTagName("head")[0]);
            return a && "true" === a.getAttribute("debug")
        }();
        b.userAgent = new function() {
            var a = k.navigator && k.navigator.userAgent || "",
                b = -1 != a.indexOf("Chromium"),
                d = -1 != a.indexOf("AppleWebKit"),
                e = d && -1 != a.indexOf("Chrome/"),
                f = d && !e,
                g = -1 != a.indexOf("Firefox/"),
                h = -1 != a.indexOf("MSIE ") || -1 != a.indexOf("Trident/"),
                l = parseInt(a.split("MSIE")[1], 10) || -1;
            h && (-1 == l && -1 != a.indexOf("Trident/7.0")) && (l = 11);
            return {
                isIE: h,
                isIE11: h && 11 == l,
                isIE10: h && 10 == l,
                isIE9: h && 9 == l,
                isIE8: h && 8 == l,
                isIE7: h && 7 == l,
                isIE6: h && 6 == l,
                ieVersion: l,
                isWebkit: d,
                isChrome: e,
                isChromeFrame: e && "undefined" !=
                    typeof k.externalHost,
                isChromium: b,
                isSafari: f,
                isSafari3: f && -1 != a.indexOf("Version/3"),
                isSafariIpad: d && -1 != a.indexOf("iPad"),
                isSafariIOS: f && (-1 != a.indexOf("iPad") || -1 != a.indexOf("iPhone")),
                isFirefox: g,
                isFirefox3: g && -1 != a.indexOf("Firefox/3"),
                isOpera: -1 != a.indexOf("Opera"),
                isNetscape: -1 != a.indexOf("Netscape/")
            }
        };
        b.ns = function() {
            for (var a = Array.prototype.slice.call(arguments), b = null; a.length;)
                for (var d = (a.shift() || "").toString().split("."), b = k; d.length;) {
                    var e = d.shift();
                    if (!e.length) break;
                    b[e] || (b[e] = {});
                    b = b[e]
                }
            return b
        };
        b.provide = function(a, c) {
            if (a && c) {
                var d = b.resolve(a);
                if (!d) {
                    var e = a.split("."),
                        d = e.pop(),
                        e = b.ns(e.join("."));
                    c.$constructor && (b.assert(b.Class, "Sfdc.provide(): Sfdc.Class is required when providing $constructor 'classOrFunction' notation."), c = new b.Class(c));
                    b.define(a, function() {
                        return c
                    });
                    return e[d] = c
                }
                return d
            }
        };
        b.resolve = function(a, b) {
            var d = b || k;
            if (void 0 != a && a.length)
                for (var e = a.split("."); d && e.length;) d = d[e.shift()];
            return void 0 != d ? d : null
        };
        b.apply = function(a, b, d) {
            if (d)
                for (var e in b) b.hasOwnProperty(e) &&
                    (a[e] = b[e]);
            else
                for (var f in b) a.hasOwnProperty(f) || (a[f] = b[f]);
            return a
        };
        b.clone = function(a, c) {
            c = !!c;
            if (!a) return a;
            var d = b.isArray(a),
                e = b.isObject(a);
            if (!d && !e) return a;
            if (c) {
                if (d)
                    for (var d = [], f = 0, e = a.length; f < e; f++) d.push(b.clone(a[f], !0));
                else
                    for (f in d = {}, a) a.hasOwnProperty(f) && (d[f] = b.clone(a[f], !0));
                return d
            }
            return d ? a.slice() : b.apply({}, a)
        };
        b.each = function(a, c, d) {
            b.assert(b.Array, "Sfdc.each(): Sfdc.Array is required for calls to Sfdc.each().");
            if (b.isArray(a)) return b.Array.forEach(a, c,
                d);
            if ("length" in a) return b.Array.forEach(b.Array.toArray(a), c, d);
            b.error("You tried to iterate over an object that is not yet supported.");
            return null
        };
        b.onReady = function(a) {
            b.assert(b.Dom, "Sfdc.onReady(): Sfdc.Dom is required for calls to Sfdc.onReady().");
            return b.Dom.onReady(a)
        };
        b.onload = function(a) {
            b.assert(b.Dom, "Sfdc.onload(): Sfdc.Dom is required for calls to Sfdc.onload().");
            return b.Dom.onload(a)
        };
        b.isArray = function(a) {
            return void 0 === a || null === a ? !1 : "[object Array]" === q.call(a)
        };
        b.isObject =
            function(a) {
                return null != a ? "object" === typeof a && !b.isArray(a) : !1
            };
        b.isString = function(a) {
            return "[object String]" === q.call(a)
        };
        b.isBoolean = function(a) {
            return "[object Boolean]" === q.call(a)
        };
        b.isFunction = function(a) {
            return "function" === typeof a
        };
        b.isNumber = function(a) {
            return "[object Number]" === q.call(a)
        };
        b.select = function(a, c) {
            b.assert(v, "Sfdc.select(): There is no selection engine specified.");
            return v(a, c)
        };
        b.get = function(a, c) {
            if (!b.isString(a)) return a;
            var d = p;
            if (/^[>\.#\\]/.test(a)) return b.first(a,
                c);
            c ? d = c.getElementById ? c : c.ownerDocument : c = d;
            d = d.getElementById(a);
            return null === d || d.getAttribute("id") === a ? d : c.all ? c.all[a] : null
        };
        b.first = function(a, c) {
            return b.select(a, c)[0] || null
        };
        b.assert = function(a, c) {
            if (void 0 === a || null === a || !1 === !!a) throw "error" in b && b.error(c), Error(c);
            return a
        };
        b.isDefAndNotNull = function(a) {
            return void 0 !== a && null !== a
        };
        b.on = function(a, c, d, e, f) {
            b.assert(b.Event, "Sfdc.on(): Sfdc.Event is required to use Sfdc.on().");
            b.assert(a, "Sfdc.on(): 'element' must be a valid Object or Node.");
            b.assert(c, "Sfdc.on(): 'eventName' must be a valid String.");
            b.Event.add(a, c, d, e, f);
            return b
        };
        b.un = function(a, c, d, e) {
            b.assert(b.Event, "Sfdc.un(): Sfdc.Event is required to use Sfdc.un().");
            b.assert(a, "Sfdc.un(): 'element' must be a valid Object or Node.");
            b.assert(c, "Sfdc.un(): 'eventName' must be a valid String.");
            b.Event.remove(a, c, d, e);
            return b
        };
        b.getConst = function(a, c) {
            b.assert(void 0 !== k[a], "That Constants group does not exist.");
            return k[a][c]
        };
        b.getUID = function(a) {
            if (a.getAttribute) {
                var c =
                    a.getAttribute("data-uidSfdc");
                if (c) return c;
                c = b.newUID();
                a.setAttribute("data-uidSfdc", c);
                return c
            }
            return (c = a["data-uidSfdc"]) ? c : a["data-uidSfdc"] = b.newUID()
        };
        b.hasUID = function(a) {
            return a ? a.getAttribute ? null != a.getAttribute("data-uidSfdc") : a.hasOwnProperty ? a.hasOwnProperty("data-uidSfdc") : "data-uidSfdc" in a : !1
        };
        b.newUID = function() {
            return ++y
        };
        b.log = function(a, b, d) {
            void 0 !== a && w.push({
                msg: a,
                level: b,
                args: d
            });
            return w
        };
        b.isEmpty = function(a) {
            if (b.isObject(a)) {
                for (var c in a)
                    if (a.hasOwnProperty(c)) return !1;
                return !0
            }
            return null === a || void 0 === a || "" === a || b.isArray(a) && !a.length
        };
        b.inherits = function(a, c) {
            if (!b.isFunction(a)) throw Error("Sfdc.inherit(): 'type' must be a valid Function pointer.");
            for (var d = c; d;) {
                if (a === d || d instanceof a || a === d.constructor) return !0;
                d = d.prototype
            }
            return !1
        };
        b.implies = function(a, c, d) {
            if (!b.isObject(a)) throw Error("Sfdc.implies(): 'contract' must be a valid Object.");
            if (null == c) return d && (d.reason = "Instance was undefined."), !1;
            var e = null,
                f = null,
                g;
            for (g in a) {
                if (void 0 === c[g]) return d &&
                    (d.reason = b.String.format("Instance member not implemented. Expected: '{0}{1}'.", [g, b.isFunction(a[g]) ? b.String.format("({0})", [b.Function.getParameters(a[g]).join(", ")]) : ""])), !1;
                if (b.isFunction(a[g])) {
                    if (b.inherits(a[g], c[g])) continue;
                    if (b.isFunction(c[g]) && b.isDebug && (e = b.Function.getParameters(a[g]).join(", "), f = b.Function.getParameters(c[g]).join(", "), e != f)) return d && (d.reason = b.String.format("Instance member signature mismatch on '{0}()'. Expected '{0}({1})', found '{0}({2})'.", [g, e, f])), !1
                }
                if (b.isObject(a[g])) {
                    if (null !== c[g] && !b.implies(a[g], c[g], d)) return d && (d.reason = b.String.format("Instance member type mismatch on '{0}': {1}", [g, d.reason])), !1
                } else if (typeof a[g] !== typeof c[g]) return d && (d.reason = b.String.format("Instance member type mismatch on '{0}'. Expected '{1}', found '{2}'.", [g, typeof a[g], typeof c[g]])), !1
            }
            return !0
        };
        b.isAssignableFrom = function(a, c, d) {
            if (void 0 == a) throw Error("Sfdc.isAssignableFrom(): 'type' must be a valid Function or Object.");
            if (void 0 != c) switch (typeof a) {
                case "object":
                    if (a.constructor !=
                        Object && b.inherits(a.constructor, c) || b.implies(a, c, d)) return !0;
                    break;
                case "function":
                    if (b.inherits(a, c)) return !0
            }
            return !1
        };
        b.define = function(a, c, d) {
            b.assert(b.isString(a) && 0 < a.length, "ModuleName is required and must be a string of length greater than 0.");
            b.isFunction(c) ? (d = c, c = null) : (b.assert(b.isFunction(d), "ModuleConstructor parameter must be a function that returns an instance of the module."), b.assert(b.isArray(c), "Dependencies for your module must be specified as an Array."));
            var e = m[a];
            e ? (c =
                (e.dependencies || []).toString() === (c || []).toString(), (e.ctr.toString() !== d.toString() || !c) && b.error("Cannot redefine an existing module (" + a + ").")) : x(a, d, c)
        };
        b.require = function(a, c) {
            b.assert(!b.isEmpty(a), "Required Modules are required");
            b.isArray(a) || (a = Array.prototype.slice.call(arguments), c = a.pop());
            b.assert(b.isFunction(c), "Callback must be a function");
            if (r(a)) t(c, a);
            else {
                var d = c,
                    e = a;
                s[d] = e;
                for (var f, g, h = 0; h < e.length; h++)
                    if (f = e[h], g = m[f], !g || g.pending) !1 === f in n && (n[f] = []), n[f].push(d)
            }
        };
        b.error =
            function(a) {
                throw Error(a);
            };
        return b
    };
    new SfdcFramework(this, Sfdc)
};
Sfdc.provide("Sfdc.Labels", window.LC);
Sfdc.provide("Sfdc.UserContext", window.UserContext);
Sfdc.provide("Sfdc.Perf", window.Perf);
Sfdc.provide("Sfdc.Date", window.DateUtil);
(function(c) {
    c.provide("Sfdc.Ajax", {
        get: function(c, a, b) {
            b = b || {};
            b.method || (b.method = "GET");
            a && (b.success = a);
            return this.request(c, b)
        },
        crossDomainRequest: function(e, a, b) {
            b = b || {};
            b.isCrossDomain = !0;
            b.onBrowserNotSupportXDR || (b.onBrowserNotSupportXDR = c.Function.blank());
            return this.get(e, a, b)
        },
        post: function(c, a, b) {
            b = b || {};
            b.method = "POST";
            a && (b.success = a);
            return this.request(c, b)
        },
        jsonp: function(e, a) {
            var b = {
                success: function() {},
                onScriptLoad: function() {},
                data: {},
                cache: !1,
                callback: null
            };
            a ? c.apply(a, b) :
                a = b;
            !1 === a.cache && (a.data = a.data || {}, a.data._ = (new Date).getTime());
            var f = a.callback || "jsonp" + c.newUID();
            window[f] = function(b) {
                c.isFunction(a.success) && a.success(b);
                if (!a.callback) try {
                    window[f] = null, delete window[f]
                } catch (d) {
                    c.log("Couldn't delete jsonp callback function", c.Logging.LogLevel.INFO, d)
                }
            };
            a.data.callback = f;
            e = c.Url.generateUrl(e, a.data);
            c.Resource.addJavaScript(e, function() {
                if (c.isFunction(a.onScriptLoad)) a.onScriptLoad(this);
                c.Dom.removeChild(this)
            })
        },
        request: function(e, a) {
            var b = a.isCrossDomain ||
                !1,
                f = "undefined" != typeof XDomainRequest,
                h = b && f;
            a = c.apply(a || {}, {
                method: "GET",
                async: !0,
                beforerequest: function() {
                    return !0
                },
                success: function() {},
                failure: function() {},
                complete: function() {},
                contentType: null,
                headers: null,
                data: null,
                processData: !0,
                context: window,
                escape: function(a) {
                    return a
                }
            });
            a.method = a.method.toUpperCase();
            var d = this._createXmlHttpObject();
            if (b && !f && !("withCredentials" in d)) a.onBrowserNotSupportXDR();
            else {
                if (h) return this._handleXDR(e, a);
                b = function() {
                    if (4 === d.readyState) {
                        var b = d.status;
                        200 <= b && 300 > b || 304 === b || 1223 === b ? a.success && a.success.call(a.context, d.responseText, d, a) : a.failure && a.failure.call(a.context, d.responseText, d, a);
                        a.complete && a.complete.call(a.context, d.responseText, d, a);
                        a.complete = a.success = a.failure = a.beforerequest = null
                    }
                };
                a.data && ("GET" === a.method || "HEAD" === a.method ? e = c.Url.generateUrl(e, a.data, {
                    escape: a.escape
                }) : !c.isString(a.data) && a.processData && (a.data = c.Url.generateQueryString("", a.data, {
                    includeMark: !1,
                    escape: a.escape,
                    allowMultipleOfParam: !0
                })));
                a.async && (d.onreadystatechange =
                    b);
                if (!c.isFunction(a.beforerequest) || a.beforerequest.call(a.context)) {
                    d.open(a.method, e, a.async);
                    if (a.headers)
                        for (var g in a.headers) a.headers.hasOwnProperty(g) && d.setRequestHeader(g, a.headers[g]);
                    a.contentType ? d.setRequestHeader("Content-Type", a.contentType) : a.data && "POST" === a.method && d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset\x3dUTF-8");
                    d.send(a.data);
                    return !a.async ? (b(), g = d.responseText, d.onreadystatechange = function() {}, d = null, g) : d
                }
            }
        },
        _createXmlHttpObject: function() {
            if (window.XMLHttpRequest) return new window.XMLHttpRequest;
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0")
            } catch (c) {}
            return null
        },
        _handleXDR: function(e, a) {
            var b = new XDomainRequest;
            if (!c.isFunction(a.beforerequest) || a.beforerequest.call(a.context)) return b && (b.onerror = function() {
                a.failure.call(a.context, b.responseText, b, a)
            }, b.ontimeout = function() {
                a.failure.call(a.context, b.responseText, b, a)
            }, b.onprogress = function() {}, b.onload = function() {
                a.success.call(a.context, b.responseText, b, a)
            }, b.open("get", e), b.send()), b
        }
    })
})(Sfdc);
(function(c) {
    function m(a) {
        return c.apply({
            duration: c.Animation.DEFAULT_DURATION,
            delay: c.Animation.DEFAULT_DELAY,
            onComplete: c.Function.blank(),
            tryCSS: c.Animation.DEFAULT_USE_CSS_ANIMATION,
            timing: c.Animation.DEFAULT_TIMING_FUNCTION
        }, a || {}, !0)
    }

    function q(a, b) {
        var e;
        e = c.isEmpty(a) ? c.Animation.Easing[c.Animation.DEFAULT_TIMING_FUNCTION] : c.isString(a) ? c.Animation.Easing[a] : a;
        return !e ? c.Animation.Easing[c.Animation.DEFAULT_TIMING_FUNCTION][b.toUpperCase()] : e[b.toUpperCase()]
    }

    function v(a, b) {
        b = new n(b);
        var e = new l(b.toDashed());
        e.duration = 0;
        var d = new p(a);
        d.set(e);
        return c.Dom.setPrefixedStyle(a, "transition", d.toString())
    }

    function r() {}

    function s() {}

    function k() {}

    function t() {}

    function n(a) {
        if (a instanceof n) return a;
        this.rawProperty = a
    }

    function u(a) {}

    function p(a) {
        this.delimiter = ", ";
        this.onParse = l.parse;
        this.getId = function() {
            return this.prop
        };
        this.parse(c.Dom.getPrefixedStyle(a, "transition"))
    }

    function l(a) {
        this.prop = a
    }
    c.provide("Sfdc.Animation", {
        DEFAULT_DURATION: 400,
        DEFAULT_DELAY: 0,
        DEFAULT_USE_CSS_ANIMATION: !1,
        DEFAULT_TIMING_FUNCTION: "Linear",
        Easing: {
            Linear: {
                CSS: "linear",
                JS: TWEEN.Easing.Linear.EaseNone
            },
            Ease: {
                CSS: "ease",
                JS: TWEEN.Easing.Sinusoidal.EaseInOut
            },
            EaseIn: {
                CSS: "ease-in",
                JS: TWEEN.Easing.Cubic.EaseIn
            },
            EaseOut: {
                CSS: "ease-out",
                JS: TWEEN.Easing.Cubic.EaseOut
            },
            EaseInOut: {
                CSS: "ease-in-out",
                JS: TWEEN.Easing.Cubic.EaseInOut
            }
        },
        css: function(a, b, e, d, f) {
            c.assert(a && b, "An element and animation definition must be specified.");
            f = m(f);
            b = new n(b);
            if (e == d) c.Dom.setStyle(a, b.toCamelCase(), d);
            else {
                if (f.tryCSS) {
                    if (f.tryCSS &&
                        this.cssTransform(a, b, e, d, f)) return null
                } else v(a, b);
                f.onUpdate = function(e) {
                    c.Dom.setStyle(a, b.toCamelCase(), e)
                };
                return this.animate(e, d, f)
            }
        },
        property: function(a, b, e, d, f) {
            c.assert(a && b, "An element and animation definition must be specified.");
            f = m(f);
            f.onUpdate = function(c) {
                a[b] = c
            };
            return this.animate(e, d, f)
        },
        animate: function(a, b, e) {
            c.assert(c.isFunction(e.onUpdate), "config.onUpdate must be set to a function");
            e = m(e);
            var d = !c.isDefAndNotNull(a) ? null : !isNaN(a) ? new r : c.Units.HexColor.isHexColor(a) ? new k :
                /^[\d\.-]+px$/g.test(a) ? new s : /^rgb/g.test(a) ? new t : null;
            if (d) {
                var f = {},
                    g = {};
                d instanceof k ? (c.apply(f, d.toInt(a)), c.apply(g, d.toInt(b))) : (f.prop = d.toInt(a), g.prop = d.toInt(b));
                TWEEN.start();
                a = (new TWEEN.Tween(f)).to(g, e.duration).easing(q(e.timing, "JS")).onUpdate(function() {
                    if (d instanceof k) e.onUpdate(d.fromInt(f));
                    else e.onUpdate(d.fromInt(f.prop))
                }).onComplete(function() {
                    TWEEN.stop();
                    e.onComplete()
                });
                e.delay && a.delay(e.delay);
                return a.start()
            }
        },
        opacity: function(a, b, e, d) {
            function f(b) {
                c.Dom.setStyle(a,
                    "opacity", b)
            }

            function g() {
                var b = "" + c.Dom.getStyle(a, "opacity");
                "0" === b && c.Dom.hideByVisibility(a);
                if (!("opacity" in a.style) && ("1" === b || "0" === b)) {
                    var b = a,
                        e = b.style.filter;
                    c.isEmpty(e) ? b.style.opacity = "" : b.style.filter = c.String.trim(e.replace(/alpha\(opacity=(.*)\)/i, ""))
                }
                h && h()
            }
            var h;
            if (a) {
                d = m(d);
                b = Math.min(Math.max(0, b), 1);
                e = Math.min(Math.max(0, e), 1);
                h = d.onComplete;
                if (b || e) c.Dom.setStyle(a, "opacity", b), c.Dom.show(a);
                d.onUpdate = f;
                d.onComplete = g;
                if (b == e) c.Dom.setStyle(a, "opacity", e), d.onComplete();
                else return d.tryCSS && this.cssTransform(a, "opacity", b, e, d) ? null : this.animate(b, e, d)
            }
        },
        cssTransform: function(a, b, e, d, f) {
            function g() {
                c.un(a, "oTransitionEnd", g);
                c.un(a, "transitionend", g);
                c.un(a, "webkitTransitionEnd", g);
                f.onComplete();
                f = null
            }
            if (!a) return !1;
            f = m(f);
            b = new n(b);
            var h = new l(b.toDashed());
            h.duration = 0;
            var k = new p(a);
            k.set(h);
            if (!c.Dom.setPrefixedStyle(a, "transition", k.toString())) return !1;
            c.Dom.setStyle(a, b.toCamelCase(), e);
            h.duration = f.duration;
            h.delay = f.delay;
            h.timing = q(f.timing, "CSS");
            k.set(h);
            c.on(a, "oTransitionEnd", g);
            c.on(a, "transitionend", g);
            c.on(a, "webkitTransitionEnd", g);
            setTimeout(function() {
                c.Dom.setPrefixedStyle(a, "transition", k.toString());
                setTimeout(function() {
                    c.Dom.setStyle(a, b.toCamelCase(), d)
                }, 0)
            }, 0);
            return !0
        }
    }, !0);
    r.prototype = {
        toInt: function(a) {
            return a
        },
        fromInt: function(a) {
            return a
        }
    };
    s.prototype = {
        toInt: function(a) {
            return 1 * a.replace(/\D+$/gi, "")
        },
        fromInt: function(a) {
            return a + "px"
        }
    };
    k.prototype = {
        toInt: function(a) {
            var b, c, d;
            4 == a.length && (b = a.substr(1, 1), c = a.substr(2,
                1), d = a.substr(3, 1), b = parseInt(b + b, 16), c = parseInt(c + c, 16), d = parseInt(d + d, 16));
            7 == a.length && (b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16), d = parseInt(a.substr(5, 2), 16));
            return {
                r: b,
                g: c,
                b: d
            }
        },
        fromInt: function(a) {
            return "#" + [(16 > Math.round(a.r) ? "0" : "") + Math.round(a.r).toString(16), (16 > Math.round(a.g) ? "0" : "") + Math.round(a.g).toString(16), (16 > Math.round(a.b) ? "0" : "") + Math.round(a.b).toString(16)].join("")
        }
    };
    t.prototype = {
        toInt: function(a) {
            a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return {
                r: a[1],
                g: a[2],
                b: a[3]
            }
        },
        fromInt: function(a) {
            return c.String.format("rgb({r}, {g}, {b})", a)
        }
    };
    n.prototype = {
        rawProperty: null,
        toCamelCase: function() {
            var a = c.String.toCamelCase(this.rawProperty);
            this.toCamelCase = function() {
                return a
            };
            return a
        },
        toDashed: function() {
            var a = c.String.dashify(this.rawProperty);
            this.toDashed = function() {
                return a
            };
            return a
        }
    };
    u.prototype = {
        delimiter: ", ",
        onParse: function() {},
        $coll: {},
        get: function(a) {
            return this.$coll[a]
        },
        set: function(a) {
            this.$coll[a.getId()] = a
        },
        toString: function() {
            var a = [],
                b;
            for (b in this.$coll) this.$coll.hasOwnProperty(b) && a.push(this.$coll[b].toString());
            return a.join(this.delimiter)
        },
        parse: function(a) {
            if (a) {
                a = a.split(this.delimiter);
                for (var b, c = 0, d = a.length; c < d; c++)(b = this.onParse(a[c])) && (this.$coll[b.prop] = b)
            }
        }
    };
    p.prototype = new u;
    l.parse = function(a) {
        var b = new l;
        b.parse(a);
        return b
    };
    l.prototype = {
        getId: function() {
            return this.prop
        },
        parse: function(a) {
            if (!a) throw "Invalid string to parse.";
            a = a.split(" ");
            this.prop = a[0];
            this.duration = a[1] || 0;
            this.delay = a[2] || 0;
            a[3] &&
                (this.timing = a[3])
        },
        toString: function() {
            var a = [this.prop, this.getDuration(), this.getDelay()];
            this.timing && a.push(this.timing);
            return a.join(" ")
        },
        getDuration: function() {
            return -1 < this.duration.toString().indexOf("s") ? this.duration : this.duration + "ms"
        },
        getDelay: function() {
            return -1 < this.delay.toString().indexOf("s") ? this.delay : this.delay + "ms"
        },
        prop: "",
        duration: 0,
        delay: 0,
        timing: ""
    }
})(Sfdc);
Sfdc.provide("Sfdc.Aria", function(b) {
    var c = function() {
        if (!b.get("sfdc_aria_asstv_marquee")) {
            var a = [];
            a.push('\x3cdiv id\x3d"sfdc_aria_asstv_marquee" class\x3d"assistiveText zen-assistiveText"\x3e');
            a.push('    \x3cdiv id\x3d"sfdc_aria_msg_alert" role\x3d"alert"\x3e\x3c/div\x3e');
            a.push('    \x3cdiv id\x3d"sfdc_aria_msg_assertive" aria-live\x3d"assertive" aria-atomic\x3d"false" aria-relevant\x3d"additions"\x3e\x3c/div\x3e');
            a.push('    \x3cdiv id\x3d"sfdc_aria_msg_polite" aria-live\x3d"polite" aria-atomic\x3d"false" aria-relevant\x3d"additions"\x3e\x3c/div\x3e');
            a.push("\x3c/div\x3e");
            b.Dom.insertHTML(document.body, a.join(""))
        }
        c = function() {}
    };
    return {
        alert: function(a) {
            b.assert(b.isString(a), "msg parameter must be String");
            c();
            b.get("sfdc_aria_msg_alert").innerHTML = a
        },
        assert: function(a) {
            b.assert(b.isString(a), "msg parameter must be String");
            c();
            b.get("sfdc_aria_msg_assertive").innerHTML += a
        },
        notify: function(a) {
            b.assert(b.isString(a), "msg parameter must be String");
            c();
            b.get("sfdc_aria_msg_polite").innerHTML += a
        }
    }
}(Sfdc));
(function(e) {
    e.provide("Sfdc.Array", {
        indexOf: function(a, c) {
            if (Array.prototype.indexOf) return a.indexOf(c);
            for (var b = a.length - 1; 0 <= b; b--)
                if (a[b] === c) return b;
            return -1
        },
        toArray: function(a) {
            if (!e.isDefAndNotNull(a)) return [];
            for (var c = Array(a.length), b = 0, d = a.length; b < d; b++) c[b] = a[b];
            return c
        },
        map: function(a, c, b) {
            e.assert(e.isArray(a), "Must provide a valid non null array.");
            e.assert(e.isFunction(c), "A valid non null function must be supplied to operate on the array.");
            if (Array.prototype.map) return a.map(c,
                b);
            for (var d = a.length, f = [], g = 0; g < d; g++) g in a && f.push(c.call(b, a[g]));
            return f
        },
        forEach: function(a, c, b) {
            e.assert(e.isArray(a), "Must provide a valid non null array.");
            e.assert(e.isFunction(c), "A valid non null function must be supplied to operate on the array.");
            if (Array.prototype.forEach) return a.forEach(c, b);
            for (var d = 0, f = a.length; d < f; d++) d in a && c.call(b, a[d], d, a)
        },
        find: function(a, c, b) {
            e.assert(e.isArray(a), "Must provide a valid non null array.");
            e.assert(e.isFunction(c), "A valid non null function must be supplied to operate on the array.");
            for (var d = 0, f = a.length; d < f; d++)
                if (d in a && c.call(b, a[d], d)) return a[d];
            return null
        }
    })
})(Sfdc);
(function(e) {
    function w(b, a, f, c, m) {
        var h = q(a, c),
            d;
        for (d in h)
            if (!s.hasOwnProperty(d)) {
                if (c[d])
                    if (e.isFunction(c[d])) {
                        if ("toString" != d || !c[d].Documented) b[d] = t(c[d], a, f)
                    } else b[d] = c[d];
                e.isFunction(h[d]) && (f[d] = r(h[d].bind(b), h[d]), m && (a[d] = null, delete a[d]))
            }
    }

    function r(b, a) {
        if (b && void 0 != a) {
            var f = b.toString.bind(b);
            b.toString = function(b) {
                return !b ? a + "" : e.String.format("{0}\n\nOriginal:\n\n{1}", [a + "", f()])
            };
            b.toString.Documented = !0
        }
        return b
    }

    function x(b, a, f, c) {
        c || (c = {});
        for (var m in b)
            if (!s.hasOwnProperty(m)) {
                var h =
                    b[m];
                e.isFunction(h) && (h = t(h, a, f));
                c[m] && c[m] != s[m] ? c[m] = h : a[m] = h
            }
    }

    function q(b, a) {
        var f = {},
            c;
        for (c in b)
            if (!a || a[c] !== b[c]) f[c] = b[c];
        return f
    }

    function y(b, a, f, c) {
        return t(b, a, r(function() {
            var b = q(f),
                e = q(a);
            a.parent && (a.parent._instance = c);
            var d = f.apply(a, arguments);
            a.parent && delete a.parent._instance;
            w(a, f, c, b, !0);
            w(a, a, c, e, !1);
            return d
        }, f))
    }

    function t(b, a, f) {
        return r(function() {
            a || (a = this);
            var c = a.parent;
            a.parent = f;
            var e = b.apply(a, arguments);
            a.parent = c;
            return e
        }, b)
    }

    function z(b, a, f) {
        b = function() {};
        b.prototype = f && f.prototype || a && a.prototype;
        return new b
    }

    function A(b, a) {
        b && (a || (a = this), e.isFunction(b) && (b = b.prototype), e.apply(a, b, !0))
    }
    var s = {
        parent: !0,
        constructor: !0,
        prototype: !0,
        $constructor: !0,
        $decorators: !0,
        $extends: !0,
        $implements: !0
    };
    e.provide("Sfdc.Class", function(b, a) {
        b || (b = {});
        e.isFunction(b) && (b = {
            $constructor: b
        }, void 0 != a && (b.$extends = a));
        if (b.hasOwnProperty("$constructor") && !e.isFunction(b.$constructor)) throw Error("Sfdc.Class.ctor: '$constructor' must be a valid Function pointer.");
        if (b.hasOwnProperty("$extends") && !e.isFunction(b.$extends)) throw Error("Sfdc.Class.ctor: '$extends' must be a valid Function pointer.");
        return function(a, c, m, h) {
            function d() {
                var n = q(this),
                    k = c ? {} : null;
                x(a.prototype || a, this, k, n);
                var l = h;
                if (l) {
                    e.isArray(l) || (l = [l]);
                    for (var p = 0; p < l.length; p++) A(l[p], this)
                }
                x(b, this, k);
                var l = d,
                    p = k,
                    u = q(this, n),
                    g;
                for (g in u)
                    if (!s.hasOwnProperty(g) && u.hasOwnProperty(g) && n.hasOwnProperty(g)) {
                        this[g] = n[g];
                        var v = r(u[g].bind(this), u[g]);
                        this.parent && this.parent._instance && (this.parent._instance[g] =
                            v);
                        p && (p[g] = v);
                        l[g] = v
                    }
                k = (c ? y(a, this, c, k) : t(a, this)).apply(this, arguments);
                if ((g = m) && this) {
                    e.isArray(g) || (g = [g]);
                    n = {};
                    for (l = 0; l < g.length; l++) e.implies(g[l], this, n) || e.assert(!1, n.reason)
                }
                this.constructor = d;
                if (void 0 !== k) {
                    a: switch (typeof k) {
                        case "number":
                            k = new Number(k);
                            break a;
                        case "string":
                            k = new String(k);
                            break a
                    }
                    return k
                }
            }
            a || (a = new Function);
            if (e.inherits(a, c)) throw Error(e.String.format("Sfdc.Class.ctor:'$extends' is already in the inheritance chain of '$constructor'. '$constructor': {0}, $'expected': {1}.", [a.toString(), c.toString()]));
            d.prototype = z(d, a, c);
            return r(d, a)
        }(b.$constructor, b.$extends, b.$implements, b.$decorators)
    })
})(this.Sfdc);
Sfdc.provide("Sfdc.Cookie", {
    setCookie: function(e, d, b, c, a, f, g) {
        g = g || encodeURIComponent;
        document.cookie = e + "\x3d" + g(d) + (b ? "; expires\x3d" + b.toGMTString() : "") + (c ? "; path\x3d" + c : "; path\x3d/") + (a ? "; domain\x3d" + a : "") + (!0 === f ? "; secure" : "")
    },
    getCookie: function(e, d) {
        d = d || decodeURIComponent;
        var b = document.cookie,
            c = e + "\x3d",
            a = b.indexOf("; " + c);
        if (-1 == a) {
            if (a = b.indexOf(c), 0 !== a) return null
        } else a += 2;
        var f = document.cookie.indexOf(";", a); - 1 == f && (f = b.length);
        return d(b.substring(a + c.length, f))
    },
    deleteCookie: function(e,
        d, b) {
        if (this.getCookie(e)) {
            var c = new Date((new Date).getTime() + -1E4);
            this.setCookie(e, "", c, d, b)
        }
    }
});
Sfdc.provide("Sfdc.Data", function(b) {
    var e = {};
    return {
        set: function(a, d, c) {
            b.assert(a, "An element must be provided for Sfdc.Data.set(el, name, val);");
            b.assert(d, "A name must be defined for Sfdc.Data.set(el, name, val);");
            a = b.getUID(b.get(a));
            e[a] || (e[a] = {});
            e[a][d] = c
        },
        get: function(a, d) {
            b.assert(a, "An element must be provided for Sfdc.Data.get(el, name);");
            a = b.get(a);
            var c = null;
            b.hasUID(a) && (c = e[b.getUID(a)]);
            c && void 0 !== d && (c = c[d]);
            return c
        },
        clear: function(a, b) {
            this.set(a, b, null)
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.Debug", {
    describe: function(b, a) {
        a = a || Sfdc.log;
        var c = [],
            d;
        for (d in b) b.hasOwnProperty(d) && c.push([d, b[d]].join(" \x3d "));
        a(c.join(", "))
    },
    log: function(b, a) {
        window.console && (b.constructor == Array ? window.console.log.apply(this, arguments) : window.console.log(Sfdc.String.format(b, a)))
    },
    warn: function(b, a) {
        window.console && window.console.warn(Sfdc.String.format(b, a))
    },
    error: function(b, a) {
        window.console && window.console.error(Sfdc.String.format(b, a))
    },
    logUsage: function(b, a) {
        if (Sfdc.isDefAndNotNull(a)) Sfdc.isArray(a) ||
            (a = [a]);
        else {
            a = [];
            for (var c in b) b.hasOwnProperty(c) && Sfdc.isFunction(b[c]) && a.push(c)
        }
        c = 0;
        for (var d = a.length; c < d; c++) Sfdc.isFunction(b[a[c]]) && Sfdc.Function.wrap(b, a[c], function(a) {
            return function() {
                Sfdc.log("Logging usage: " + a)
            }
        }(a[c]))
    }
});
(function(n, r) {
    n.provide("Sfdc.Dom", new function(e, h) {
        function m(a) {
            try {
                return a()
            } catch (b) {
                e.error && e.error(b)
            }
        }

        function n(a) {
            for (var b = 0, c = a.length; b < c; b++) m(a[b]);
            a.length = 0
        }

        function s(a, b) {
            if (a) {
                void 0 == b && (b = !0);
                var c = a.attributes;
                if (c && c.length)
                    for (var d = e.isArray(a), f = null, g = c.length - 1; 0 <= g; g--)
                        if (f = c[g].name, !("style" == f || "undefined" == typeof a[f])) switch (typeof a[f]) {
                            case "object":
                            case "function":
                                d ? a[f] = null : e.isFunction(a.setAttribute) && a.setAttribute(f, null)
                        }
                        e.Event && e.Event.removeAll(a, !1);
                if (b && (c = a.childNodes)) {
                    d = 0;
                    for (f = c.length; d < f; d++) s(c[d], b)
                }
            }
        }

        function l(a, b, c, d, e) {
            if (b)
                if (b.addEventListener) {
                    if (!e) b[a ? "addEventListener" : "removeEventListener"](c, d, !1)
                } else if (b.attachEvent && (e || 5 > arguments.length)) b[a ? "attachEvent" : "detachEvent"]("on" + c, d)
        }
        var r = {
                A: 1,
                ABBR: 1,
                B: 1,
                CODE: 1,
                EM: 1,
                I: 1,
                IMG: 1,
                INPUT: 1,
                LABEL: 1,
                SELECT: 1,
                SMALL: 1,
                SPAN: 1,
                TEXTAREA: 1
            },
            p = ["", "Moz", "Webkit", "O"],
            q = {},
            k = null;
        this.isNode = function(a) {
            return a && !(!isNaN(parseFloat(a)) && isFinite(a)) && "nodeType" in a
        };
        this.isElement =
            function(a) {
                return this.isNode(a) && a.nodeType == Node.ELEMENT_NODE
            };
        this.replace = function(a, b) {
            if (!this.isNode(a)) throw Error("Sfdc.Dom.replace(): 'replacementNode' must be a valid Node.");
            if (!this.isNode(b)) throw Error("Sfdc.Dom.replace(): 'targetNode' must be a valid Node.");
            if (!this.isNode(b.parentNode)) throw Error("Sfdc.Dom.replace(): 'targetNode' must be attached to a valid Node.");
            var c = b.parentNode;
            c.insertBefore(a, b);
            c.removeChild(b);
            return a
        };
        this.setText = function(a, b) {
            e.assert(a, "No element specified!");
            a = e.get(a);
            this.updateHTML(a, "");
            a.appendChild(document.createTextNode(b));
            return this
        };
        this.getText = function(a) {
            e.assert(a, "No element specified!");
            a = e.get(a);
            return void 0 !== a.innerText ? a.innerText : a.textContent
        };
        this.getTextFromMarkup = function(a) {
            if (!a) return "";
            k || (k = document.createElement("div"));
            k.innerHTML = a;
            a = "textContent" in k ? k.textContent : k.innerText;
            k.innerHTML = "";
            return a
        };
        this.hideByDisplay = function(a) {
            e.assert(a, "No Element specified.");
            a = e.get(a);
            e.isArray(a) || (a = [a]);
            for (var b, c; b =
                a.pop();) c = this.getStyle(b, "display"), "none" !== c && e.Data.set(b, "original-display", c), this.setStyle(b, "display", "none");
            return this
        };
        this.hideByVisibility = function(a) {
            e.assert(a, "No Element specified.");
            a = e.get(a);
            e.isArray(a) || (a = [a]);
            this.set(a, {
                style: {
                    visibility: "hidden"
                }
            });
            return this
        };
        this.show = function(a) {
            e.assert(a, "No Element specified.");
            a = e.get(a);
            e.isArray(a) || (a = [a]);
            for (var b, c, d; b = a.pop();) c = this.getStyles(b, ["visibility", "display"]), d = {}, "hidden" === c.visibility && (d.visibility = "visible"),
                "none" === c.display && (d.display = e.Data.get(b, "original-display"), d.display || (d.display = r.hasOwnProperty(b.nodeName) ? "inline" : "block")), this.setStyles(b, d);
            return this
        };
        this.isVisible = function(a, b) {
            a = e.get(a);
            var c = this.getStyles(a, ["visibility", "display"]),
                c = !("hidden" === c.visibility || "none" === c.display);
            return !c || !b ? c : "BODY" !== a.tagName.toUpperCase() && a.parentNode && "BODY" !== a.parentNode.tagName.toUpperCase() ? this.isVisible(a.parentNode, b) : !0
        };
        this.blur = function(a) {
            if (this.isElement(a) && a.blur) try {
                return a.blur(), !0
            } catch (b) {}
            return !1
        };
        this.focus = function(a, b) {
            if (this.isElement(a) && a.focus) try {
                return a.focus(), b && a.select && a.select(), !0
            } catch (c) {}
            return !1
        };
        this.get = function(a, b) {
            a = e.get(a);
            if (e.isArray(b)) {
                for (var c = {}, d = 0, f = b.length; d < f; d++) c[b[d]] = a[b[d]];
                return c
            }
            return a[b]
        };
        this.getAttribute = function(a, b, c) {
            if (!this.isElement(a) && !e.isFunction(a && a.getAttribute)) throw Error("Sfdc.Dom.getAttribute(): 'element' must be a valid Element or implement the method getAttribute(name).");
            a = a.getAttribute(b);
            null ===
                a && void 0 !== c && (a = c);
            return a
        };
        this.set = function(a, b, c) {
            if (e.isArray(a)) {
                for (var d = 0, f = a.length; d < f; d++) this.set(a[d], b, c);
                return this
            }
            a = e.get(a);
            e.assert(a, "First parameter to Sfdc.Dom.set() was empty. It should either be an element, selector or an array of such values.");
            if (e.isObject(b)) {
                for (d in b)
                    if (b.hasOwnProperty(d)) switch (d) {
                        case "attributes":
                            for (f in b.attributes) b.attributes.hasOwnProperty(f) && a.setAttribute(f, b.attributes[f]);
                            break;
                        case "style":
                            this.setStyles(a, b[d]);
                            break;
                        case "innerText":
                            this.setText(a,
                                b[d]);
                            break;
                        default:
                            c = b[d], e.assert("object" !== typeof c, "You cannot set objects or arrays to an element. It has the tendency to create memory leaks."), a[d] = c
                    }
                    return this
            }
            e.assert("object" !== typeof c, "You cannot set objects or arrays to an element. It has the tendency to create memory leaks.");
            a[b] = c;
            return this
        };
        this.setStyle = function(a, b, c) {
            a = e.get(a);
            "opacity" === b && !(b in a.style) && (b = "filter", c = "alpha(opacity\x3d" + 100 * c + ")");
            c != this.getStyle(a, b) && (a.style[b] = c);
            return this
        };
        this.setStyles = function(a,
            b) {
            a = e.get(a);
            for (var c in b) b.hasOwnProperty(c) && this.setStyle(a, c, b[c]);
            return this
        };
        this.getStyle = function(a, b) {
            a = e.get(a);
            if (a.currentStyle) {
                if ("opacity" === b && !(b in a.style)) {
                    var c = a.currentStyle.filter;
                    return !c || -1 === c.indexOf("alpha") ? 1 : parseInt(c.replace(/[^\d^\.^-]/g, "")) / 100
                }
                return a.currentStyle[b]
            }
            if (document.defaultView && document.defaultView.getComputedStyle) return (c = document.defaultView.getComputedStyle(a, null)) ? c.getPropertyValue(e.String.dashify(b)) : null
        };
        this.getStyles = function(a,
            b) {
            a = e.get(a);
            for (var c = {}, d = 0, f = b.length, g; d < f; d++) g = b[d], c[g] = this.getStyle(a, g);
            return c
        };
        this.getElementXY = function(a) {
            a = e.get(a);
            var b = 0,
                c = 0;
            if (a.getBoundingClientRect) {
                var c = a.getBoundingClientRect(),
                    b = Math.round(c.left),
                    c = Math.round(c.top),
                    d = a.ownerDocument;
                d && d.documentElement && (b -= d.documentElement.clientLeft, c -= d.documentElement.clientTop);
                "fixed" !== e.Dom.getStyle(a, "position") && (b += e.Window.getScrollX(d), c += e.Window.getScrollY(d))
            } else
                for (; null !== a;) b += a.offsetLeft, c += a.offsetTop, a = a.offsetParent;
            return {
                x: b,
                y: c
            }
        };
        this.setElementXY = function(a, b) {
            a = e.get(a);
            var c = this.getElementXY(a),
                d = parseInt(this.getStyle(a, "left"), 10),
                f = parseInt(this.getStyle(a, "top"), 10),
                g = "relative" == this.getStyle(a, "position"),
                d = !isNaN(d) ? d : g ? 0 : a.offsetLeft,
                f = !isNaN(f) ? f : g ? 0 : a.offsetTop;
            this.setStyles(a, {
                left: b[0] - c.x + d + "px",
                top: b[1] - c.y + f + "px"
            })
        };
        this.getPositionXY = function(a, b, c) {
            e.assert(a, "Trying to get positionXY of a non existent element");
            a = e.get(a);
            b = (b || "tl").toLowerCase();
            var d = null,
                d = this.getWidth(a),
                f = this.getHeight(a);
            switch (b) {
                case "c":
                    d = [Math.round(0.5 * d), Math.round(0.5 * f)];
                    break;
                case "t":
                    d = [Math.round(0.5 * d), 0];
                    break;
                case "l":
                    d = [0, Math.round(0.5 * f)];
                    break;
                case "r":
                    d = [d, Math.round(0.5 * f)];
                    break;
                case "b":
                    d = [Math.round(0.5 * d), f];
                    break;
                case "tl":
                    d = [0, 0];
                    break;
                case "tr":
                    d = [d, 0];
                    break;
                case "lb":
                case "bl":
                    d = [0, f];
                    break;
                case "rb":
                case "br":
                    d = [d, f];
                    break;
                default:
                    throw "Unsupported position option";
            }
            a = c ? {
                x: 0,
                y: 0
            } : this.getElementXY(a);
            return [a.x + d[0], a.y + d[1]]
        };
        this.alignTo = function(a, b, c, d) {
            e.assert(a, "Trying to align a non existent element");
            e.assert(b, "Trying to align with a non existent element");
            var f = (c || "tl-bl").toLowerCase().split("-");
            c = e.Dom.getPositionXY(a, f[0], !0);
            b = e.Dom.getPositionXY(b, f[1]);
            d = d || [0, 0];
            this.setElementXY(a, [b[0] - c[0] + d[0], b[1] - c[1] + d[1]])
        };
        this.getLocalOffsetXY = function(a) {
            var b = {
                    x: a.offsetLeft,
                    y: a.offsetTop
                },
                c;
            try {
                c = a.offsetParent
            } catch (d) {
                return b
            }
            for (; c && "static" == this.getStyle(c, "position");) {
                b.x += c.offsetLeft;
                b.y += c.offsetTop;
                try {
                    c = c.offsetParent
                } catch (e) {
                    break
                }
            }
            return b
        };
        this.deepCopy = function(a, b) {
            var c =
                b.createElement(a.tagName);
            if ("undefined" != typeof a.attributes && null !== a.attributes)
                for (var d = 0; d < a.attributes.length; d++) c.setAttribute(a.attributes[d].name, a.attributes[d].value);
            null !== a.nodeValue && c.appendChild(b.createTextNode(a.nodeValue));
            if ("undefined" != typeof a.childNodes && null !== a.childNodes)
                for (var d = 0, e = a.childNodes.length; d < e; d++) c.appendChild(this.deepCopy(a.childNodes[d], b));
            return c
        };
        this.importNode = function(a, b) {
            e.assert(a, "Node to import is a required parameter.");
            if (b.importNode) return b.importNode(a, !1);
            for (var c = b.createElement(a.tagName), d = 0; d < a.attributes.length; d++) a.attributes[d].specified && c.setAttribute(a.attributes[d].name, a.attributes[d].value);
            return c
        };
        this.cleanListeners = function(a, b) {
            if (a) {
                var c = null;
                !e.isArray(a) && !e.Dom.isNodeList(a) && (a = [a]);
                void 0 == b && (b = !0);
                for (var d = 0, f = a.length; d < f; d++) c = a[d], (this.isElement(c) || c === h) && s(a[d], b)
            }
            return this
        };
        this.isNodeList = function(a) {
            return "undefined" != typeof NodeList ? a instanceof NodeList : "object" == typeof a && "number" == typeof a.length &&
                "undefined" != typeof a.item
        };
        this.updateHTML = function(a, b, c, d) {
            a = e.get(a);
            e.isFunction(d) || (d = function() {});
            e.isDefAndNotNull(a) && e.isDefAndNotNull(b) && (this.cleanListeners(a.childNodes), a.innerHTML = b, c && e.Resource.execScripts(e.Resource.getScriptsFromHtml(a), d));
            return this
        };
        this.replaceChildrenWith = function(a, b, c, d) {
            a = e.get(a);
            if (e.isDefAndNotNull(a)) {
                b = e.get(b);
                var f = a.childNodes;
                this.cleanListeners(f);
                for (f = f.length; 0 <= --f;) a.removeChild(a.firstChild);
                a.appendChild(b);
                c && (e.isFunction(d) || (d = function() {}),
                    e.Resource.execScripts(e.Resource.getScriptsFromHtml(a), d))
            }
            return this
        };
        this.insertHTML = function(a, b) {
            var c = [],
                d = document.createElement("DIV");
            d.innerHTML = b;
            for (var e; e = d.firstChild;) c.push(e), a.appendChild(e);
            return c
        };
        this.removeChild = function(a) {
            a && a.parentNode && (this.cleanListeners(a), a.parentNode.removeChild(a));
            return this
        };
        this.hasClass = function(a, b) {
            return this.isElement(a) || !e.isEmpty(a) ? a.classList ? a.classList.contains(b) : 0 <= (" " + a.className + " ").indexOf(" " + b + " ") : !1
        };
        this.addClass = function(a,
            b) {
            if (this.isElement(a) || !e.isEmpty(a))
                if (e.isArray(b) || (b = e.isString(b) ? e.String.trim(b).split(/\s+/) : [b]), a.classList)
                    for (var c = b.length - 1; 0 <= c; c--) e.isEmpty(b[c]) || a.classList.add(b[c]);
                else if (e.isEmpty(a.className)) a.className = b.join(" ");
            else {
                for (var c = [], d = b.length - 1; 0 <= d; d--) this.hasClass(a, b[d]) || c.push(b[d]);
                0 < c.length && (a.className += " " + c.join(" "))
            }
            return this
        };
        this.removeClass = function(a, b) {
            if (this.isElement(a) || !e.isEmpty(a)) {
                e.isArray(b) || (b = e.isString(b) ? e.String.trim(b).split(/\s+/) : [b]);
                if (a.classList) {
                    for (var c = b.length; 0 <= c; c--) a.classList.remove(b[c]);
                    return this
                }
                for (var c = e.String.trim, d = c(a.className).split(/\s+/), f, g = b.length - 1; 0 <= g; g--) f = c(b[g]), f = e.Array.indexOf(d, f), -1 != f && d.splice(f, 1);
                a.className = d.join(" ")
            }
            return this
        };
        this.toggleClass = function(a, b, c) {
            void 0 === c && (c = !this.hasClass(a, b));
            c ? this.addClass(a, b) : this.removeClass(a, b);
            return this
        };
        this.getParent = function(a, b) {
            var c = a.parentNode;
            if (!b) return c;
            for (; c;) {
                if (c.getAttribute && this.isMatch(c, b)) return c;
                c = c.parentNode
            }
            return null
        };
        this.getFirstChild = function(a, b) {
            e.assert(this.isElement(a), "Sfdc.Dom.getFirstChild: el must be an HTMLElement");
            if (e.isString(b)) return e.get("\x3e " + b, a);
            var c = a.firstElementChild;
            if (c) return c;
            c = a.firstChild;
            return !c ? null : 1 === c.nodeType ? c : this.getNext(c)
        };
        this.getPrevious = function(a, b) {
            var c = a.previousElementSibling;
            if (!c)
                for (c = a.previousSibling; c && 1 !== c.nodeType;) c = c.previousSibling;
            if (!b) return c;
            for (; c;) {
                if (this.isMatch(c, b)) return c;
                c = this.getPrevious(c)
            }
            return null
        };
        this.getNext = function(a,
            b) {
            var c = a.nextElementSibling;
            if (!c)
                for (c = a.nextSibling; c && 1 !== c.nodeType;) c = c.nextSibling;
            if (!b) return c;
            for (; c;) {
                if (this.isMatch(c, b)) return c;
                c = this.getNext(c)
            }
            return null
        };
        this.isMatch = function(a, b) {
            e.isArray(a) || (a = [a]);
            return 1 === Sizzle.matches(b, a).length
        };
        this.getWidth = function(a, b) {
            return !b && !isNaN(a.clientWidth) && 0 < a.clientWidth ? a.clientWidth : a.offsetWidth || 0
        };
        this.getHeight = function(a, b) {
            return !b && !isNaN(a.clientHeight) && 0 < a.clientHeight ? a.clientHeight : a.offsetHeight || 0
        };
        this.getScrollBarWidth =
            function(a) {
                if (a) return a.offsetWidth - a.clientWidth;
                void 0 == this.scrollBarWidth && (a = this.create(document.body || document.documentElement, {
                    style: {
                        overflow: "scroll",
                        visibility: "hidden",
                        width: "100px",
                        height: "100px",
                        position: "absolute"
                    }
                }), this.scrollBarWidth = a.offsetWidth - a.clientWidth, a.parentNode.removeChild(a));
                return this.scrollBarWidth
            };
        this.computeTextWidth = function(a, b) {
            var c = 0,
                d = null;
            try {
                d = this.create(h.document.body || h.document.documentElement, {
                    style: {
                        position: "absolute",
                        top: "-1000px",
                        left: "-1000px",
                        visibility: "hidden"
                    }
                }, "SPAN");
                if (b) {
                    var f = this.getStyles(b, "fontSize fontStyle fontWeight fontFamily textTransform letterSpacing".split(" "));
                    this.setStyles(d, {
                        fontSize: f.fontSize,
                        fontStyle: f.fontStyle,
                        fontWeight: f.fontWeight,
                        fontFamily: f.fontFamily,
                        textTransform: f.textTransform,
                        letterSpacing: f.letterSpacing
                    })
                }
                this.setText(d, a);
                c = this.getWidth(d)
            } catch (g) {
                e.error(g)
            } finally {
                d && this.removeChild(d)
            }
            return c
        };
        this.getPrefixedStyle = function(a, b) {
            b = e.String.toCamelCase(b);
            var c = p,
                d = q[b],
                f = a.style;
            if (d) return f[d];
            for (var g = 0, h = c.length; g < h; g++)
                if (c[g].length && (b = b.charAt(0).toUpperCase() + b.substr(1)), d = c[g] + b, d in f) return c[g] && (p = ["", c[g]]), q[b] = d, f[d];
            return null
        };
        this.setPrefixedStyle = function(a, b, c) {
            b = e.String.toCamelCase(b);
            var d = p,
                f = q[b];
            a = a.style;
            if (f) return a[f] = c, !0;
            for (var g = 0, h = d.length; g < h; g++)
                if (d[g].length && (b = b.charAt(0).toUpperCase() + b.substr(1)), f = d[g] + b, f in a) return d[g] && (p = ["", d[g]]), q[b] = f, a[f] = c, !0;
            return !1
        };
        this.create = function(a, b, c, d) {
            c = (d || a && a.ownerDocument || document).createElement(c ||
                "div");
            b && this.set(c, b);
            a && a.appendChild(c);
            return c
        };
        this.getActualHeight = function(a, b) {
            var c = this.getStyle(a, "position"),
                d = this.getStyle(a, "visibility"),
                e = this.getStyle(a, "display");
            "none" === e && ("relative" !== c && "absolute" != c) && this.setStyles(a, {
                position: "absolute",
                display: "block",
                visibility: "hidden"
            });
            var g = /.*px$/,
                h = b ? a.scrollHeight : a.offsetHeight,
                l = this.getStyle(a, "paddingTop"),
                k = this.getStyle(a, "paddingBottom");
            if (!g.exec(l) || !g.exec(k)) return h;
            l = l.substring(0, l.length - 2);
            k = k.substring(0, k.length -
                2);
            this.setStyles(a, {
                position: c,
                visibility: d,
                display: e
            });
            return h - l - k
        };
        this.onReady = function() {
            function a() {
                try {
                    h.document.documentElement.doScroll("left"), b()
                } catch (c) {
                    h.setTimeout(a, 13)
                }
            }

            function b() {
                c || (h.document.body ? (c = !0, l(!1, h.document, "DOMContentLoaded", b, !1), l(!1, h.document, "readystatechange", b, !0), l(!1, h, "load", b), n(d)) : h.setTimeout(b, 13))
            }
            var c = !1,
                d = [];
            (function() {
                if (h.document && "complete" === h.document.readyState) b();
                else {
                    l(!0, h.document, "DOMContentLoaded", b, !1);
                    l(!0, h.document, "readystatechange",
                        b, !0);
                    l(!0, h, "load", b);
                    var c = e.userAgent.isIE && (e.userAgent.isIE6 || e.userAgent.isIE7 || e.userAgent.isIE8),
                        d = m(function() {
                            return h === h.top
                        }) || !1,
                        k = h.document && h.document.documentElement && h.document.documentElement.doScroll;
                    c && (d && k) && a()
                }
            })();
            return function(a) {
                if (c) return this.onReady = m, m(a);
                d.push(a)
            }
        }();
        this.onload = function() {
            function a() {
                b = !0;
                l(!1, h, "load", a);
                n(c)
            }
            var b = !1,
                c = [];
            l(!0, h, "load", a);
            return function(a) {
                if (b) return this.onload = m, m(a);
                c.push(a)
            }
        }();
        this.contains = function(a, b) {
            if (!a || !b) return !1;
            e.assert(this.isNode(a), "Sfdc.Dom.contains: 'container' must be a valid node.");
            e.assert(this.isNode(b), "Sfdc.Dom.contains: 'target' must be a valid node.");
            for (var c = b.parentNode; c;) {
                if (c === a) return !0;
                c = c.parentNode
            }
            return !1
        }
    }(n, r))
})(Sfdc, this);
(function(a, v) {
    a.provide("Sfdc.DragDrop.MouseOffset", {
        BottomLeft: "bottomleft",
        BottomRight: "bottomright",
        Center: "center",
        Preserve: "preserve",
        TopLeft: "topleft",
        TopRight: "topright"
    });
    a.provide("Sfdc.DragDrop.Draggable", {
        $implements: a.IDisposable,
        $constructor: function(l) {
            function m() {
                h.remove(v, "mousemove", A);
                h.remove(v, "mouseup", x);
                d && (a.Dom.setStyle(d, "position", B), d !== c && a.Dom.removeChild(d));
                a.DragDrop.activeDrag = d = null
            }

            function n(b) {
                return {
                    height: a.Dom.getHeight(b),
                    width: a.Dom.getWidth(b)
                }
            }

            function g(b) {
                var e =
                    a.DragDrop.MouseOffset;
                switch (s.offset) {
                    case e.BottomLeft:
                        return {
                            x: 0,
                            y: c.offsetHeight
                        };
                    case e.BottomRight:
                        return {
                            x: c.offsetWidth,
                            y: c.offsetHeight
                        };
                    case e.Center:
                        return {
                            x: c.offsetWidth / 2,
                            y: c.offsetHeight / 2
                        };
                    case e.TopLeft:
                        return {
                            x: 0,
                            y: 0
                        };
                    case e.TopRight:
                        return {
                            x: c.offsetWidth,
                            y: 0
                        };
                    default:
                        e = a.Event.getMouseX(b);
                        b = a.Event.getMouseY(b);
                        var q = a.Dom.getElementXY(c);
                        return {
                            x: e - q.x,
                            y: b - q.y
                        }
                }
            }

            function k(b) {
                a.Dom.setStyles(d, {
                    position: "absolute",
                    left: Math.round(b.x) + "px",
                    top: Math.round(b.y) + "px"
                })
            }

            function C(b,
                e) {
                d && m();
                var q = {
                    event: e || null,
                    target: p,
                    cancel: !1
                };
                p.notify("ondragstart", q);
                if (!q.cancel) {
                    q = a.Data.get(b, "Sfdc.DragDrop.Draggable");
                    if (s.ghost) {
                        d = b.cloneNode(!0);
                        a.Dom.addClass(d, "zen-draggable zen-visualization");
                        d.removeAttribute("data-uidsfdc");
                        for (var f = b, c = {
                                x: 0,
                                y: 0
                            }, g = f && f.ownerDocument.body, l = !1; f && f != g;) "static" != a.Dom.getStyle(f, "position") && (l = !0), l && (c.x += f.offsetLeft, c.y += f.offsetTop), f = f.offsetParent;
                        t = c;
                        f = a.Dom.getElementXY(b);
                        f.x -= t.x;
                        f.y -= t.y;
                        k(f);
                        b.parentNode.appendChild(d);
                        a.Dom.setStyles(d, {
                            opacity: ".8",
                            "z-index": 999999,
                            width: ""
                        })
                    } else d = b;
                    B = a.Dom.getStyle(b, "position");
                    u = n(d);
                    h.add(v, "mousemove", A);
                    h.add(v, "mouseup", x);
                    a.DragDrop.activeDrag = q
                }
            }

            function A(b) {
                b = h.getEvent(b);
                var e;
                e = b.pageX || b.clientX + document.body.scrollLeft;
                var c = b.pageY || b.clientY + document.body.scrollTop,
                    f = e - t.x - r.x,
                    d = c - t.y - r.y,
                    g = y;
                g && (e - r.x < g.left ? f = g.left : e - r.x + u.width > g.right && (f = g.right - u.width), c - r.y < g.top ? d = g.top : c - r.y + u.height > g.bottom && (d = g.bottom - u.height));
                e = {
                    x: f,
                    y: d
                };
                p.notify("ondrag", {
                    event: b,
                    target: p,
                    position: e
                });
                c = h.getEventTarget(b);
                b = p;
                do(f = a.Data.get(c, "Sfdc.DragDrop.Droppable")) && f.notify("ondrag", {
                    event: event,
                    target: b,
                    position: e
                }), c = a.Dom.getParent(c); while (a.Dom.isElement(c));
                k(e)
            }

            function x(b) {
                clearTimeout(z);
                m();
                p.notify("ondrop", {
                    event: b,
                    target: p
                })
            }
            var t = {
                    x: 0,
                    y: 0
                },
                y = null,
                p = this,
                c = l.target,
                r = {
                    x: 0,
                    y: 0
                },
                h = new a.Event.EventManager("ondragstart", "ondrag", "ondrop"),
                d = null,
                u = {
                    width: 0,
                    height: 0
                },
                B = "",
                s = {
                    ghost: !1 === l.ghost ? !1 : !0,
                    containment: l.containment || null,
                    delay: l.delay || 0,
                    offset: l.offset ||
                        a.DragDrop.MouseOffset.Preserve
                },
                z = null,
                w;
            if (!l.handle || !(w = a.select(l.handle, c)[0])) w = c;
            a.Data.set(c, "Sfdc.DragDrop.Draggable", this);
            h.add(w, "mousedown", function(b) {
                if (0 == b.button) {
                    h.preventDefault(b);
                    r = g(b);
                    var e = s.containment;
                    if (e) {
                        var d = a.Dom.getElementXY(e),
                            e = n(e);
                        y = {
                            left: d.x,
                            top: d.y,
                            right: d.x + e.width,
                            bottom: d.y + e.height
                        }
                    } else y = null;
                    s.delay ? (clearTimeout(z), z = setTimeout(C.bind(c, c), parseInt(s.delay, 10))) : C(c, b)
                }
            });
            h.add(w, "mouseup", x);
            this.dispose = function() {
                h && h.dispose();
                p = c = h = d = null
            };
            this.attach =
                function(b, a) {
                    h.add(this, b, a)
                };
            this.detach = function(b, a) {
                h.remove(this, b, delegate)
            };
            this.notify = function(b, a) {
                h.fireEvent(this, b, {
                    data: a
                })
            };
            this.getElement = function() {
                return c
            };
            this.getVisualization = function() {
                return d
            }
        }
    });
    a.provide("Sfdc.DragDrop.Droppable", {
        $implements: a.IDisposable,
        $constructor: function(l) {
            var m = new a.Event.EventManager("ondrag", "ondragout", "ondrop"),
                n = l.target;
            a.Data.set(n, "Sfdc.DragDrop.Droppable", this);
            m.add(n, "mouseup", function(g) {
                var k = a.DragDrop.activeDrag;
                k && this.notify("ondrop", {
                    event: g,
                    target: k
                })
            }, this);
            m.add(n, "mouseout", function(g) {
                var k = a.DragDrop.activeDrag;
                k && this.notify("ondragout", {
                    event: g,
                    target: k
                })
            }, this);
            this.dispose = function() {
                m && m.dispose();
                m = n = null
            };
            this.attach = function(a, k) {
                m.add(this, a, k)
            };
            this.detach = function(a, k) {
                m.remove(this, a, delegate)
            };
            this.notify = function(a, k) {
                m.fireEvent(this, a, {
                    data: k
                })
            };
            this.getElement = function() {
                return n
            }
        }
    })
})(Sfdc, this);
(function(a) {
    a.provide("Sfdc.Effects", {
        fadeIn: function(b, d) {
            var c = a.Dom.isVisible(b) ? a.Dom.getStyle(b, "opacity") : 0;
            a.Animation.opacity(b, c, 1, {
                onComplete: d || a.Function.blank(),
                duration: 500,
                tryCSS: !0
            })
        },
        fadeOut: function(b, d) {
            var c = a.Dom.getStyle(b, "opacity");
            a.Animation.opacity(b, c, 0, {
                onComplete: d || a.Function.blank(),
                duration: 500,
                tryCSS: !0
            })
        },
        rollIn: function(b, d, c) {
            var e = a.Dom.getActualHeight(b) + "px";
            c = c && c.duration || 500;
            a.Dom.setStyle(b, "height", "1px");
            a.Dom.show(b);
            a.Animation.css(b, "height", "1px",
                e, {
                    onComplete: d || a.Function.blank(),
                    duration: c,
                    timing: a.Animation.Easing.Linear
                })
        },
        rollOut: function(b, d) {
            var c = a.Dom.getActualHeight(b) + "px";
            a.Dom.show(b);
            a.Animation.css(b, "height", c, "1px", {
                onComplete: function() {
                    a.Dom.hideByVisibility(b);
                    a.Dom.hideByDisplay(b);
                    a.Dom.setStyle(b, "height", "");
                    a.isFunction(d) && d()
                },
                duration: 500,
                timing: a.Animation.Easing.EaseIn
            })
        },
        rollInRollOut: function(b, d, c) {
            a.Effects.rollIn(b, function() {
                setTimeout(function() {
                    a.Effects.rollOut(b, c)
                }, d)
            })
        }
    })
})(Sfdc);
(function(d, l) {
    function n() {
        function n(a, c, b, e) {
            var f = d.Data.get(a, c) || {};
            f[d.getUID(b)] = e ? r(b, e) : b;
            d.Data.set(a, c, f)
        }

        function p(a, c, b, e, f) {
            var g = {
                element: a,
                eventName: c,
                handler: e ? r(b, e) : b,
                originalHandler: b,
                useCapture: f || !1
            };
            f = d.getUID(a);
            h[f] || (h[f] = []);
            h[f].push(g);
            a.addEventListener ? g.element.addEventListener(g.eventName, g.handler, g.useCapture) : a.attachEvent ? (b = g.handler, g.handler = function(c) {
                    b.call(e || a, d.apply(c || l.event, {
                        currentTarget: g.element
                    }, !0))
                }, g.element.attachEvent("on" + g.eventName, g.handler)) :
                n(a, c, b, e)
        }

        function s(a, c, b, e, f) {
            var g = d.Data.get(a, c);
            c = {
                eventName: c,
                target: a
            };
            if (g)
                for (var h in g)
                    if (g.hasOwnProperty(h) && d.isFunction(g[h])) try {
                        g[h].apply(b.context || a, [c].concat(b.data || []))
                    } catch (k) {
                        if (d.isFunction(f) && f(k), e) throw k;
                    }
                    return !0
        }

        function r(a, c) {
            return function() {
                a.apply(c, arguments)
            }
        }

        function t(a) {
            var c = null,
                b;
            for (b in h)
                if (h.hasOwnProperty(b))
                    for (c = h[b]; c.length;) try {
                        q(c.shift())
                    } catch (e) {
                        d.log(e.message || e.description)
                    }
                if (k)
                    for (var f in k)
                        if (k.hasOwnProperty(f)) try {
                            k[f](a), k[f] =
                                null
                        } catch (g) {
                            d.log(g.message || g.description)
                        }
                        k = null;
            h = {}
        }

        function u(a, c, b) {
            a = d.Data.get(a, c);
            b = d.getUID(b);
            a && a[b] && (a[b] = null, delete a[b])
        }

        function q(a) {
            var c = d.getUID(a.element);
            if (h.hasOwnProperty(c)) {
                for (var b = h[c], e = null, f = 0; f < b.length; f++) {
                    e = b[f];
                    if (e === a) {
                        b.splice(f, 1);
                        break
                    }
                    if (e.element === a.element && e.eventName === a.eventName && e.handler === a.handler && e.useCapture === a.useCapture) {
                        e.element = null;
                        b.splice(f, 1);
                        break
                    }
                }
                b.length || (h[c] = null, delete h[c])
            }
            a.element.removeEventListener ? a.element.removeEventListener(a.eventName,
                a.handler, a.useCapture) : a.element.detachEvent ? a.element.detachEvent("on" + a.eventName, a.handler) : u(a.element, a.eventName, a.handler);
            a.element = null
        }
        var m = d.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments, 0),
            h = {},
            k = null;
        this.haltOnError = d.isDebug;
        this.onError = null;
        this.getMouseX = function(a) {
            a = this.getEvent(a);
            return a.pageX ? a.pageX : d.Window.getScrollX() + a.clientX
        };
        this.getMouseY = function(a) {
            a = this.getEvent(a);
            return a.pageY ? a.pageY : d.Window.getScrollY() + a.clientY
        };
        this.getSrcElement =
            function(a) {
                a = this.getEvent(a);
                return !a ? null : a.currentTarget || a.srcElement
            };
        this.addExpectedEvent = function(a) {
            0 > d.Array.indexOf(m, a) && m.push(a)
        };
        this.getExpectedEvents = function() {
            return m.slice(0)
        };
        this.getEvent = function(a) {
            return a || l.event
        };
        this.getEventTarget = function(a, c) {
            a = this.getEvent(a);
            if (!a) return null;
            var b = a.target || a.srcElement;
            return !c || Sizzle.matches(c, [b]).length ? b : d.Dom.getParent(b, c)
        };
        this.getEventToElement = function(a) {
            a = this.getEvent(a);
            return a.relatedTarget ? a.relatedTarget : a.toElement
        };
        this.isCustomEvent = function(a) {
            return -1 < d.Array.indexOf(m, a) || -1 !== a.indexOf(":")
        };
        this.isKeyAction = function(a, c) {
            a = this.getEvent(a);
            var b = a.which || a.keyCode;
            if (d.isArray(c)) {
                for (var e = 0, f = c.length; e < f; e++)
                    if (b === c[e]) return !0;
                return !1
            }
            return b === c
        };
        this.stop = function(a) {
            a = this.getEvent(a);
            d.assert(a, "No event object was passed to stop().");
            this.preventDefault(a);
            this.stopPropagation(a)
        };
        this.stopPropagation = function(a) {
            a = this.getEvent(a);
            d.assert(a, "No event object was passed to stopPropagation().");
            a.cancelBubble = !0;
            a.stopPropagation && a.stopPropagation()
        };
        this.preventDefault = function(a) {
            a = this.getEvent(a);
            d.assert(a, "No event object was passed to preventDefault().");
            a.preventDefault ? a.preventDefault() : a.returnValue = !1
        };
        this.fireEvent = function(a, c, b) {
            b || (b = {});
            if (this.isCustomEvent(c)) return s(a, c, b, this.haltOnError, this.onError);
            try {
                var e;
                if (l.document.createEvent && a.dispatchEvent) {
                    var f = l.document.createEvent("HTMLEvents");
                    f.initEvent(c, !0, !0);
                    e = a.dispatchEvent(f)
                } else e = l.document.createEventObject &&
                    a.fireEvent ? a.fireEvent("on" + c, l.document.createEventObject()) : s(a, c, b, !0);
                return e
            } catch (g) {
                if (d.isFunction(this.onError)) this.onError(g);
                if (this.haltOnError) throw g;
            }
        };
        this.add = function(a, c, b, e, f) {
            d.assert(a, "Sfdc.Event.add(): 'element' must be a valid Object or Node.");
            d.assert(c, "Sfdc.Event.add(): 'eventName' must be a valid String.");
            if (this.isCustomEvent(c)) {
                if (m.length && 0 > d.Array.indexOf(m, c)) throw Error(d.String.format("Sfdc.Event.EventManager.add(): unknown 'eventName' '{0}'. The following events are supported: '{1}'", [c, m.join("', '")]));
                return n(a, c, b, e)
            }
            k || (p(l, "unload", t), k = {});
            a == l && "unload" == c.toLowerCase() ? (a = d.getUID(b), k.hasOwnProperty(a) || (k[a] = e ? r(b, e) : b)) : p(a, c, b, e, f)
        };
        this.remove = function(a, c, b, e) {
            d.assert(a, "Sfdc.Event.remove(): 'element' must be a valid Object or Node.");
            d.assert(c, "Sfdc.Event.remove(): 'eventName' must be a valid String.");
            if (this.isCustomEvent(c)) return u(a, c, b);
            if (a == l && "unload" == c.toLowerCase()) a = d.getUID(b), k && k.hasOwnProperty(a) && (k[a] = null, delete k[a]);
            else {
                var f = d.getUID(a);
                if (h.hasOwnProperty(f))
                    for (var f = h[f], g = null, m = 0; m < f.length; m++)
                        if (g = f[m], g.element === a && g.eventName === c && g.originalHandler === b && g.useCapture === !!e) {
                            q(g);
                            return
                        }
                q({
                    element: a,
                    eventName: c,
                    handler: b,
                    useCapture: e || !1
                })
            }
        };
        this.removeAll = function(a, c) {
            d.assert(a && a.nodeType, "Sfdc.Event.removeAll(): 'element' must be a valid Object or Node.");
            if (1 == a.nodeType) {
                void 0 == c && (c = !0);
                var b = d.getUID(a);
                if (h.hasOwnProperty(b)) {
                    for (; h[b] && h[b].length;) try {
                        q(h[b].shift())
                    } catch (e) {
                        d.log(e.message || e.description)
                    }
                    h[b] =
                        null;
                    delete h[b]
                }
                if (c && (a === l && (a = l.document), a.hasChildNodes()))
                    for (var b = a.childNodes, f = 0, g = b.length; f < g; f++) 1 == b[f].nodeType && this.removeAll(b[f], c)
            }
        };
        this.mouseExited = function(a, c) {
            for (var b = this.getEventToElement(a); b && b != l.document.body;) {
                if (b == c) return !1;
                b = b.parentNode
            }
            return !0
        };
        this.dispose = function() {
            t()
        };
        this.keyCode = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            PAGEDOWN: 33,
            PAGEUP: 34,
            ARROW_L: 37,
            ARROW_U: 38,
            ARROW_R: 39,
            ARROW_D: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            CAPSLOCK: 20,
            KEY_0: 48,
            KEY_1: 49,
            KEY_2: 50,
            KEY_3: 51,
            KEY_4: 52,
            KEY_5: 53,
            KEY_6: 54,
            KEY_7: 55,
            KEY_8: 56,
            KEY_9: 57,
            KEY_A: 65,
            KEY_B: 66,
            KEY_C: 67,
            KEY_D: 68,
            KEY_E: 69,
            KEY_F: 70,
            KEY_G: 71,
            KEY_H: 72,
            KEY_I: 73,
            KEY_J: 74,
            KEY_K: 75,
            KEY_L: 76,
            KEY_M: 77,
            KEY_N: 78,
            KEY_O: 79,
            KEY_P: 80,
            KEY_Q: 81,
            KEY_R: 82,
            KEY_S: 83,
            KEY_T: 84,
            KEY_U: 85,
            KEY_V: 86,
            KEY_W: 87,
            KEY_X: 88,
            KEY_Y: 89,
            KEY_Z: 90,
            WINDOWS_L: 91,
            WINDOWS_R: 92,
            SELECT: 93,
            NUMPAD_0: 96,
            NUMPAD_1: 97,
            NUMPAD_2: 98,
            NUMPAD_3: 99,
            NUMPAD_4: 100,
            NUMPAD_5: 101,
            NUMPAD_6: 102,
            NUMPAD_7: 103,
            NUMPAD_8: 104,
            NUMPAD_9: 105,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_PLUS: 107,
            NUMPAD_MINUS: 109,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            PAUSE: 19,
            END: 35,
            HOME: 36,
            INSERT: 45,
            DELETE: 46,
            NUMLOCK: 144,
            SCROLLLOCK: 145,
            SEMICOLON: d.userAgent.isFirefox ? 59 : 186,
            EQUALS: 61,
            COMMA: 188,
            DASH: 109,
            PERIOD: 190,
            FORWARDSLASH: 191,
            GRAVE: 192,
            OPENBRACKET: 219,
            BACKSLASH: 220,
            CLOSEBRACKET: 221,
            APOSTROPHE: 222,
            PROCESS: 229
        };
        d.isDebug && (this.Debug = {
            getAllEvents: function() {
                return h
            }
        })
    }
    if (!d.resolve("Sfdc.Event")) {
        var p = new n;
        p.EventManager = n;
        d.provide("Sfdc.Event",
            p);
        d.define("Sfdc.Event.EventManager", function() {
            return n
        })
    }
})(Sfdc, this);
Sfdc.provide("Sfdc.Forms", {
    submitFormActionURL: function(a, b) {
        a.action = b;
        a.submit()
    },
    setElementsEnabledBasedOnCheckbox: function(a, b) {
        var c = document.getElementById(a);
        if (null !== c && null !== b)
            for (var d = 0; d < b.length; d++) {
                var f = c,
                    g = document.getElementById(b[d]);
                g && (g.style.display = f.checked ? "" : "none")
            }
    },
    borrowForm: function(a, b, c) {
        a = document.getElementById(a);
        var d = !0,
            f = a.action,
            g = a.target;
        null !== b && (a.action = b);
        null !== c && (a.target = c);
        a.onsubmit && !1 === a.onsubmit() && (d = !1);
        d && a.submit();
        a.action = f;
        a.target =
            g
    },
    formatPhone: function(a) {
        a.value = Sfdc.String.trim(a.value);
        var b = a.value,
            c = "",
            d = -1;
        if (0 < b.length && "+" != b.charAt(0)) {
            var f = 0;
            "1" == b.charAt(0) && (b = b.substring(1, b.length));
            for (var g = 0; g < b.length; g++) {
                var e = b.charAt(g);
                "0" <= e && "9" >= e && (0 === f ? c += "(" : 3 == f ? c += ") " : 6 == f && (c += "-"), c += e, f++);
                if (!("0" <= e && "9" >= e) && " " != e && "-" != e && "." != e && "(" != e && ")" != e) {
                    d = g;
                    break
                }
            }
            0 <= d && (c += " " + b.substring(d, b.length));
            10 == f && 40 >= c.length && (a.value = c)
        }
        return !0
    }
});
Sfdc.provide("Sfdc.Function", function(c) {
    function f() {}
    return {
        blank: function() {
            return f
        },
        wrap: function(a, b, d, g) {
            c.assert(a, "Specify an object to operate on.");
            c.assert(c.isFunction(d), "Must wrap with another function.");
            var e = a[b];
            e && c.isFunction(e) ? a[b] = function(a, b) {
                return g ? function() {
                    var c = a.apply(b, arguments);
                    d.apply(b, arguments);
                    return c
                } : function() {
                    d.apply(b, arguments);
                    return a.apply(b, arguments)
                }
            }(e, a) : a[b] = d
        },
        delay: function(a, b, d, c) {
            c = c || [];
            d = d || window;
            return {
                timeoutId: setTimeout(function() {
                    a.apply(d,
                        c)
                }, b),
                cancel: function() {
                    clearTimeout(this.timeoutId)
                }
            }
        },
        delayCallback: function(a, b, d) {
            return function() {
                c.Function.delay(a, b, d, arguments)
            }
        },
        bind: function(a, b, d) {
            c.assert(c.isFunction(a) && b, "A function must be provided for it to be bound to a context.");
            d = d || [];
            return Function.prototype.bind ? a.bind.apply(a, [b].concat(d)) : function() {
                return a.apply(b || window, d.concat(c.Array.toArray(arguments)))
            }
        },
        getName: function(a) {
            if (!c.isFunction(a)) throw Error("Sfdc.Function.getName: 'method' must be a valid Function pointer.");
            var b = null;
            c.String.trim(a.toString()).match(/\bfunction\s?([^(]*)\(/) && (b = c.String.trim(RegExp.$1));
            return b || "[anonymous]"
        },
        getParameters: function(a) {
            if (!c.isFunction(a)) throw Error("Sfdc.Function.getParameters: 'method' must be a valid Function pointer.");
            a = a.toString();
            var b = a.indexOf("(") + 1;
            return a.substring(b, a.indexOf(")", b)).replace(/\s/g, "").split(",")
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.History", function(q) {
    function m(a, b) {
        var d, k;
        if (q.isArray(a)) {
            d = 0;
            for (k = a.length; d < k;) b(a[d++])
        } else
            for (d in a) a.hasOwnProperty(d) && b(d, a[d])
    }

    function u(a) {
        function b(a, f, h) {
            m(a, function(a) {
                a.cb.call(a.scope, f, h, a.data)
            })
        }

        function d(a) {
            return q.Url.getUrlParameters(a)
        }
        var k = [],
            c = null,
            g = null;
        this.updateState = function(a) {
            var b = [];
            null === g && (g = d(n.getState()));
            1 === arguments.length ? m(q.isObject(a) ? a : d(a), function(a, b) {
                g[a] = b
            }) : g[arguments[0]] = arguments[1];
            m(g, function(a, l) {
                l !== r &&
                    b.push(a + "\x3d" + encodeURIComponent(l))
            });
            n.setState(b.join("\x26"))
        };
        this.replaceState = function(a) {
            g = {};
            this.updateState(a)
        };
        this.handleState = function(a, f) {
            a = d(a);
            f = d(f);
            0 !== k.length && b(k, a, f);
            null !== c && m(a, function(a, l) {
                var d = f[a];
                l !== d && c[a] !== r && b(c[a], l, d)
            });
            g = a
        };
        this.addListener = function(a) {
            if ("string" === typeof a[0]) {
                var b = a[0],
                    d = a[1],
                    l = a[2];
                a = a[3];
                null === c && (c = {});
                c[b] || (c[b] = []);
                c[b].push({
                    cb: d,
                    data: l || null,
                    scope: a || null
                })
            } else "function" === typeof a[0] && k.push({
                cb: a[0],
                data: a[1] || null,
                scope: a[2] ||
                    null
            })
        };
        m(a, this.addListener)
    }
    var r, e, b = window,
        s = [],
        n, t = !1;
    n = function() {
        var a = null,
            e = null,
            d = !1,
            k = null,
            c, g = !0,
            m = function() {
                var f = document.createElement("iframe"),
                    c = document.createElement("p"),
                    l = function() {
                        var a = f.contentWindow.document.getElementById("hidden-state-field");
                        return null === a ? null : a.innerText
                    },
                    g = function(a) {
                        var b = f.contentWindow.document;
                        c.innerText = a;
                        b.open();
                        b.write('\x3chtml\x3e\x3cbody\x3e\x3cspan id\x3d"hidden-state-field"\x3e' + c.innerHTML + "\x3c/span\x3e\x3c/body\x3e\x3c/html\x3e");
                        b.close()
                    },
                    m = function() {
                        var c, e, p, h, n = f.contentWindow;
                        !n || !n.document ? setTimeout(m, 20) : (e = l(), c = b.location.hash, d && 0 === c.length ? g("#!/" + b.location.search.slice(1)) : g(c), setInterval(function() {
                            p = l();
                            h = b.location.hash;
                            if (e !== p && (e && "#" != e || p && "#" != p)) {
                                b.location.hash = p;
                                var d = p.slice(3),
                                    f = null !== e ? e.slice(3) : e;
                                k(d, f);
                                a();
                                e = c = p
                            } else if (h !== c && (c && "#" != c || h && "#" != h)) c = h, g(h)
                        }, 100))
                    };
                a = function() {
                    return l().slice(3)
                };
                e = function(a) {
                    g("#!/" + a);
                    window.location.hash = "#!/" + a
                };
                f.style.display = "none";
                document.body.appendChild(f);
                m()
            };
        return {
            setState: function(a) {
                e(a)
            },
            getState: function() {
                return a()
            },
            isBrowserSupported: function() {
                return g
            },
            init: function(f, h) {
                q.userAgent.isIE6 || (k = f, h.useQuery !== r && (d = h.useQuery), !("onhashchange" in window) || 8 > document.documentMode ? m(h) : (Boolean(b.history && b.history.pushState && h.usePushState) ? (a = function() {
                    return b.location.search.slice(1)
                }, e = function(a) {
                    b.history.pushState({}, "Sfdc.History", "?" + a);
                    b.onpopstate()
                }, b.onpopstate = function() {
                    var b = a();
                    k(b, c);
                    a();
                    c = a()
                }) : (a = function() {
                    var a = b.location.href.split("#")[1];
                    return a ? a.slice(2) : ""
                }, e = function(a) {
                    b.location.hash = "!/" + a
                }, b.onhashchange !== r || window.hasOwnProperty("onhashchange") ? ("" === a() && d && (b.location.hash = "!/" + b.location.search.slice(1)), b.onhashchange = function() {
                    var b = a();
                    k(b, c);
                    a();
                    c = a()
                }) : g = !1), c = a(), k(c, void 0), a()))
            }
        }
    }();
    return {
        onChange: function() {
            var a = arguments;
            e ? e.addListener(a) : s.push(a)
        },
        update: function() {
            e.updateState.apply(e, arguments)
        },
        replace: function(a) {
            e.replaceState(a)
        },
        isBrowserSupported: function() {
            return n.isBrowserSupported()
        },
        init: function(a) {
            a =
                a || {};
            a.window && (b = a.window);
            e = new u(s);
            n.init(e.handleState, a);
            this.init = function() {};
            t = !0
        },
        isInit: function() {
            return t
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.JSON", function(g) {
    function k(a, b, f) {
        if (g.isArray(a)) {
            for (var c = f || [], e = 0; e < a.length; e++) c.push(k(a[e], b));
            return c
        }
        if (g.isObject(a)) {
            c = a.serId;
            if (void 0 !== c) return a = a.value, e = g.isArray(a) ? [] : {}, b[c] = e, k(a, b, e);
            c = a.serRefId;
            if (void 0 !== c) return b[c];
            c = f || {};
            for (e in a) a.hasOwnProperty(e) && (c[e] = k(a[e], b));
            return c
        }
        return a
    }

    function m(a, b) {
        var f = null,
            c = !1;
        if ("string" !== typeof a || g.isEmpty(a)) return f;
        if ("undefined" !== typeof JSON && JSON.parse) try {
            f = JSON.parse(a), c = !0
        } catch (e) {}
        if (!c) try {
            f =
                q(a)
        } catch (d) {
            f = null
        }
        f && b && (f = k(f, {}));
        return f
    }
    var q = function() {
        var a, b, f = {
                '"': '"',
                "\\": "\\",
                "/": "/",
                b: "\b",
                f: "\f",
                n: "\n",
                r: "\r",
                t: "\t"
            },
            c, e = function(b) {
                throw {
                    name: "SyntaxError",
                    message: b,
                    at: a,
                    text: c
                };
            },
            d = function(p) {
                p && p !== b && e("Expected '" + p + "' instead of '" + b + "'");
                b = c.charAt(a);
                a += 1;
                return b
            },
            g = function() {
                var a;
                a = "";
                "-" === b && (a = "-", d("-"));
                for (;
                    "0" <= b && "9" >= b;) a += b, d();
                if ("." === b)
                    for (a += "."; d() && "0" <= b && "9" >= b;) a += b;
                if ("e" === b || "E" === b) {
                    a += b;
                    d();
                    if ("-" === b || "+" === b) a += b, d();
                    for (;
                        "0" <= b && "9" >=
                        b;) a += b, d()
                }
                a = +a;
                if (isFinite(a)) return a;
                e("Bad number")
            },
            k = function() {
                var a, c, l = "",
                    g;
                if ('"' === b)
                    for (; d();) {
                        if ('"' === b) return d(), l;
                        if ("\\" === b)
                            if (d(), "u" === b) {
                                for (c = g = 0; 4 > c; c += 1) {
                                    a = parseInt(d(), 16);
                                    if (!isFinite(a)) break;
                                    g = 16 * g + a
                                }
                                l += String.fromCharCode(g)
                            } else if ("string" === typeof f[b]) l += f[b];
                        else break;
                        else l += b
                    }
                e("Bad string")
            },
            h = function() {
                for (; b && " " >= b;) d()
            },
            m = function() {
                switch (b) {
                    case "t":
                        return d("t"), d("r"), d("u"), d("e"), !0;
                    case "f":
                        return d("f"), d("a"), d("l"), d("s"), d("e"), !1;
                    case "n":
                        return d("n"),
                            d("u"), d("l"), d("l"), null
                }
                e("Unexpected '" + b + "'")
            },
            n;
        n = function() {
            h();
            switch (b) {
                case "{":
                    var a;
                    a: {
                        var c = {};
                        if ("{" === b) {
                            d("{");
                            h();
                            if ("}" === b) {
                                d("}");
                                a = c;
                                break a
                            }
                            for (; b;) {
                                a = k();
                                h();
                                d(":");
                                Object.hasOwnProperty.call(c, a) && e('Duplicate key "' + a + '"');
                                c[a] = n();
                                h();
                                if ("}" === b) {
                                    d("}");
                                    a = c;
                                    break a
                                }
                                d(",");
                                h()
                            }
                        }
                        e("Bad object");a = void 0
                    }
                    return a;
                case "[":
                    a: {
                        a = [];
                        if ("[" === b) {
                            d("[");
                            h();
                            if ("]" === b) {
                                d("]");
                                break a
                            }
                            for (; b;) {
                                a.push(n());
                                h();
                                if ("]" === b) {
                                    d("]");
                                    break a
                                }
                                d(",");
                                h()
                            }
                        }
                        e("Bad array");a = void 0
                    }
                    return a;
                case '"':
                    return k();
                case "-":
                    return g();
                default:
                    return "0" <= b && "9" >= b ? g() : m()
            }
        };
        return function(d, f) {
            var g;
            c = d;
            a = 0;
            b = " ";
            g = n();
            h();
            b && e("Syntax error");
            return "function" === typeof f ? function r(a, b) {
                var c, d, e = a[b];
                if (e && "object" === typeof e)
                    for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = r(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                return f.call(a, b, e)
            }({
                "": g
            }, "") : g
        }
    }();
    return {
        parseSafe: function(a, b) {
            return m(a, b)
        },
        parse: function(a, b) {
            return m(a, b)
        },
        parseWithCSRF: function(a, b) {
            if (!g.isString(a)) return null;
            var f;
            a: {
                f = ["while(1);\n", "while(1);\n".replace("\n", "")];
                for (var c = 0, e = f.length; c < e; c++) {
                    var d = f[c];
                    if (0 === a.indexOf(d)) {
                        f = a.slice(d.length);
                        break a
                    }
                }
                g.assert(!1, "CSRF protect string not added to servlet response.");f = void 0
            }
            return m(f, b)
        },
        stringify: function(a, b, f) {
            if ("undefined" !== typeof JSON && JSON.stringify) {
                if (Array.prototype.toJSON) {
                    var c = Array.prototype,
                        e = c.toJSON;
                    delete c.toJSON;
                    var d = JSON.stringify(a, b, f);
                    c.toJSON = e;
                    return d
                }
                return JSON.stringify(a, b, f)
            }
            if (void 0 === a) return "";
            if (null === a) return "null";
            switch (a.constructor) {
                case String:
                    return '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\r|\n|\f/g, "\\n") + '"';
                case Array:
                    c = [];
                    for (e = 0; e < a.length; e++) c.push(arguments.callee(a[e]));
                    return "[" + c.join(",") + "]";
                case Object:
                    c = [];
                    for (e in a) a.hasOwnProperty(e) && c.push(arguments.callee(e) + ":" + arguments.callee(a[e]));
                    return "{" + c.join(",") + "}";
                default:
                    return a.toString()
            }
        }
    }
}(Sfdc));
(function(g) {
    g.provide("Sfdc.LocalStorage", function(k) {
        function f() {
            var a;
            try {
                a = k.localStorage
            } catch (b) {
                g.log("Can't access local storage: " + b), a = !1
            }
            a ? (l = q, e = new m(k.localStorage)) : k.document && k.document.body.addBehavior ? (l = r, e = new n(s, t, k.document)) : (l = u, e = new v);
            f = function() {}
        }

        function p(a, b) {
            g.log("Removing all local storage data with prefix: " + b);
            for (var d = a.keys(), c = 0; c < d.length; c++) 0 === d[c].indexOf(b) && (g.log("\tRemoving: " + d[c]), a.removeItem(d[c]))
        }

        function m(a) {
            this.ls = a
        }

        function v() {
            var a = {};
            this.clear = function() {
                a = {}
            };
            this.getItem = function(b) {
                return a[b]
            };
            this.keys = function(b) {
                return Object.keys(a)
            };
            this.length = function(a) {
                return this.keys().length
            };
            this.removeItem = function(b) {
                delete a[b]
            };
            this.setItem = function(b, d) {
                a[b] = d
            }
        }

        function n(a, b, d) {
            var c = d.createElement("span");
            c.id = a;
            c.addBehavior("#default#userData");
            d.body.appendChild(c);
            c.load(a);
            this.el = c;
            this.userDataPath = a;
            this.userDataName = b;
            try {
                this.data = g.JSON.parse(c.getAttribute(b)), this.data || (this.data = {})
            } catch (e) {
                this.data = {}
            }
        }
        var u = 0,
            q = 1,
            r = 3,
            e = {},
            l = 0,
            s = "sfdc_user_data",
            t = "user_data",
            h = {
                clear: function(a) {
                    f();
                    try {
                        e.clear(a)
                    } catch (b) {
                        return h.onError(b)
                    }
                },
                getItem: function(a) {
                    f();
                    try {
                        return e.getItem(a)
                    } catch (b) {
                        return h.onError(b)
                    }
                },
                keys: function() {
                    f();
                    try {
                        return e.keys()
                    } catch (a) {
                        return h.onError(a)
                    }
                },
                length: function() {
                    f();
                    return e.length()
                },
                removeItem: function(a) {
                    f();
                    try {
                        e.removeItem(a)
                    } catch (b) {
                        return h.onError(b)
                    }
                },
                setItem: function(a, b) {
                    f();
                    try {
                        e.setItem(a, b)
                    } catch (d) {
                        return h.onError(d)
                    }
                },
                getMode: function() {
                    f();
                    return l
                },
                onError: function(a) {
                    throw {
                        name: "StorageError",
                        message: a.message
                    };
                }
            };
        m.prototype = {
            clear: function(a) {
                a ? p(this, a) : this.ls.clear()
            },
            getItem: function(a) {
                return this.ls.getItem(a)
            },
            keys: function() {
                return Object.keys(this.ls)
            },
            length: function() {
                return this.ls.length
            },
            removeItem: function(a) {
                return this.ls.removeItem(a)
            },
            setItem: function(a, b) {
                return this.ls.setItem(a, b)
            }
        };
        n.prototype = {
            clear: function(a) {
                a ? p(this, a) : this.data = {};
                this.saveData()
            },
            getItem: function(a) {
                return this.data.hasOwnProperty(a) ?
                    this.data[a] : null
            },
            keys: function() {
                return Object.keys(this.data)
            },
            length: function() {
                var a = 0,
                    b;
                for (b in this.data) this.data.hasOwnProperty(b) && (a += 1);
                return a
            },
            removeItem: function(a) {
                delete this.data[a];
                this.saveData()
            },
            saveData: function() {
                var a = g.JSON.stringify(this.data);
                this.el.setAttribute(this.userDataName, a);
                this.el.save(this.userDataPath)
            },
            setItem: function(a, b) {
                this.data[a] = b;
                this.saveData()
            }
        };
        return h
    }(this))
})(Sfdc);
Sfdc.provide("Sfdc.Logging", function(g) {
    function l(a) {
        if (!k) {
            var b = g.Logging.LogLevel.GACK;
            try {
                var e = g.Logging.formatError(a);
                g.log(e.subject, b, e);
                g.logServer("WINDOWERROR", e, b)
            } catch (d) {}
        }
    }

    function m(a, b) {
        var e = {
                msg: 1,
                url: 1,
                message: 1,
                stack: 1
            },
            d;
        for (d in b)
            if (b.hasOwnProperty(d)) {
                var c = g.isFunction(b[d]),
                    f = a.hasOwnProperty(d),
                    h = e.hasOwnProperty(d);
                !c && (!f && !h) && (a[d] = b[d])
            }
    }
    var k = !1;
    return {
        startWindowErrorListener: function() {
            if (window.onerror && window.onerror.cache)
                for (var a = window.onerror.cache, b =
                        0, e = a.length; b < e; b++) l(a[b]);
            g.Function.wrap(window, "onerror", function(a, c, b) {
                l({
                    msg: a,
                    url: c,
                    lines: b
                })
            });
            g.Logging.startWindowErrorListener = function() {
                k = !1
            }
        },
        stopWindowErrorListener: function() {
            k = !0
        },
        formatError: function(a) {
            var b = {},
                e = "(" + window.location.pathname + ") ";
            if (g.isString(a.msg)) b.subject = e + a.msg, g.isDefAndNotNull(a.url) && (e = a.url.split("/").pop(), b.trace = this._createTraceLine("", "", e, a.lines)), m(b, a);
            else {
                var d = g.userAgent;
                try {
                    var c = a.message,
                        f = null;
                    if (d.isFirefox) f = this._parseFFError(a.stack.split("\n"));
                    else if (d.isChrome) f = this._parseChromeError(a.stack.split("\n"));
                    else if (d.isSafari) f = this._parseSafariError(a);
                    else
                        for (var f = [], h = arguments.callee.caller, d = {}; h;) {
                            if (!d[h]) {
                                f.push("Unable to trace caller past recursion entry point.");
                                break
                            }
                            var k = h.toString(),
                                l = k.substr(k.indexOf("function"), k.indexOf(")") + 1);
                            f.push(l);
                            d[h] = !0;
                            h = h.caller
                        }
                    b.subject = e + c;
                    m(b, a);
                    f && (b.trace = f.join("\\n"))
                } catch (n) {
                    a.message && (b.subject = e + a.message)
                }
            }
            return b
        },
        _parseFFError: function(a) {
            for (var b = [], e = a.length, d = 0; d < e; d++) {
                var c =
                    a[d];
                if (c) {
                    var f = c.substring(0, c.indexOf("@")),
                        c = c.split("/"),
                        c = c[c.length - 1],
                        c = c.split(":");
                    b.push(this._createTraceLine("", f, c[0], c[1]))
                }
            }
            return b
        },
        _parseChromeError: function(a) {
            for (var b = [], e = a.length, d = 0; d < e; d++) {
                var c = g.String.trim(a[d]);
                if (c && 0 === c.indexOf("at")) {
                    var f = ["", ""],
                        c = c.split(" ");
                    3 === c.length && (f = c[1].split("."));
                    c = c[3 === c.length ? 2 : 1].split("/");
                    c = c[c.length - 1].split(":");
                    b.push(this._createTraceLine(f[0], f[1], c[0], c[1]))
                }
            }
            return b
        },
        _parseSafariError: function(a) {
            var b = a.sourceURL.split("/");
            return this._createTraceLine("", "", b[b.length - 1], a.line)
        },
        _createTraceLine: function(a, b, e, d) {
            return [a, b, e, d].join(":")
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.Logging.LogLevel", {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
    GACK: "GACK"
});
Sfdc.provide("Sfdc.Resource", function(c) {
    function l(a, b) {
        c.Dom.create(null, {
            onload: b,
            onerror: b,
            src: a
        }, "IMG")
    }

    function m(a, b) {
        c.Dom.create(document.body, {
            width: 0,
            height: 0,
            onload: b,
            onerror: b,
            data: a,
            style: {
                position: "absolute",
                top: "-10000px"
            }
        }, "OBJECT")
    }
    var g, f = {};
    return {
        addCSS: function(a) {
            g || (g = document.head || document.getElementsByTagName("head")[0]);
            return c.Dom.create(g, {
                type: "text/css",
                href: a,
                rel: "stylesheet"
            }, "LINK")
        },
        addJavaScript: function(a, b, d) {
            function e() {
                this.onLoadDone = !0;
                b.call(this)
            }
            b = b ||
                c.Function.blank();
            d = d || document.body;
            return c.Dom.create(d, {
                type: "text/javascript",
                onLoadDone: !1,
                onreadystatechange: function() {
                    if (("complete" == this.readyState || "loaded" == this.readyState) && !this.onLoadDone) this.onLoadDone = !0, this.onreadystatechange = this.onload = null, b.call(this)
                },
                onload: e,
                onerror: e,
                src: a
            }, "script", d.ownerDocument)
        },
        addJavaScripts: function(a, b) {
            function d() {
                a.length ? c.Resource.addJavaScript(a.shift(), d) : b()
            }
            b = b || c.Function.blank();
            this.cacheScripts(a, d)
        },
        addInlineJavaScript: function(a) {
            c.Dom.create(document.body, {
                type: "text/javascript",
                text: a
            }, "script")
        },
        execScripts: function(a, b) {
            function d() {
                if (0 < a.length) {
                    var h = a.shift(),
                        e = h.src;
                    if (e) {
                        if (!f[e]) {
                            c.Resource.addJavaScript(e, d);
                            f[e] = !0;
                            return
                        }
                    } else c.Resource.addInlineJavaScript(h.text);
                    d()
                } else b()
            }
            a = c.Array.toArray(a);
            b = b || c.Function.blank();
            if (a.length) {
                var e = c.Array.map(a, function(a) {
                    return (a = a.src) ? void 0 !== f[a] && a : null
                });
                this.cacheScripts(e, d)
            } else b()
        },
        cacheScripts: function(a, b) {
            var d = 0,
                e = a.length,
                h = c.userAgent.isIE ? l : m;
            b = b || c.Function.blank();
            for (var g =
                    function() {
                        ++d === e && b()
                    }, f = 0, k; f < e; f++)(k = a[f]) ? h(k, g) : g()
        },
        getScriptsFromHtml: function(a) {
            return c.select("script", c.get(a))
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.String", function(d) {
    function n(a) {
        switch (a) {
            case "'":
                return "\x26#39;";
            case "\x26":
                return "\x26amp;";
            case "\x3c":
                return "\x26lt;";
            case "\x3e":
                return "\x26gt;";
            case '"':
                return "\x26quot;";
            case "\u00a9":
                return "\x26copy;";
            case "\u2028":
                return "\x3cbr\x3e";
            case "\u2029":
                return "\x3cp\x3e";
            default:
                return a
        }
    }
    return {
        capitalizationModes: {
            None: 0,
            CamelCase: 1,
            AfterControlCharacters: 2,
            RemoveControlCharacters: 4,
            ReplaceControlCharacters: 8,
            ReduceWordBody: 16
        },
        capitalize: function(a, b) {
            var c = this.capitalizationModes;
            d.isEmpty(b) && (b = c.None);
            var e = b & c.CamelCase,
                f = b & c.RemoveControlCharacters,
                g = b & c.ReplaceControlCharacters,
                h = b & c.ReduceWordBody;
            return (a || "").replace(b & c.AfterControlCharacters || f || g ? /(\s|(^[-_.]?)|[-_.])(\S)([^\s-_.]*)/g : /(\s|(^))(\S)(\S*)/g, function(a, b, c, d, m) {
                a = "" === b || c === b;
                f && " " !== b ? b = "" : g && "" !== b && (b = " ");
                d = e && a ? d.toLowerCase() : d.toUpperCase();
                h && (m = m.toLowerCase());
                return b + d + m
            })
        },
        ltrim: function(a) {
            return a && a.replace(/^[\s\u0000-\u0020]*/, "") || ""
        },
        rtrim: function(a) {
            return a && a.replace(/[\s\u0000-\u0020]*$/,
                "") || ""
        },
        trim: function(a) {
            return a && a.replace(/^[\s\u0000-\u0020]*|[\s\u0000-\u0020]*$/g, "") || ""
        },
        dashify: function(a) {
            return a.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
        },
        decryptXOR: function(a, b) {
            d.assert(d.isDefAndNotNull(b), "Key cannot be undefined or null");
            b = this.base64Decode(b, !1);
            for (var c = this.base64Decode(a, !1), e = [], f, g = 0, h = c.length; g < h; g++) f = decodeURIComponent(String.fromCharCode(c.charCodeAt(g) ^ (b.charCodeAt(g) || 0))), e.push(f);
            return e.join("")
        },
        toCamelCase: function(a) {
            a = a.replace(/^-/g,
                "").split("-");
            for (var b = 1, c = a.length, e; b < c; b++) e = a[b], a[b] = e.charAt(0).toUpperCase() + e.substr(1);
            return a.join("")
        },
        getIntValue: function(a, b) {
            if (0 === b) throw Error("Radix not equal to 0 must be supplied");
            var c = parseInt(a, b || 10);
            return isNaN(c) ? 0 : c
        },
        format: function(a, b) {
            return a.replace(/{([^{}]*)}/g, function(a, e) {
                var f = !b.hasOwnProperty(e) && -1 < e.indexOf(".") ? d.resolve(e, b) : b[e];
                return "string" === typeof f || "number" === typeof f ? f : a
            })
        },
        escapeToUTF8: function(a) {
            for (var b = "", c = 0; c < a.length;) {
                var e = a.charCodeAt(c++),
                    d;
                if (128 > e) b += String.fromCharCode(e);
                else if (191 < e && 224 > e) d = a.charCodeAt(c++), b += String.fromCharCode((e & 31) << 6 | d & 63);
                else {
                    d = a.charCodeAt(c++);
                    var g = a.charCodeAt(c++),
                        b = b + String.fromCharCode((e & 15) << 12 | (d & 63) << 6 | g & 63)
                }
            }
            return b
        },
        base64Decode: function(a, b) {
            var c = [],
                e, f, g = "",
                h, l = "",
                k = 0;
            a = a.replace(/[^A-Za-z0-9+/=]/g, "");
            do e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(k++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(k++)),
                h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(k++)), l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(a.charAt(k++)), e = e << 2 | f >> 4, f = (f & 15) << 4 | h >> 2, g = (h & 3) << 6 | l, c.push(String.fromCharCode(e)), 64 != h && c.push(String.fromCharCode(f)), 64 != l && c.push(String.fromCharCode(g)); while (k < a.length);
            return void 0 === b || b ? d.String.escapeToUTF8(c.join("")) : c.join("")
        },
        escapeToHtml: function(a, b) {
            if (null == a || "" === a) return "";
            d.assert(a && d.isString(a),
                "Expected escapeToHtml(String input, Boolean escapeNewline)");
            d.assert(d.isBoolean(b || !1), "Expected escapeToHtml(String input, Boolean escapeNewline)");
            if (d.isEmpty(a)) return a;
            var c = a.replace(/[&<>"'\u00a9\u2028\u2029]/g, n);
            b && (c = c.replace(/\n/g, "\x3cbr\x3e"));
            return c
        },
        unescapeHtml: function(a, b) {
            if (null === a) return "";
            d.assert(d.isDefAndNotNull(a) && d.isString(a), "expected unescapeHtml(string input, boolean replaceBRwithNewline)");
            d.assert(d.isBoolean(b || !1), "expected unescapeHtml(string input, boolean replaceBRwithNewline)");
            if (d.isEmpty(a)) return a;
            var c = a.replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&copy;/g, "\u00a9").replace(/&amp;/g, "\x26");
            b && (c = c.replace(/<br>/g, "\n").replace(/<br\/>/g, "\n"));
            return c
        }
    }
}(Sfdc));
(function(a, e) {
    var d = e.Mustache;
    a.provide("Sfdc.Template", {
        compile: function(b, c) {
            return d.compile(b, c)
        },
        render: function(b, c, a) {
            return d.render(b, c, a)
        }
    })
})(Sfdc, this);
Sfdc.provide("Sfdc.Units.HexColor", {
    $constructor: function(a) {
        Sfdc.assert(Sfdc.isString(a) || Sfdc.isObject(a), "Must specify a color parameter");
        this.val = a
    },
    toString: function() {
        return this.val
    },
    toRGB: function() {
        var a = this.toInt();
        return Sfdc.Units.RGBColor.fromInt(a)
    },
    toInt: function() {
        return Sfdc.Units.HexColor.toInt(this.val)
    }
});
Sfdc.apply(Sfdc.Units.HexColor, {
    fromInt: function(a) {
        if (!Sfdc.isObject(a) || Sfdc.isString(a)) throw Error("Requires rgb object as input - { r: 0, g: 0, b: 0 }");
        a = "#" + [(16 > Math.round(a.r) ? "0" : "") + Math.round(a.r).toString(16), (16 > Math.round(a.g) ? "0" : "") + Math.round(a.g).toString(16), (16 > Math.round(a.b) ? "0" : "") + Math.round(a.b).toString(16)].join("");
        return new Sfdc.Units.HexColor(a)
    },
    toInt: function(a) {
        if (Sfdc.isObject(a) || -1 < a.indexOf("rgb")) throw Error("Requires hex color as input - {String} #fffff");
        var b, c, d;
        4 == a.length && (b = a.substr(1, 1), c = a.substr(2, 1), d = a.substr(3, 1), b = parseInt(b + b, 16), c = parseInt(c + c, 16), d = parseInt(d + d, 16));
        7 == a.length && (b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16), d = parseInt(a.substr(5, 2), 16));
        return {
            r: b,
            g: c,
            b: d
        }
    },
    isHexColor: function(a) {
        return /^#?(([a-fA-F0-9]){3}){1,2}$/g.test(a)
    }
});
Sfdc.provide("Sfdc.Units.RGBColor", {
    $constructor: function(a) {
        Sfdc.assert(Sfdc.isString(a), "Must specify a color parameter as string.");
        this.val = a
    },
    toString: function() {
        return this.val.replace(/\s+/g, "")
    },
    toHex: function() {
        return Sfdc.Units.HexColor.fromInt(this.toInt())
    },
    toInt: function() {
        return Sfdc.Units.RGBColor.toInt(this.val)
    }
});
Sfdc.apply(Sfdc.Units.RGBColor, {
    fromInt: function(a) {
        if (!Sfdc.isObject || Sfdc.isString(a)) throw Error("Requires rgb object as input - { r: 0, g: 0, b: 0 }");
        a = Sfdc.String.format("rgb({r}, {g}, {b})", a);
        return new Sfdc.Units.RGBColor(a)
    },
    toInt: function(a) {
        if (-1 < a.indexOf("#")) throw Error("Requires RGB color as input - rgb(0, 0, 0)");
        a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return {
            r: a[1],
            g: a[2],
            b: a[3]
        }
    }
});
Sfdc.provide("Sfdc.Units.Pixel", {
    $constructor: function(a) {
        this.val = a
    },
    toString: function() {
        if (Sfdc.isNumber(this.val)) return this.val + "px";
        if (Sfdc.isString(this.val)) return this.val
    },
    toInt: function() {
        return Sfdc.Units.Pixel.toInt(this.val)
    },
    fromInt: function() {
        return Sfdc.Units.Pixel.fromInt(this.val)
    }
});
Sfdc.apply(Sfdc.Units.Pixel, {
    fromInt: function(a) {
        Sfdc.assert(!(Sfdc.isString(a) && -1 < a.indexOf("px")), "Parameter already formatted to 'px'");
        return new Sfdc.Units.Pixel(a + "px")
    },
    toInt: function(a) {
        Sfdc.assert(!Sfdc.isNumber(a), "Parameter already an int");
        return 1 * a.replace(/\D+$/gi, "")
    }
});
Sfdc.provide("Sfdc.Url", function(f) {
    function n() {
        m || (m = document.createElement("a"));
        return m
    }
    var m;
    return {
        getHash: function(a) {
            a = a || window;
            return a.location.hash.substring(1)
        },
        setHash: function(a, b) {
            if ("undefined" == typeof a || "" === a) return !1;
            b = b || window;
            b.location.hash = a;
            return !0
        },
        generateQueryString: function(a, b, d) {
            var h = [],
                c = {},
                k = null;
            d = f.apply(d || {}, {
                includeMark: !0,
                escape: encodeURIComponent,
                fullUrl: !1,
                allowMultipleOfParam: !1
            }, !1);
            var c = a.split("?"),
                g = c[0],
                c = 1 < c.length ? c[1] : "";
            if (!b) return d.fullUrl ?
                a : c;
            1 < c.length ? (a = c.split("#"), 1 < a.length && (c = a[0])) : (a = g.split("#"), 1 < a.length && (g = a[0]));
            c = this.getUrlParameters(c, d);
            if (d.allowMultipleOfParam)
                for (var e in b) c.hasOwnProperty(e) ? f.isArray(c[e]) ? c[e].push(b[e]) : c[e] = [c[e], b[e]] : c[e] = b[e];
            else c = f.apply(c, b, !0);
            for (var l in c)
                if (c.hasOwnProperty(l) && (k = c[l], f.isDefAndNotNull(k)))
                    if (d.allowMultipleOfParam && f.isArray(k)) {
                        b = 0;
                        for (e = k.length; b < e; b++) h.push(l + "\x3d" + d.escape(k[b]))
                    } else h.push(l + "\x3d" + d.escape(k));
            retval = d.fullUrl ? g + "?" : d.includeMark ?
                "?" : "";
            return 1 < a.length ? (a.shift(), retval + h.join("\x26") + "#" + a.join("#")) : retval + h.join("\x26")
        },
        generateUrl: function(a, b, d) {
            d = f.apply(d || {}, {
                fullUrl: !0
            }, !0);
            return this.generateQueryString(a, b, d)
        },
        getHostFromUrl: function(a) {
            if (!f.isString(a)) return "";
            var b = n();
            b.href = a;
            return (a = a.match(/:(\d+)/g)) ? (b.hostname || window.location.hostname) + a[0] : b.hostname || window.location.hostname
        },
        getUrlParameters: function(a, b) {
            if (!a) return {}; - 1 < a.indexOf("?") && (a = a.split("?")[1]);
            var d = {};
            b = f.apply(b || {}, {
                unescape: decodeURIComponent,
                allowMultipleOfParam: !1
            });
            for (var h = a.split("\x26"), c = 0, k = h.length, g = null, e; c < k; c++) f.isEmpty(h[c]) || (g = h[c].split("\x3d"), e = g[0], g = b.unescape(g[1]), b.allowMultipleOfParam && f.isDefAndNotNull(d[e]) ? f.isArray(d[e]) ? d[e].push(g) : d[e] = [d[e], g] : d[e] = g);
            return d
        },
        navigateTo: function(a, b) {
            b = b || window;
            /^#/.test(a) ? this.setHash(a, b) : b.navigateTo ? b.navigateTo(a) : b.location.href = a
        },
        resolveUrl: function(a) {
            return f.UserContext && f.UserContext.getUrl ? f.UserContext.getUrl(a) : a
        },
        stripDomainFromUrl: function(a) {
            if (!f.isString(a) ||
                !a.length) return "";
            var b = n();
            b.href = a;
            a = b.pathname;
            return !/^\//gi.test(a) ? "/" + a : a
        }
    }
}(Sfdc));
Sfdc.provide("Sfdc.Window", {
    getScrollX: function(a) {
        a = a || document;
        return a == document && window.pageXOffset ? window.pageXOffset : a.documentElement && a.documentElement.scrollLeft ? a.documentElement.scrollLeft : a.body.scrollLeft || 0
    },
    getScrollY: function(a) {
        a = a || document;
        return a == document && window.pageYOffset ? window.pageYOffset : a.documentElement && a.documentElement.scrollTop ? a.documentElement.scrollTop : a.body.scrollTop || 0
    },
    getWindowHeight: function() {
        if ("number" == typeof window.innerHeight) return window.innerHeight;
        if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        if (document.body && document.body.clientHeight) return document.body.clientHeight
    },
    getWindowWidth: function() {
        if ("number" == typeof window.innerWidth) return window.innerWidth;
        if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        if (document.body && document.body.clientWidth) return document.body.clientWidth
    }
});
(function(a) {
    a.provide("Sfdc.IDisposable", {
        dispose: function() {}
    })
})(Sfdc);
Sfdc.provide("Sfdc.IEquatable", {
    equals: function(a, b) {},
    getHashCode: function(a) {}
});
Sfdc.provide("Sfdc.IObservable", {
    attach: function(a, b) {},
    detach: function(a, b) {},
    notify: function(a, b) {}
});
(function(c) {
    c.provide("Sfdc.Class.Config", {
        setConfig: function(d) {
            var b = this.config = c.apply(this.config || {}, d || {}, !0);
            if (this.addEvent) {
                var e = /^on[A-Z]/,
                    a;
                for (a in b) d.hasOwnProperty(a) && (c.isFunction(b[a]) && e.test(a)) && (this.addEvent(a, b[a]), delete b[a])
            }
        }
    })
})(Sfdc);
(function(c) {
    c.provide("Sfdc.Class.Eventing", {
        addEvent: function(a, b, d) {
            return c.Event.add(this, ":" + a, b, d)
        },
        removeEvent: function(a, b) {
            return c.Event.remove(this, ":" + a, b)
        },
        fireEvent: function(a, b) {
            return c.Event.fireEvent(this, ":" + a, {
                data: [b]
            })
        }
    })
})(window.Sfdc);
(function(b) {
    b.resolve("Sfdc.ClientLogging") || (b.provide("Sfdc.ClientLogging", function(a) {
        var b = a.log(),
            c = [],
            k = b.length;
        a.log = function() {
            a.ClientLogging.log.apply(a.ClientLogging, arguments)
        };
        a.warn = function(b, f) {
            return a.log(b, a.Logging.LogLevel.WARNING, f)
        };
        a.error = function(b, f) {
            return a.log(b, a.Logging.LogLevel.ERROR, f)
        };
        a.Function.wrap(a, "sendGack", function(b, f, c) {
            return a.log(f, a.Logging.LogLevel.GACK, c)
        });
        return {
            log: function(a, f, d) {
                for (var h = 0, g = c.length, l; h < g; h++)
                    if (null !== (l = c[h])) l.__lastMsgNumber__++,
                        l.log(a, f, d);
                b.push({
                    msg: a,
                    level: f,
                    args: d
                });
                ++k;
                200 < b.length && (b = b.slice(0, 100))
            },
            addRelay: function(b, f) {
                a.assert(b && b.name, "A relay with a name property must be provided. ");
                for (var d = 0, e = c.length, g; d < e; d++)
                    if ((g = c[d]) && g.name === b.name) return !1;
                b.__lastMsgNumber__ = 0;
                c.push(b);
                f && this.flush(b);
                return !0
            },
            removeRelay: function(b) {
                for (var a = 0, d = c.length; a < d; a++) c[a] instanceof b && (c[a] = null)
            },
            flush: function(a) {
                for (var c = k - a.__lastMsgNumber__, d = 0, h = b.length, g; d < h && d < c; d++) g = b[d], a.log(g.msg, g.level, g.args);
                a.__lastMsgNumber__ = k
            }
        }
    }(b)), b.provide("Sfdc.ClientLogging.ConsoleLogger", {
        $constructor: function() {},
        name: "ConsoleLogger",
        log: function(a, e, c) {
            if (!window.console || !b.isDefAndNotNull(a)) return !1;
            switch (e) {
                case b.Logging.LogLevel.INFO:
                    window.console.log(a);
                    break;
                case b.Logging.LogLevel.WARNING:
                    window.console.warn(a);
                    break;
                case b.Logging.LogLevel.ERROR:
                    if (b.isDebug) throw a;
                    b.isString(a) ? window.console.error(a) : (e = b.Logging.formatError(a), e = b.String.format("Subject: {subject}\nTrace: {trace}\n", e), window.console.error(e,
                        a));
                    break;
                case b.Logging.LogLevel.GACK:
                    window.console.error(a);
                    break;
                default:
                    window.console.log(a)
            }
        }
    }), b.provide("Sfdc.ClientLogging.SeleniumLogger", {
        $constructor: function() {
            try {
                var a = top;
                this.enabled = a.LOG && b.isFunction(a.LOG.log)
            } catch (e) {
                this.enabled = !1
            }
        },
        enabled: !0,
        name: "SeleniumLogger",
        log: function(a, e, c) {
            if (!this.enabled || !b.isDefAndNotNull(a)) return !1;
            c = top;
            switch (e) {
                case b.Logging.LogLevel.INFO:
                    c.LOG.log("info", a);
                    break;
                case b.Logging.LogLevel.WARNING:
                    c.LOG.log("warning", a);
                    break;
                case b.Logging.LogLevel.ERROR:
                    c.LOG.log("error",
                        a);
                    break;
                case b.Logging.LogLevel.GACK:
                    c.LOG.log("error", a);
                    break;
                default:
                    c.LOG.log("info", a)
            }
        }
    }))
})(Sfdc);
Sfdc.provide("Sfdc.ServerLogging", function(a) {
    var e = null,
        f = [],
        h = {},
        c = {
            URL: "/_ui/common/request/servlet/JsLoggingServlet",
            LOG_NAME: "logName",
            LOG_LEVEL: "logLevel",
            LOG_ATTRS: "logAttrs",
            LOG_LINES: "logLines",
            MAX_BUFFER_SIZE: 100,
            FLUSH_SIZE: 100,
            FLUSH_INTERVAL: 1500,
            AUTO_FLUSH: !0
        };
    a.Function.wrap(a, "sendGack", function(b, c, f) {
        var d = Array.prototype.slice.call(arguments, 0);
        !1 == a.isDefAndNotNull(d[1]) ? a.warn("No error information was passed to Sfdc.sendGack()") : (d[1] = a.Logging.formatError(d[1]), d[2] = a.Logging.LogLevel.GACK,
            a.ServerLogging.log.apply(a.ServerLogging, d))
    });
    a.logServer = function(b, c, f) {
        a.ServerLogging.log.apply(a.ServerLogging, arguments)
    };
    return {
        log: function(b, g, e) {
            a.assert(b && g, "You must provide a relay key and a data object to log.");
            e = e || a.Logging.LogLevel.INFO;
            var d = this.getRelay(b);
            if (!d || !d.log(b, g, e)) d = {}, d[c.LOG_NAME] = b, d[c.LOG_LEVEL] = e, d[c.LOG_ATTRS] = g, f.push(d), f.length > c.MAX_BUFFER_SIZE && f.shift(), this.startFlushTimer()
        },
        getRelay: function(b) {
            return h[b]
        },
        addRelay: function(b, a) {
            h[b] = a
        },
        removeRelay: function(a) {
            delete h[a]
        },
        flush: function() {
            e && (clearTimeout(e), e = null);
            if (0 === f.length) return 0;
            var b = f.splice(0, c.FLUSH_SIZE),
                g = {};
            g[c.LOG_LINES] = a.JSON.stringify(b);
            a.Ajax.post(a.Url.resolveUrl(c.URL), null, {
                data: g,
                escape: encodeURIComponent
            });
            0 < f.length && this.startFlushTimer();
            return b.length
        },
        setConfig: function(b) {
            a.apply(c, b, !0)
        },
        startFlushTimer: function() {
            if (!e && c.AUTO_FLUSH)
                if (0 < c.FLUSH_INTERVAL) {
                    var a = this;
                    e = setTimeout(function() {
                        a.flush()
                    }, c.FLUSH_INTERVAL)
                } else this.flush()
        },
        getLogQueue: function() {
            return f
        }
    }
}(Sfdc));
Sfdc.onReady(function() {
    Sfdc.isDebug && Sfdc.ClientLogging.addRelay(new Sfdc.ClientLogging.ConsoleLogger, !0)
});
Sfdc.on(window, "unload", function() {
    window.Node = window.Sizzle = window.Modernizr = window.SfdcApp = window.SfdcCmp = window.Ninja = window.sfdcPage = window.Recommend = null
});

//# sourceMappingURL=/javascript/1478795576000/ui-sfdc-javascript-impl/source/SfdcCore.js.map