<template>
	<comp-sidebar v-if="!$hidden" ref="domSidebar" back-scheme="main" @contextmenu.self.prevent="emit('show-menu-background', $event)">
		<slot name="buttons-before" />
		<template v-for="(tab, index) of tabAdmin.list" :key="`tab-${tab?.id}`">
			<template v-if="!tab.option.hidden">
				<p-tab
					v-tip.right="tab.title"
					v-menu="{ params: tab, ...tab.option.menu }"
					:now="brop(tabAdmin.now === tab)"
					:tabindex="1000 + index"
					:style="tab.option.style"
					@click="tabAdmin.change(tab)"
					@keydown.enter.space="tabAdmin.change(tab)"
				>
					<template v-if="tab.typesTab.includes('icon-corn') && tab.icon">
						<Fas :icon="tab.icon" corn />
					</template>

					<template v-if="tab.typesTab.includes('icon') && tab.icon">
						<Fas :icon="tab.icon" />
					</template>

					<template v-if="tab.typesTab.includes('title') && tab.title">
						{{ tab.typesTab.includes('icon') ? ' ' : '' }}<p-title>{{ tab.title }}</p-title>
					</template>

					<template v-if="tab.typesTab.includes('header') && tab.header">
						<p-header :style="{ backgroundImage: `url(${tab.header})` }" />
					</template>
				</p-tab>
			</template>
		</template>
	</comp-sidebar>
</template>

<script>
	import { ref, watch, inject, computed } from 'vue';
	import { FontAwesomeIcon as Fas } from '@fortawesome/vue-fontawesome';

	import { brop, bropBoolean } from '@nuogz/utility';

	import TabAdmin from './tab-admin.js';


	import './index.pcss';



	export const moduleNow = ref(null);
	export const tabAdmin = new TabAdmin();
	export const domSidebar = ref(null);
</script>

<script setup>
	const props = defineProps({
		/** （开关）隐藏 */
		hidden: { type: [Boolean, String], default: false },
	});
	const emit = defineEmits(['show-menu-background']);


	const $hidden = computed(() => bropBoolean(props.hidden));


	const modulePre = ref('');
	watch(modulePre, inject('load-module')(moduleNow));


	tabAdmin.modulePre = modulePre;
</script>

<style lang="sass" scoped>
comp-sidebar
	@apply fixed z-50 shadow-mdd p-1 bg-[var(--cMain)] overflow-x-hidden overflow-y-scroll
	width: var(--widthSidebar)
	height: calc(100% - var(--heightTopbar))
	top: var(--heightTopbar)

	svg[corn]
		@apply absolute opacity-25 z-10 text-xs top-1 left-1

	p-tab
		@apply relative block h-8 px-2 mb-2
		@apply rounded-sm cursor-pointer outline-none shadow-mdd select-none
		@apply elli text-left text-base leading-8 text-[var(--TextBack)] bg-[var(--cBack)]
		width: calc(var(--widthSidebar) - var(--spc) * 4)

		&:first-of-type
			@apply mt-2

		&:focus
			@apply ring-2 ring-[var(--cSidebarRingFocus)]

		&[profile]
			@apply font-bold mt-0

		&[expand]
			@apply overflow-hidden px-1

			&:focus-within
				@apply overflow-visible w-24 ring-2 ring-[var(--cRingFocus)]

			input
				@apply rounded-sm w-full text-center outline-none z-20 bg-transparent

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-2 ring-[var(--cSidebarRingNow)]

		p-header
			@apply relative block rounded-sm shadow-md absolute top-1 left-1
			@apply bg-center bg-contain bg-no-repeat
			width: calc(100% - 0.5rem)
			height: calc(100% - 0.5rem)
</style>
