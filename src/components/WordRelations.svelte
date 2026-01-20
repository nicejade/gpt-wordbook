<script lang="ts">
  export let synonyms: string[] = [];
  export let antonyms: string[] = [];
</script>

{#if synonyms.length > 0 || antonyms.length > 0}
  <h3 class="font-bold uppercase mt-[1.5em]! text-[#1d1d1f]/60 [:root[data-theme='dark']_&]:text-[#f5f5f7]/60 px-1">
    同义&反义
  </h3>
  <div class="!my-10 flex flex-col gap-8 not-content">
    {#if synonyms.length > 0}
      <div class="flex flex-col gap-3">
        <h4 class="font-bold uppercase text-[#1d1d1f]/60 [:root[data-theme='dark']_&]:text-[#f5f5f7]/60 px-1">
          同义词 Synonyms
        </h4>
        <div class="flex flex-wrap gap-2 max-w-full">
          {#each synonyms as synonym}
            <a 
              href="https://word.lovejade.cn/words/{synonym.toLowerCase()}/"
              title="查看单词: {synonym}"
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium !text-[#1d1d1f] [:root[data-theme='dark']_&]:!text-[#f5f5f7] !no-underline !border-none transition-all duration-200 hover:!bg-black/[0.05] [:root[data-theme='dark']_&]:hover:!bg-white/[0.1] hover:scale-[1.02] break-words max-w-full"
            >
              {synonym}
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if antonyms.length > 0}
      <div class="flex flex-col gap-3">
        <h4 class="font-bold uppercase text-[#1d1d1f]/60 [:root[data-theme='dark']_&]:text-[#f5f5f7]/60 px-1">
          反义词 Antonyms
        </h4>
        <div class="flex flex-wrap gap-2 max-w-full">
          {#each antonyms as antonym}
            <a 
              href="https://word.lovejade.cn/words/{antonym.toLowerCase()}/"
              title="查看单词: {antonym}"
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium !text-[#1d1d1f] [:root[data-theme='dark']_&]:!text-[#f5f5f7] !no-underline !border-none transition-all duration-200 hover:!bg-black/[0.05] [:root[data-theme='dark']_&]:hover:!bg-white/[0.1] hover:scale-[1.02] break-words max-w-full"
            >
              {antonym}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
