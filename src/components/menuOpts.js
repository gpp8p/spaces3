import {c} from "../components/constants.js";

export function getMenu(){
    const getMenuOpts = function(c, menuDef){
        switch(menuDef){
            case 'adminMenu': {
                return {
                    twStyling:'border-4 my-10 w-3/4 mx-auto border-blue-200',
                    items: [
                        { type: 'menuItemDrop', config: {label: 'Page', subItems: [
                                    { subLabel: 'Edit Page', actionCode: c.MENU_EDIT_PAGE },
                                    { subLabel: 'Settings', actionCode: c.MENU_PAGE_SETTINGS },
                                ]
                            }
                        },
                        { type: 'menuItem', config: { label: 'Delete', actionCode: c.MENU_PAGE_DELETE } },
                        { type: 'menuItem', config: { label: 'Publish', actionCode: c.MENU_PUBLISH } },
                        { type: 'menuItem', config: { label: 'Create', actionCode: c.MENU_CREATE } },
                        { type: 'menuItem', config: { label: 'Access', actionCode: c.MENU_ACCESS } },
                        { type: 'menuItem', config: { label: 'My Spaces', actionCode: c.MENU_MYSPACES } },
                    ],
                }
            }
            case 'loginMenu': {
                return {
                    twStyling:'text-xs text-blue-500 w-[40%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Login', actionCode: c.MENU_LOGIN } },
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_CANCEL_LOGIN } },
                    ],
                }
            }
        }
    }
    return getMenuOpts
}
