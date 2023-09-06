# CHANGELOG

## v2.3.0 - 2023.09.06 20
* (break) change export `tabs` to `tabAdmin`
* (new) new event `show-menu-background` now
* (new) export `domSidebar` now
* (new) tab option support `style` and `@howdyjs/mouse-menu`'s `menu` option
* (break) restuct `TabOption`. Move flags `once`,`delay` and `hidden` into `TabOption`
* (break) rename Tab option `once` to `only`
* (break) restuct `TabAdmin`.`addChanger` to `TabAdmin`.`addTabHandle`
* improve style
* bump up dependencies


## v2.2.3 - 2023.08.30 00
* remove useless dependencies


## v2.2.2 - 2023.08.29 15
* tweak style


## v2.2.1 - 2023.08.29 14
* add tailwind configuration for intellisense


## v2.2.0 - 2023.08.29 14
* update color-related CSS variables
* bump up dependencies


## v2.1.1 - 2023.05.30 18
* tweak import


## v2.1.0 - 2023.05.30 18
* (break) `Sidebar` is no longer exported as default. It is normal export now.
* (new) export class `TabAdmin` now
* improve files struct
* improve declaration files


## v2.0.1 - 2023.05.30 14
* remove useless package


## v2.0.0 - 2023.05.30 14
* renew codes and rename some TabAdmin properties
* add declaration files and improve inline jsdoc
* bump up dependencies
	* update `typescript` to `v5.x`, and renew jsdoc
* use eslint flat config, and related config udpate
	* use `eslint.config.js` instead `eslintrc.cjs`
* update recommanded extensions
	* use `Volar` instead `Vetur`


## v1.1.4 - 2022.09.15 18
* fix typo


## v1.1.3 - 2022.09.15 18
* support `CV.widthSidebar` from outside
* bump up dependencies


## v1.1.2 - 2022.08.30 02
* fix `package.files`
* bump up dependencies


## v1.1.1 - 2022.08.24 16
* move main file to `src/Sidebar.vue` from `src/index.vue`
* improve package info
* improve `.eslintrc.cjs` for lint better


## v1.1.0 - 2022.08.24 09
* change top-level element to `comp-sidebar` from `p-sidebar`
* change load-module inject key to `load-module` from `loadModule`


## v1.0.0 - 2022.08.24 04
* independent from many projects
* tweak all files for publishing to npm
* start use `CHANGLOG.md` since version `v1.0.0`
