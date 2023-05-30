<template>
	<comp-sidebar v-if="!$hidden" ref="domSidebar" @contextmenu.self.prevent="showMenuSidebar">
		<slot name="buttons-before" />
		<template v-for="(tab, index) of tabs.list" :key="`tab-${tab?.id}`">
			<template v-if="!tab.isHidden">
				<p-tab
					v-tip.right="tab.title"
					:now="brop(tabs.now === tab)"
					:tabindex="100 + index"
					@click="tabs.change(tab)" @keydown.enter.space="tabs.change(tab)"
				>
					<template v-if="tab.typesTab.includes('icon') && tab.icon">
						<Fas :icon="tab.icon" />
					</template>
					<template v-if="tab.typesTab.includes('icon-corn') && tab.icon">
						<Fas :icon="tab.icon" corn />
					</template>

					<template v-if="tab.typesTab.includes('title') && tab.title">
						<p-title>{{tab.title}}</p-title>
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

	import { bropBoolean } from '@nuogz/utility';
	import CV from '@nuogz/css-var';

	import TabAdmin from './tab-admin.js';



	export const moduleNow = ref(null);

	export const tabs = new TabAdmin();
</script>

<script setup>
	const props = defineProps({
		hidden: { type: [String, Boolean], default: false },
	});


	const $hidden = computed(() => bropBoolean(props.hidden));
	watch($hidden, hidden => CV.widthSidebar = CV.widthSidebar ? CV.widthSidebar : hidden ? '0rem' : '7rem', { immediate: true });


	const loadModule = inject('load-module')(moduleNow);


	const modulePre = ref('');
	watch(modulePre, loadModule);


	tabs.modulePre = modulePre;
</script>

<style lang="sass" scoped>
comp-sidebar
	@apply fixed z-50 shadow-mdd p-1 bg-gray-100
	width: var(--widthSidebar)
	height: calc(100% - var(--heightTopbar))
	top: var(--heightTopbar)
	background-color: var(--colorMain)

	svg
		@apply mr-1

		&[corn]
			@apply absolute opacity-25 z-10 text-xs top-1 left-1


	p-tab
		@apply relative block rounded-md text-center text-base shadow-mdd mt-2 cursor-pointer outline-none h-8 leading-8
		width: calc( var(--widthSidebar) - 0.55rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-500

		&[profile]
			@apply font-bold mt-0

		&[expand]
			@apply overflow-hidden px-1

			&:focus-within
				@apply overflow-visible w-24 ring-2 ring-yellow-500

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-2 ring-pink-400

		p-header
			@apply relative block rounded-md shadow-md absolute top-1 left-1 bg-cover
			width: calc(100% - 0.5rem)
			height: calc(100% - 0.5rem)
</style>
