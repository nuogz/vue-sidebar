import { DefineComponent, PropType, Ref } from 'vue';



declare const Sidebar: DefineComponent<{
	/** hidden sidebar */
	hidden: { type: PropType<Boolean>; };
}>;

export default Sidebar;


import TabAdmin from './tab-admin.js';

export const tabs: TabAdmin;


export const moduleNow: Ref<string>;
