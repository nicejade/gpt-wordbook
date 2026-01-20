<script>
  const footerInfoArr = [
    {
      title: '开源项目',
      branch: [
        { title: '生财有迹', url: 'https://github.com/nicejade/wealth-tracker' },
        { title: '个人主页', url: 'https://github.com/nicejade/homepage' },
        { title: '倾城之链', url: 'https://github.com/nicejade/nicelinks-vue-client' },
        { title: '曼妙句子', url: 'https://github.com/nicejade/read.lovejade.cn' }
      ]
    },
    {
      title: '友情链接',
      branch: [
        { title: '逍遥自在轩', url: 'https://www.niceshare.site' },
        { title: '晚晴幽草轩', url: 'https://www.jeffjade.com/' },
        { title: '缘知随心庭', url: 'https://fine.niceshare.site/' },
        { title: '玉桃文飨轩', url: 'https://share.lovejade.cn/' }
      ]
    }
  ];

  const currentYear = new Date().getFullYear();
</script>

<footer class="custom-footer w-full flex flex-col justify-center items-center !mt-16 !md:mt-20 not-prose not-content" aria-label="网站页脚">
  <div class="rounded-[2rem] max-w-[60rem] mx-auto border border-white/[0.08] bg-white/[0.02] backdrop-blur-md [:root[data-theme='light']_&]:bg-black/[0.01] [:root[data-theme='light']_&]:border-black/[0.04]">
    <div class="px-6 sm:px-10 py-8">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">          
        <!-- Brand & Social -->
        <div class="flex flex-col items-start space-y-8 w-full lg:w-1/3">
          <div class="flex items-center gap-4 select-none">
            <img class="w-9 h-9 opacity-90" src="/favicon.svg" alt="Logo" />
            <span class="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--sl-color-text-accent)] to-[#6b7280] dark:to-[#d1d5db]">
              智析单词书
            </span>
          </div>

          <div class="w-full">
            <p class="text-sm !my-4 text-[var(--sl-color-gray-3)] leading-relaxed  max-w-sm">
              利用 GPT 模型深度解析英语词汇，助你从本质理解单词，构建长期记忆。
            </p>
            
            <div class="flex flex-wrap gap-1 items-center">
              {#each [
                { href: "https://github.com/nicejade", img: "github", alt: "Github" },
                { href: "https://x.com/MarshalXuan", img: "x", alt: "X | Twitter" },
                { href: "https://www.facebook.com/nice.jade.yang/", img: "facebook", alt: "Facebook | 脸书" },
                { href: "https://www.threads.com/@turingmind", img: "threads", alt: "Threads" },
                { href: "https://www.youtube.com/@MarshalXuan", img: "youtube", alt: "YouTube | 油管" },
                { href: "https://space.bilibili.com/690989854", img: "bilibili", alt: "Bilibili | 哔哩哔哩" },
                { href: "https://mastodon.social/@nicejade", img: "mastodon", alt: "Mastodon | 长毛象" },
                { href: "https://www.jeffjade.com/", img: "blogger", alt: "Blog | 博客" }
              ] as social}
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="p-3 rounded-xl text-[var(--sl-color-gray-3)] transition-all duration-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:scale-110 active:scale-95 focus-visible:outline-none no-underline border-none"
                  title={social.alt}
                >
                  <img class="w-5 h-5 opacity-60 transition-opacity hover:opacity-100" src="https://word.lovejade.cn/svgs/{social.img}.svg" alt={social.alt}>
                </a>
              {/each}
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="grid grid-cols-2 md:grid-cols-2 flex-1 gap-10 lg:gap-12">
          {#each footerInfoArr as item (item.title)}
            <div class="flex flex-col space-y-6 !mt-0">
              <h3 class="text-[12px] !mt-0 font-bold tracking-[0.2em] text-[var(--sl-color-gray-2)] uppercase opacity-80">
                {item.title}
              </h3>

              <ul class="space-y-4">
                {#each item.branch as citem}
                  <li>
                    <a 
                      href={citem.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="text-[var(--sl-color-gray-3)] text-[14px] inline-block px-3 py-1.5 -mx-3 rounded-lg transition-all duration-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-[var(--sl-color-text-accent)] focus-visible:outline-none no-underline border-none"
                    >
                      {citem.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>

      <!-- Bottom -->
      <div class="w-full pt-4 !mt-4 !md:mt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left [:root[data-theme='light']_&]:border-black/[0.05]">
        <p class="text-[var(--sl-color-gray-4)] text-[13px] font-medium tracking-wide">
          © {currentYear} <a href="https://www.lovejade.cn/" class="text-[var(--sl-color-gray-3)] px-2 py-1 rounded-md transition-all hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-[var(--sl-color-text-accent)] decoration-none no-underline border-none">lovejade.cn</a> · 保留所有权利
        </p>
      </div>
    </div>
  </div>
</footer>
