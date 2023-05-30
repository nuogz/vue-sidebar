import { Component, Ref } from 'vue';


import TabAdmin from './lib/TabAdmin.js';



declare const Sidebar: Component;
export default Sidebar;

export const moduleNow: Ref<string | Component>;

export const tabs: TabAdmin;

export { Tab } from './lib/TabAdmin.js';
