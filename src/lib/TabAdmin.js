import { reactive } from 'vue';

import { randomString } from '@nuogz/utility';



/**
 * @typedef {Object} TabParam
 * @property {string} typeList the type of tab in the tab list
 * @property {Object | Array<string> | string | import('@fortawesome/fontawesome-svg-core').IconDefinition} icon fontawesome icon (if typeList)
 * @property {string} title
 * @property {string} header the url of tab image
 */

export class Tab {
	/** @type {string} */
	id;
	/** @type {string} */
	module;

	/** @type {string} */
	typeTab;
	/** @type {TabParam} */
	paramsTab;


	/** @type {string} */
	typeList;
	/** @type {Object | Array<string> | string | import('@fortawesome/fontawesome-svg-core').IconDefinition} */
	icon;
	/** @type {string} */
	title;
	/** @type {string} */
	header;
	/** @type {boolean} */
	isHidden;


	/** @type {Object<string, any>} */
	info;

	/** @type {any[]} */
	params;
	/** @type {any[]} */
	paramsDelay;



	/**
	 * @param {string} id
	 * @param {string} module
	 * @param {string} typeTab
	 * @param {TabParam} paramsTab
	 * @param {boolean} isHidden
	 * @param {Object<string, any>} params
	 */
	constructor(id, module, typeTab, paramsTab = {}, isHidden, params) {
		const { typeList, icon, title, header } = paramsTab;

		this.id = id;
		this.module = module;

		this.typeTab = typeTab;

		this.paramsTab = paramsTab;
		this.typeList = typeList ?? module;
		this.icon = icon;
		this.title = title;
		this.header = header;

		this.isHidden = isHidden ?? false;

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
	 * @param {string} typeTab Any combination of `icon`, `icon-cron`, `title`, and `header`. Separator is `|`
	 * @param {TabParam} paramsTab
	 * @param {string} flagsTab Any combination of `once`, `hidden`, and `delay`. Separator is `|`
	 * @param {...any} paramsModule
	 * @returns {Tab}
	 */
	add(module, typeTab = 'icon-title', paramsTab = {}, flagsTab = '', ...paramsModule) {
		const idTab = randomString();


		const flagsTabParsed = flagsTab.split('|');

		const isOnce = flagsTabParsed.includes('once');
		const isHidden = flagsTabParsed.includes('hidden');
		const isDelay = flagsTabParsed.includes('delay');


		const tab =
			(isOnce ? Object.values(this.tabs$id).find(t => t.typeList == paramsTab.typeList) : undefined) ||
			(this.tabs$id[idTab] = new Tab(idTab, module, typeTab, paramsTab, isHidden));


		if(tab && !isDelay) { this.change(tab, ...paramsModule); }

		if(isDelay) { tab.paramsDelay = paramsModule; }


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


		this.emitChanged();
	}


	emitChanged() {
		(this.changers[this.now.typeList] ?? [])
			.forEach(changer => {
				try {
					changer(this.now);
				}
				catch(error) { void 0; }
			});
	}

	/** @type {Object<string, Function[]>} */
	changers = {};
	/**
	 * @param {string} typeListTab
	 * @param {Function} handle
	 */
	addChanger(typeListTab, handle) { (this.changers[typeListTab] ?? (this.changers[typeListTab] = [])).push(handle); }
}
