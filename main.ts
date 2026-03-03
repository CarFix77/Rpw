

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// База данных прямо внутри Deno (бесплатно)
const kv = await Deno.openKv();

const router = new Router();

// 1. Получение списка серверов
router.get("/servers", (ctx) => {
 ctx.response.body = [
  { id: "nl-01", name: "Netherlands", flag: "🇳🇱", ping: "45ms", host: "1.2.3.4" },
  { id: "de-01", name: "Germany", flag: "🇩🇪", ping: "52ms", host: "5.6.7.8" }
 ];
});

// 2. Получение ключа подключения (VLESS конфиг)
router.get("/get-config", async (ctx) => {
 const userId = ctx.request.url.searchParams.get("userId") || "guest";
 
 // Здесь мы будем генерировать реальный ключ. 
 // Пока это "заглушка", которую мы позже заменим на настоящую генерацию.
 const vlessConfig = `vless://uuid-uuid-uuid@${ctx.request.url.hostname}:443?encryption=none&security=reality&sni=google.com&fp=chrome&type=grpc&serviceName=grpc#AetherVPN_${userId}`;

 ctx.response.body = {
  config: vlessConfig,
  expires: "2026-01-01"
 };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Backend running on https://localhost:8000");
await app.listen({ port: 8000 });

