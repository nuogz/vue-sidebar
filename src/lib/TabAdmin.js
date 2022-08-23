import { reactive } from 'vue';

import { randomString } from '@nuogz/utility';



export class Tab {
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
	map = {};
	key = '';

	params = [];

	histories = [];

	/** @type {Tab} */
	get now() { return this.map[this.key]; }
	get list() { return Object.values(this.map); }


	constructor(modulePre) {
		this.modulePre = modulePre;

		return reactive(this);
	}


	add(module, typeTab = 'icon-title', paramsTab = {}, flagsTab = '', ...paramsModule) {
		const id = randomString();


		const flagsTabParsed = flagsTab.split('|');

		const isOnce = flagsTabParsed.includes('once');
		const isHidden = flagsTabParsed.includes('hidden');
		const isDelay = flagsTabParsed.includes('delay');


		const tab =
			(isOnce ? Object.values(this.map).find(t => t.typeList == paramsTab.typeList) : undefined) ||
			(this.map[id] = new Tab(id, module, typeTab, paramsTab, isHidden));


		if(tab && !isDelay) { this.change(tab, ...paramsModule); }

		if(isDelay) { tab.paramsDelay = paramsModule; }


		return tab;
	}

	del(tab) {
		const now = this.now;

		const map = this.map;
		const ids = Object.keys(map);
		const index = ids.indexOf(tab.id);

		delete this.map[tab.id];


		if(now === tab) {
			this.histories.pop();
			const tabLast = this.histories.pop();

			if(tabLast) {
				this.change(tabLast);
			}
			else {
				this.change(map[ids[index + 1] ?? ids[index - 1]]);
			}
		}

		this.histories = this.histories
			.filter(his => his !== tab)
			.filter((his, index, arr) => his !== arr[index - 1]);
	}

	/** @param {Tab} tab */
	change(tab, ...params) {
		if(this.key == tab.id) { return; }

		this.key = tab.id;
		this.modulePre = tab.module;

		tab.params = tab.paramsDelay ?? params;
		delete tab.paramsDelay;


		if(this.histories[this.histories.length - 1] !== tab) { this.histories.push(tab); }

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

	changers = {};
	addChanger(type, func) { (this.changers[type] ?? (this.changers[type] = [])).push(func); }
}
