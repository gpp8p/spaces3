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
                        { type: 'menuItem', config: { label: 'Delete', actionCode: c.MENU_PAGE_DELETE, data_cy: 'menu_opt_delete' } },
                        { type: 'menuItem', config: { label: 'Publish', actionCode: c.MENU_PUBLISH, data_cy: 'menu_opt_publish' } },
                        { type: 'menuItem', config: { label: 'Create', actionCode: c.MENU_CREATE, data_cy: 'menu_opt_create' } },
                        { type: 'menuItem', config: { label: 'Access', actionCode: c.MENU_ACCESS, data_cy: 'menu_opt_access' } },
                        { type: 'menuItem', config: { label: 'My Spaces', actionCode: c.MENU_MYSPACES, data_cy: 'menu_opt_myspaces' } },
                    ],
                }
            }
        }
    }
    return getMenuOpts
}
