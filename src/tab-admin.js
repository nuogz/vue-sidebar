import { reactive, toRef, unref } from 'vue';

import { randomString } from '@nuogz/utility';



/**
 * @typedef {Object} TabOption
 * @property {string} type type of how to show tab info in tab list
 * @property {string} typeList type of tab in tab list
 * @property {Object | Array<string> | string | import('@fortawesome/fontawesome-svg-core').IconDefinition} [icon] fontawesome icon (if typeList)
 * @property {string} [title]
 * @property {string} [header] the url of tab image
 * @property {boolean} [only]
 * @property {boolean} [hidden]
 * @property {boolean} [delay]
 * @property {Object} [style]
 * @property {import('@howdyjs/mouse-menu/dist/types').CustomMouseMenuOptions} [menu]
 */

export class Tab {
	/** @type {string} */
	id;
	/** @type {string} */
	module;

	/** @type {string} */
	typeTab;
	/** @type {string} */
	typeList;


	/** @type {TabOption} */
	option;


	/** @type {Object | Array<string> | string | import('@fortawesome/fontawesome-svg-core').IconDefinition} */
	icon;
	/** @type {string} */
	title;
	/** @type {string} */
	header;


	/** @type {Object<string, any>} */
	info;

	/** @type {any[]} */
	params;
	/** @type {any[]} */
	paramsDelay;


	/** @type {boolean} */
	inited = false;



	/**
	 * @param {string} id
	 * @param {string} module
	 * @param {string} typeTab
	 * @param {TabOption} option
	 * @param {Object<string, any>} params
	 */
	constructor(id, module, option = {}, params) {
		const { type = 'icon|title', typeList, icon, title, header } = option;

		this.id = id;
		this.module = module;

		this.typeTab = type;
		this.typeList = typeList ?? module;

		this.option = option;

		this.icon = icon;
		this.title = title;
		this.header = header;

		this.info = {};
		this.params = params ?? {};
	}

	get typesTab() { return this.typeTab?.split('|') ?? []; }
}

export default class TabAdmin {
	/** @type {Object<string, Tab>} */
	tabs$id = {};

	/** @type {string} */
	idTabNow = '';


	/** @type {Tab[]} */
	historiesTab = [];


	/** @type {import('vue').Ref<string>} */
	modulePre;


	/** @type {Tab} */
	get now() { return this.tabs$id[this.idTabNow]; }
	/** @type {Tab[]} */
	get list() { return Object.values(this.tabs$id); }



	constructor() { return reactive(this); }



	/**
	 * @param {string} module
	 * @param {TabOption} option
	 * @param {...any} params
	 * @returns {Tab}
	 */
	add(module, option = {}, ...params) {
		const idTab = randomString();


		const tab =
			(option.only ? Object.values(this.tabs$id).find(t => t.typeList == option.typeList) : undefined) ??
			(this.tabs$id[idTab] = new Tab(idTab, module, option));


		if(option.delay) {
			tab.paramsDelay = params;
		}
		else {
			this.change(tab, ...params);
		}


		return tab;
	}

	/** @param {Tab} tab */
	del(tab) {
		const now = this.now;

		const map = this.tabs$id;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.tabs$id[tab.id];


		if(now === tab) {
			this.historiesTab.pop();
			const tabLast = this.historiesTab.pop();

			if(tabLast) {
				this.change(tabLast);
			}
			else {
				this.change(map[ids[index + 1] ?? ids[index - 1]]);
			}
		}

		this.historiesTab = this.historiesTab
			.filter(his => his !== tab)
			.filter((his, index, arr) => his !== arr[index - 1]);
	}

	/**
	 * @param {Tab} tab
	 * @param {...any} params
	 */
	change(tab, ...params) {
		if(this.idTabNow == tab.id) { return; }

		this.idTabNow = tab.id;
		this.modulePre = tab.module;

		tab.params = tab.paramsDelay ?? params;
		delete tab.paramsDelay;


		if(this.historiesTab[this.historiesTab.length - 1] !== tab) { this.historiesTab.push(tab); }


		this.emitChanged('change');
	}


	async emitChanged(reason) {
		const handlesTab = this.handlesTab$typeList[this.now.typeList];
		if(!handlesTab) { return; }


		for(const [refTab, handleInit, handleChange] of handlesTab) {
			try {
				refTab.value = this.now;


				if(!this.now.inited && typeof handleInit == 'function') {
					await handleInit(this.now, reason);

					this.now.inited = true;
				}

				if(typeof handleChange == 'function') {
					await handleChange(this.now, reason);
				}
			}
			catch(error) { void 0; }
		}
	}

	/**
	 * @typedef {Object} TabHandle
	 * @property {import('vue').Ref<Tab>} refTab
	 * @property {Function} handleInit
	 * @property {Function} handleChange
	 */


	/** @type {Object<string, TabHandle[]>} */
	handlesTab$typeList = {};
	/**
	 * @param {string} typeListTab
	 * @param {import('vue').Ref<Tab>} refTab
	 * @param {Function} handleInit
	 * @param {Function} handleChange
	 */
	addTabHandle(typeListTab, refTab, handleInit, handleChange) {
		(this.handlesTab$typeList[typeListTab] ?? (this.handlesTab$typeList[typeListTab] = []))
			.push([refTab, handleInit, handleChange]);
	}
}
