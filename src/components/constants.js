export const c = {
    SPECIAL_BUTTON:1,
    EXIT_DIALOG:2,
    SAVE_CARD_DATA:3,
    SET_CMD_HANDLER:4,
    UNSET_CMD_HANDLER:5,
    FIELD_INPUT:6,
    INPUT_ERROR:7,
    LOGIN_RETURNED:8,
    TRANSACTION_COMPLETED:9,
    FIELD_CHANGED:10,
    SAVE_DIALOG_DATA:11,
    FIELD_INITIALIZED:12,
    LOADERS_AVAILABLE:13,
    FIELD_CHANGE_EVENT:14,
    CHANGE_DIALOG_CONFIGURATION:15,
    CHANGE_MENU_CONFIGURATION:16,
    UPDATE_PAGE_SETTINGS:17,
    RELOAD_PAGE:18,
    PAGE_EDIT:19,
    PAGE_DISPLAY:20,
    PAGE_DISPLAY_NAME:'pageDisplay',
    PAGE_EDIT_NAME:'pageEdit',
    SET_CONTENT_DIMENSIONS:21,
    ROW_SELECTED:22,
    CHANGE_LAYOUT:23,
    ROW_SELECT:24,
    SET_NEW_LAYOUT:25,
    RESOLVE_DATA:26,
    MODE_DISPLAY:27,
    MODE_EDIT:28,
    SET_PAGE_EDIT:29,
    SET_CELL:30,
    SELECTED_COLOR: '#ad74b3',
    UNSELECTED_COLOR: '#DBAA6E',
    NOT_LOGGED_IN:31,
    LOGGED_IN:32,
    CARD_MENU_SELECTED:33,
    EXIT_EDIT_MODE:34,
    SET_TO_DISPLAY_MODE:35,
    SHOW_DIALOG:36,
    CARD_AREA_SELECTED:37,
    CREATE_CARD:38,
    CREATE_NEW_CARD:39,
    SET_CARD_DIMENSIONS:40,
    FIELD_CHANGE_ALERT:41,
    PRIMARY_FONT:42,
    SECONDARY_FONT:43,
    MENU_GOTO_LINK_EDIT:44,
    MENU_ADD_LINK:45,
    ROW_SELECTED_ACTION:46,
    UPDATE_DIALOG_DATA:47,
    LINK_TO_ADD_SELECTED:48,
    ADD_SELECTED_LINK:49,
    SET_DIALOG:50,
    //CHANGE_DIALOG:51,
    EDIT_SELECTED_LINK:52,
    UPDATE_SELECTED_LINK: 53,
    CHANGE_LINK:54,
    EXIT_EDIT_LINK:55,
    SET_REORDER:56,
    MOVE_ROW_UP:57,
    MOVE_ROW_DOWN:58,
    SET_REORDER_OFF:59,
    CREATE_PAGE:60,
    CHANGE_TO_EXTERNAL_LINK:61,
    CREATE_EXTERNAL_LINK:62,
    SAVE_NEW_EXTERNAL_LINK:63,
    ADD_NEW_EXTERNAL_LINK_TO_LIST:64,
    EDIT_HEADLINE:65,
    SAVE_HEADLINE:66,
    SAVE_CARD_TITLE:67,
    FILL_IN_AREA:68,
    SET_CARD_EDIT: 69,
    CELL_RESIZE:70,
    CELL_IN_CARD:71,
    CELL_IN_BLANK:72,
    GET_BACKGROUND:73,
    SAVE_TEXT_CONTENT:74,
    CARD_DELETE:75,





    MENU_EDIT_PAGE: 1001,
    MENU_PAGE_SETTINGS: 1002,
    MENU_PAGE_DELETE: 1003,
    MENU_PUBLISH: 1004,
    MENU_CREATE: 1005,
    MENU_ACCESS_: 1006,
    MENU_MYSPACES: 1007,
    MENU_LOGIN: 1008,
    MENU_CANCEL_LOGIN: 1009,



    MENU_EXIT_DIALOG: 1020,
    MENU_SAVE_DIALOG_DATA: 1021,
    MENU_ITEM_SELECTED: 1022,

    NEXT_PAGE: 1030,
    PREV_PAGE: 1031,
    FIRST_PAGE: 1032,
    LAST_PAGE: 1033,
    THIS_PAGE: 1034,
    PAGE_CHANGED: 1035,
    ALL_PAGES:  1036,
    PAGE_COUNT: 1040,

    CMD_SET_MENU: 1200,
    CMD_SET_MESSAGE: 1201,
    CMD_SET_VALUE:1203,
    CMD_NEXT_PAGE:1210,
    CMD_PREV_PAGE:1211,
    CMD_FIRST_PAGE:1212,
    CMD_LAST_PAGE:1213,

    DATA_EVTYPE: 1300,
    MENU_EVTYPE: 1301,
    SELECTION_EVTYPE: 1302,


    API_PATH:  'http://localhost:8000/',
    TRANS_GET_LAYOUT:2110,

    CARD_MENU_CONFIGURE: 2200,
    CARD_MENU_RESIZE: 2201,
    CARD_MENU_DELETE: 2202,
    CARD_MENU_EDIT: 2203,
    CARD_MENU_EXIT: 2204,
    CARD_MENU_SAVE: 2221,

    CARD_MENUV_CONFIGURE: 2205,
    CARD_MENUV_RESIZE: 2206,
    CARD_MENUV_DELETE: 2207,
    CARD_MENUV_EDIT: 2208,
    CARD_MENUV_EXIT: 2209,

    CARD_MENU_SETUP:2210,

    CARD_MENUE_SETUP:2211,
    CARD_MENUE_LINK: 2212,
    CARD_MENUE_UPLOAD: 2213,
    CARD_MENUE_SAVE: 2214,
    CARD_MENUE_METADATA: 2215,

    CARD_MENUS_EDIT: 2216,
    CARD_MENUS_CONFIGURE: 2217,
    CARD_MENUS_RESIZE: 2218,
    CARD_MENUS_DELETE: 2220,
    CARD_MENUS_SAVE: 2222,
    CARD_MENUS_EXIT: 2221,

    MOUSE_EVT: 2300,
    MOUSE_DOWN: 2301,
    MOUSE_UP: 2302,
    MOUSE_OVER: 2303,

    MOUSE_STATUS_NOT_CLICKED: 2400,
    MOUSE_STATUS_DOWN: 2401,


    DIRECTION_STRAIGHT_LEFT:2501,
    DIRECTION_STRAIGHT_RIGHT:2502,
    DIRECTION_STRAIGHT_UP:2503,
    DIRECTION_STRAIGHT_DOWN:2504,
    DIRECTION_DOWN_RIGHT:2505,
    DIRECTION_DOWN_LEFT:2506,
    DIRECTION_UP_RIGHT:2507,
    DIRECTION_UP_LEFT:2508,

    //DEFAULT_FONTS: ['Arial', 'Times New Roman', 'Helvetica','Times','Courier New','Verdana','Courier','Arial Narrow','Candara','Geneva','Calibri','Optima','Cambria','Garamond','Perpetua','Monaco','Didot','Brush Script MT','Lucida Bright','Copperplate'],
    DEFAULT_FONTS:[
        {
            value: 'Arial',
            label: 'Arial'
        },
        {
            value: 'Times New Roman',
            label: 'Times New Roman'
        },
        {
            value: 'Helvetica',
            label: 'Helvetica'
        },
        {
            value: 'Times',
            label: 'Times'
        },
        {
            value: 'Courier New',
            label: 'Courier New'
        },
        {
            value: 'Verdana',
            label: 'Verdana'
        },
        {
            value: 'Courier',
            label: 'Courier'
        },
        {
            value: 'Arial Narrow',
            label: 'Arial Narrow'
        },
        {
            value: 'Candara',
            label: 'Candara'
        },
        {
            value: 'Geneva',
            label: 'Geneva'
        },
        {
            value: 'Calibri',
            label: 'Calibri'
        },
        {
            value: 'Optima',
            label: 'Optima'
        },
        {
            value: 'Garamond',
            label: 'Garamond'
        },
        {
            value: 'Perpetua',
            label: 'Perpetua'
        },
        {
            value: 'Monaco',
            label: 'Monaco'
        },
        {
            value: 'Didot',
            label: 'Didot'
        },
        {
            value: 'Brush Script MT',
            label: 'Brush Script MT'
        },
        {
            value: 'Lucida Bright',
            label: 'Lucida Bright'
        },
        {
            value: 'Copperplate',
            label: 'Copperplate'
        },

    ],
    FONT_SIZE_OPTIONS:[
        {
            value:'10pt',
            label:'10pt'
        },
        {
            value:'12pt',
            label:'12pt'
        } ,
        {
            value:'18pt',
            label:'18pt'
        },
        {
            value:'24pt',
            label:'24pt'
        },
        {
            value:'36pt',
            label:'36pt'
        },
        {
            value:'48pt',
            label:'48pt'
        },
        {
            value:'72pt',
            label:'72pt'
        }
    ],
//    FONT_SIZE_OPTIONS: ['10pt', '12pt', '18pt', '24pt', '36pt', '48pt', '72pt'],
    FONT_WEIGHT_OPTIONS: [
        {
            value:'normal',
            label:'normal'
        },
        {
            value:'bold',
            label:'bold'
        },
        {
            value:'bolder',
            label:'bolder'
        },
        {
            value:'lighter',
            label:'lighter'
        }
    ],
//    FONT_WEIGHT_OPTIONS: ['normal', 'bold', 'bolder', 'lighter'],
//    FONT_STYLE_OPTIONS: ['normal', 'italic', 'oblique'],
    FONT_STYLE_OPTIONS:[
        {
            value:'normal',
            label:'normal'
        },
        {
            value:'italic',
            label:'italic'
        },
        {
            value:'oblique',
            label:'oblique'
        },
    ],
//    FONT_ALIGNMENT_OPTIONS: ['left', 'center', 'right'],
    FONT_ALIGNMENT_OPTIONS: [
        {
            value: 'left',
            label:'left'
        },
        {
            value:'center',
            label:'center'
        },
        {
            value:'right',
            label:'right'
        },
    ]








}
