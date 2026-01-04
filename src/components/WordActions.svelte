<script lang="ts">
	let processing = $state(false);
	let success = $state(false);

	async function handleAction(type: 'copy' | 'export') {
		if (processing) return;
		processing = true;
		success = false;

		try {
			const { snapdom } = await import('@zumer/snapdom');
			const element = document.querySelector('.main-pane') as HTMLElement;
			if (!element) return;

			// 乔布斯式的极致细节：进入 Snapping 状态
			element.classList.add('is-snapping');
			
			await new Promise(resolve => setTimeout(resolve, 350));
			
			const capture = await snapdom(element, {
				backgroundColor: 'transparent',
				scale: 2,
				exclude: ['.word-actions-wrapper', '.no-print'],
				excludeMode: 'remove'
			});
			
			if (type === 'copy') {
				const canvas = await capture.toCanvas();
				const blob = await new Promise<Blob | null>(resolve => 
					canvas.toBlob(resolve, 'image/png', 1.0)
				);
				
				if (blob) {
					await navigator.clipboard.write([
						new ClipboardItem({ 'image/png': blob })
					]);
				}
			} else {
				const title = document.querySelector('h1')?.innerText?.trim() || 'word-card';
				await capture.download({ 
					type: 'png', 
					filename: `${title}`,
					quality: 1.0
				});
			}

			element.classList.remove('is-snapping');
			success = true;
			setTimeout(() => { success = false; }, 2000);
			
		} catch (err) {
			document.querySelector('.main-pane')?.classList.remove('is-snapping');
			console.error(`${type === 'copy' ? 'Copy' : 'Export'} failed:`, err);
		} finally {
			processing = false;
		}
	}
</script>

<div class="word-actions-wrapper mx-auto no-print not-content mt-8 mb-12 max-w-fit [perspective:1000px] print:hidden" style="margin-left: auto; margin-right: auto;">
	<nav class="flex items-center p-[0.6rem] max-[480px]:p-[0.4rem] bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-black/[0.08] dark:border-white/0.08 rounded-[1.5rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_10px_-2px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3),0_5px_15px_-2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]" aria-label="Word actions">
		<button
			onclick={() => handleAction('copy')}
			disabled={processing}
			class="group action-item flex flex-row items-center justify-center gap-2 py-[0.8rem] px-[1.8rem] min-w-[5.5rem] max-[480px]:px-[1.2rem] max-[480px]:py-[0.7rem] max-[480px]:min-w-[4.5rem] bg-transparent border-none rounded-[1.25rem] cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] relative hover:not-disabled:bg-black/[0.03] dark:hover:not-disabled:bg-white/[0.05] active:not-disabled:scale-[0.92] active:not-disabled:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40 {success ? 'text-[#34c759]' : ''}"
			title="将单词详情生成图片并拷贝"
		>
			<div class="flex items-center justify-center">
				{#if success}
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
			<span class="text-[0.75rem] font-semibold tracking-[0.03em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">{processing ? '处理中' : (success ? '已完成' : '拷贝')}</span>
		</button>
		
		<div class="w-[1px] h-8 bg-gradient-to-b from-transparent via-black/[0.08] dark:via-white/0.1 to-transparent !mx-2"></div>

		<button
			onclick={() => handleAction('export')}
			disabled={processing}
			class="group action-item flex flex-row items-center justify-center gap-2 py-[0.8rem] px-[1.8rem] min-w-[5.5rem] max-[480px]:px-[1.2rem] max-[480px]:py-[0.7rem] max-[480px]:min-w-[4.5rem] bg-transparent border-none rounded-[1.1rem] cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] relative hover:not-disabled:bg-black/[0.03] dark:hover:not-disabled:bg-white/[0.05] active:not-disabled:scale-[0.92] active:not-disabled:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
			title="将单词详情导出为图片文件"
		>
			<svg class="w-[1.3rem] h-[1.3rem] transition-transform duration-300 group-hover:-translate-y-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7 10 12 15 17 10" />
				<line x1="12" x2="12" y1="15" y2="3" />
			</svg>
			<span class="text-[0.75rem] font-semibold tracking-[0.03em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">{processing ? '处理中' : '导出'}</span>
		</button>
	</nav>
</div>

<style>
	@keyframes check-pop {
		0% { transform: scale(0.5); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}
</style>
