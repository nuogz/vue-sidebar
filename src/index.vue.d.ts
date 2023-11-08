import { DefineComponent, PropType, Ref } from 'vue';


import TabAdmin from './tab-admin.js';

export const moduleNow: Ref<string>;
export const tabAdmin: TabAdmin;
export const domSidebar: Ref<HTMLElement>;



declare const PR: {
	/** （开关）隐藏 */
	hidden: {
		type: (BooleanConstructor | StringConstructor)[];
		default: boolean;
	};
};


/** 侧栏 */
declare const Sidebar: import('vue').DefineComponent<
	typeof PR, {},
	unknown, {}, {},
	import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin,
	['show-menu-background'], string,
	import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
	Readonly<import('vue').ExtractPropTypes<typeof PR>>,
	typeof PR, {}
>;



export default Sidebar;
