//vite.config.ts
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";
import { SponsorPlugin } from 'vitepress-plugin-sponsor'
import path from 'path'
//default options
var options = {
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs",
};

export default defineConfig({
  base: '/blog/',
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, './assets') // 添加路径别名
    }
  },
  plugins: [
    SearchPlugin(),
    SponsorPlugin({
      type: 'simple',
      aliPayQR: 'https://www.zubylon.tech/blog/assets/AliPay.jpg',
      weChatQR: 'https://www.zubylon.tech/blog/assets/WechatPay.jpg'
    }),
  ],

});