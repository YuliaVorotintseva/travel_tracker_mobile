import { existsSync, mkdirSync, writeFileSync } from "fs";

const FILE_PATH = "./src/shared/types/api/openapi.json";
const API_URL = "https://wtvoqcpxqsgmqfimwpbl.supabase.co/rest/v1/";
const API_KEY = "sb_secret_hkpOkiMenGuJE5E3DlYehA_L5tDbk1f";

async function ensureOpenApiSpec() {
  if (existsSync(FILE_PATH)) {
    console.log("✅ openapi.json уже существует.");
    return;
  }

  if (!existsSync("./src/shared/types/api")) {
    mkdirSync("./src/shared/types/api", { recursive: true });
  }

  console.log("📥 openapi.json не найден. Скачиваю...");
  try {
    const res = await fetch(API_URL, {
      headers: {
        apikey: API_KEY || "",
        Accept: "application/openapi+json",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    const spec = await res.json();
    if (!spec.openapi && !spec.paths)
      throw new Error("Получен некорректный OpenAPI spec");

    writeFileSync(FILE_PATH, JSON.stringify(spec, null, 2), "utf-8");
    console.log("✅ Успешно сохранён.");
  } catch (error) {
    console.error("❌ Ошибка загрузки:", error);
  }
}

ensureOpenApiSpec();
