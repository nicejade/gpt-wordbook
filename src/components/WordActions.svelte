<script lang="ts">
	// Separate states for copy and export actions
	let copyProcessing = $state(false);
	let copySuccess = $state(false);
	let exportProcessing = $state(false);
	let exportSuccess = $state(false);

	/**
	 * Capture the word card via an offscreen clone so the live page
	 * never receives layout/style mutations (no visible jitter).
	 */
	async function captureWordContent() {
		const { snapdom } = await import('@zumer/snapdom');
		const element = document.querySelector('.word-content') as HTMLElement | null;
		if (!element) return null;

		const clone = element.cloneNode(true) as HTMLElement;
		clone.classList.add('is-snapping');
		clone.setAttribute('aria-hidden', 'true');
		clone.querySelectorAll('.no-print, .word-actions-wrapper').forEach((node) => node.remove());

		Object.assign(clone.style, {
			position: 'fixed',
			left: '-10000px',
			top: '0',
			margin: '0',
			pointerEvents: 'none',
			zIndex: '-1',
			transition: 'none',
		});

		document.body.appendChild(clone);
		// Force layout so padding/background from .is-snapping are applied
		void clone.offsetHeight;

		try {
			return await snapdom(clone, {
				backgroundColor: 'transparent',
				scale: 2,
				fast: true,
			});
		} finally {
			clone.remove();
		}
	}

	async function handleCopy() {
		if (copyProcessing) return;
		copyProcessing = true;
		copySuccess = false;

		try {
			const capture = await captureWordContent();
			if (!capture) return;

			const canvas = await capture.toCanvas();
			const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/png', 1.0)
			);

			if (blob) {
				await navigator.clipboard.write([
					new ClipboardItem({ 'image/png': blob })
				]);
			}

			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Copy failed:', err);
		} finally {
			copyProcessing = false;
		}
	}

	async function handleExport() {
		if (exportProcessing) return;
		exportProcessing = true;
		exportSuccess = false;

		try {
			const capture = await captureWordContent();
			if (!capture) return;

			const title = document.querySelector('h1')?.innerText?.trim() || 'word-card';
			await capture.download({
				type: 'png',
				filename: `${title}`,
				quality: 1.0
			});

			exportSuccess = true;
			setTimeout(() => {
				exportSuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Export failed:', err);
		} finally {
			exportProcessing = false;
		}
	}
</script>

<div class="word-actions-wrapper mx-auto! no-print not-content mt-8! max-w-fit! [perspective:1000px] print:hidden">
	<nav class="flex items-center justify-center w-full p-[0.6rem] max-[480px]:p-[0.4rem] bg-white/60 [:root[data-theme='dark']_&]:bg-[#1c1c1e]/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-black/[0.08] [:root[data-theme='dark']_&]:border-white/0.08 rounded-[1.5rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_10px_-2px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.8)] [:root[data-theme='dark']_&]:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3),0_5px_15px_-2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]" aria-label="Word actions">
		<button
			onclick={handleCopy}
			disabled={copyProcessing}
			class="group action-item flex flex-row items-center justify-center gap-2 py-[0.8rem] px-[1.8rem] min-w-[5.5rem] max-[480px]:px-[1.2rem] max-[480px]:py-[0.7rem] max-[480px]:min-w-[4.5rem] bg-transparent border-none rounded-[1.25rem] cursor-pointer text-[#1d1d1f] [:root[data-theme='dark']_&]:text-[#f5f5f7] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] relative hover:not-disabled:bg-black/[0.03] [:root[data-theme='dark']_&]:hover:not-disabled:bg-white/[0.05] active:not-disabled:scale-[0.92] active:not-disabled:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40 {copySuccess ? 'text-[#34c759]' : ''}"
			title="将单词详情生成图片并拷贝"
		>
			<div class="flex items-center justify-center">
				{#if copySuccess}
					<svg class="animate-[check-pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] w-[1.3rem] h-[1.3rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				{:else}
					<svg class="w-[1.3rem] h-[1.3rem] transition-transform duration-300 group-hover:-translate-y-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
					</svg>
				{/if}
			</div>
			<span class="text-[0.75rem] font-semibold tracking-[0.03em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">{copyProcessing ? '处理中' : (copySuccess ? '已完成' : '拷贝')}</span>
		</button>
		
		<div class="w-[1px] h-8 bg-gradient-to-b from-transparent via-black/[0.08] [:root[data-theme='dark']_&]:via-white/0.1 to-transparent !mx-2"></div>

		<button
			onclick={handleExport}
			disabled={exportProcessing}
			class="group action-item flex flex-row items-center justify-center gap-2 py-[0.8rem] px-[1.8rem] min-w-[5.5rem] max-[480px]:px-[1.2rem] max-[480px]:py-[0.7rem] max-[480px]:min-w-[4.5rem] bg-transparent border-none rounded-[1.1rem] cursor-pointer text-[#1d1d1f] [:root[data-theme='dark']_&]:text-[#f5f5f7] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] relative hover:not-disabled:bg-black/[0.03] [:root[data-theme='dark']_&]:hover:not-disabled:bg-white/[0.05] active:not-disabled:scale-[0.92] active:not-disabled:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40 {exportSuccess ? 'text-[#34c759]' : ''}"
			title="将单词详情导出为图片文件"
		>
			<div class="flex items-center justify-center">
				{#if exportSuccess}
					<svg class="animate-[check-pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] w-[1.3rem] h-[1.3rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				{:else}
					<svg class="w-[1.3rem] h-[1.3rem] transition-transform duration-300 group-hover:-translate-y-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" x2="12" y1="15" y2="3" />
					</svg>
				{/if}
			</div>
			<span class="text-[0.75rem] font-semibold tracking-[0.03em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">{exportProcessing ? '处理中' : (exportSuccess ? '已完成' : '导出')}</span>
		</button>
	</nav>
</div>

<style>
	@keyframes check-pop {
		0% { transform: scale(0.5); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}
</style>
