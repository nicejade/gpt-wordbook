<script lang="ts">
  export let word: string;
  export let uk: string = '';
  export let us: string = '';
  export let audioWord: string = '';
  export let speechText: string = '';

  let isPlayingUK = false;
  let isPlayingUS = false;
  let playbackToken = 0;
  const MAX_PLAYBACK_COUNT = 2;
  let currentAudio: HTMLAudioElement | null = null;
  let audioApiFailed = false;

  const resolveAudioWord = () => (audioWord || word).trim().toLowerCase();
  const resolveSpeechText = () => {
    const text = (speechText || word).trim();
    if (!speechText && word.trim().length === 1) {
      return word.trim().toLowerCase();
    }
    return text;
  };

  const buildAudioUrl = () => {
    const resolvedWord = resolveAudioWord();
    return `https://api.dictionaryapi.dev/media/pronunciations/en/${encodeURIComponent(
      resolvedWord
    )}-us.mp3`;
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const setPlayingState = (accent: 'uk' | 'us', isPlaying: boolean) => {
    if (accent === 'uk') {
      isPlayingUK = isPlaying;
      isPlayingUS = false;
    } else {
      isPlayingUS = isPlaying;
      isPlayingUK = false;
    }
  };

  const stopCurrentPlayback = () => {
    playbackToken += 1;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  };

  const playWithSpeechSynthesisOnce = (accent: 'uk' | 'us') =>
    new Promise<void>((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(resolveSpeechText());
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find((voice) =>
        accent === 'uk' ? voice.lang.startsWith('en-GB') : voice.lang.startsWith('en-US')
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
      utterance.rate = 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });

  const playAudioOnce = () =>
    new Promise<void>((resolve) => {
      if (audioApiFailed) {
        playWithSpeechSynthesisOnce('us').then(() => resolve());
        return;
      }

      const audio = new Audio(buildAudioUrl());
      audio.preload = 'none';
      currentAudio = audio;

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      const cleanup = () => {
        if (currentAudio === audio) {
          currentAudio = null;
        }
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const fallbackToSpeech = () => {
        audioApiFailed = true;
        cleanup();
        playWithSpeechSynthesisOnce('us').then(() => finish());
      };

      const handleEnded = () => {
        cleanup();
        finish();
      };

      const handleError = () => fallbackToSpeech();

      audio.addEventListener('ended', handleEnded, { once: true });
      audio.addEventListener('error', handleError, { once: true });

      audio.play().catch(() => fallbackToSpeech());
    });

  const playOnce = (accent: 'uk' | 'us') =>
    accent === 'uk' ? playWithSpeechSynthesisOnce('uk') : playAudioOnce();

  const playPronunciation = async (accent: 'uk' | 'us') => {
    stopCurrentPlayback();
    const currentToken = playbackToken;

    setPlayingState(accent, true);
    for (let i = 0; i < MAX_PLAYBACK_COUNT; i += 1) {
      if (currentToken !== playbackToken) break;
      await playOnce(accent);
      if (currentToken !== playbackToken) break;
      if (i < 2) {
        await sleep(300);
      }
    }
    if (currentToken === playbackToken) {
      setPlayingState(accent, false);
    }
  };

  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
</script>

{#if uk || us}
  <h3 class="font-bold uppercase my-[0]! text-[#1d1d1f]/60 [:root[data-theme='dark']_&]:text-[#f5f5f7]/60 px-1">
    音标发音
  </h3>
  <div class="mx-auto !my-8 w-full max-w-fit [perspective:1000px] print:hidden">
    <div class="flex flex-col sm:flex-row sm:justify-evenly items-center gap-3 sm:gap-0 p-[0.4rem] w-full bg-white/60 [:root[data-theme='dark']_&]:bg-[#1c1c1e]/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-black/[0.08] [:root[data-theme='dark']_&]:border-white/0.08 rounded-[1.5rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_10px_-2px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.8)] [:root[data-theme='dark']_&]:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3),0_5px_15px_-2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500">
      
      {#if uk}
        <button 
          class="group flex flex-row items-center justify-center gap-2 sm:gap-3 py-[0.6rem] px-[1rem] sm:px-[1.2rem] w-full sm:w-auto bg-transparent border-none rounded-[1.2rem] cursor-pointer text-[#1d1d1f] [:root[data-theme='dark']_&]:text-[#f5f5f7] transition-all duration-300 hover:bg-black/[0.03] [:root[data-theme='dark']_&]:hover:bg-white/[0.05] active:scale-[0.96] active:bg-black/[0.06] {isPlayingUK ? 'text-[#8b5cf6]' : ''}"
          on:click={() => playPronunciation('uk')}
          aria-label="播放英式发音"
          title="播放英式发音"
        >
          <span class="text-xs font-bold opacity-50 uppercase">UK</span>
          <span class="font-sans text-sm sm:text-base !mt-[-2px] tracking-wide opacity-90 break-all">{uk}</span>
          <div class="relative w-[1.1rem] h-[1.1rem] flex items-center justify-center flex-shrink-0">
             {#if isPlayingUK}
               <span class="absolute inset-0 rounded-full bg-[#8b5cf6]/20 animate-ping"></span>
             {/if}
             <svg class="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
             </svg>
          </div>
        </button>
      {/if}

      {#if uk && us}
        <div class="hidden sm:block w-[1px] h-6 bg-black/[0.08] [:root[data-theme='dark']_&]:bg-white/0.1 !mx-6 !my-0"></div>
        <div class="block sm:hidden w-full h-[1px] bg-black/[0.08] [:root[data-theme='dark']_&]:bg-white/0.1 !mx-0 !my-1"></div>
      {/if}

      {#if us}
        <button 
          class="!my-0 group flex flex-row items-center justify-center gap-2 sm:gap-3 py-[0.6rem] px-[1rem] sm:px-[1.2rem] w-full sm:w-auto bg-transparent border-none rounded-[1.2rem] cursor-pointer text-[#1d1d1f] [:root[data-theme='dark']_&]:text-[#f5f5f7] transition-all duration-300 hover:bg-black/[0.03] [:root[data-theme='dark']_&]:hover:bg-white/[0.05] active:scale-[0.96] active:bg-black/[0.06] {isPlayingUS ? 'text-[#8b5cf6]' : ''}"
          on:click={() => playPronunciation('us')}
          aria-label="播放美式发音"
          title="播放美式发音"
        >
          <span class="text-xs font-bold opacity-50 uppercase">US</span>
          <span class="font-sans text-sm sm:text-base !mt-[-2px] tracking-wide opacity-90 break-all">{us}</span>
          <div class="relative w-[1.1rem] h-[1.1rem] flex items-center justify-center flex-shrink-0">
             {#if isPlayingUS}
               <span class="absolute inset-0 rounded-full bg-[#8b5cf6]/20 animate-ping"></span>
             {/if}
             <svg class="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
               <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
             </svg>
          </div>
        </button>
      {/if}

    </div>
  </div>
{/if}
