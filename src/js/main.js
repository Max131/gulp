'use strict';

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM Loaded...');

	const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
	const isPortraitOrientation = window.matchMedia('(orientation: portrait)').matches;
	const isHoverCapable = window.matchMedia('(hover: hover)').matches;
	const isDarkModePrefence = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isReducedMotionPreference = window.matchMedia('(prefers-reduced-motion)').matches;
})

window.addEventListener('Load', () => {
	console.log('Resources loaded...');
})
