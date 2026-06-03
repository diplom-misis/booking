const CRON_SECRET = "some-secret";
const CHUNK_STRIDE_DAYS = 1;      // сдвиг между началами чанков
const TOTAL_MONTHS_AHEAD = 12;     // на сколько месяцев вперёд генерировать
const START_FROM_CHUNK = 0;         // с какого чанка начать (для возобновления после ошибки)
const MAX_RETRIES_PER_CHUNK = 2;   // повторов при таймауте/ошибке

// ---------------------------------------------------------------------------

function calcStartDate(chunkIndex) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + chunkIndex * CHUNK_STRIDE_DAYS);
  return d;
}

async function runChunk(chunkIndex, totalChunks) {
  const startDate = calcStartDate(chunkIndex);
  const startIso = startDate.toISOString();
  const url = `/api/generate-routes?startDate=${encodeURIComponent(startIso)}`;

  for (let attempt = 1; attempt <= MAX_RETRIES_PER_CHUNK; attempt++) {
    const t0 = performance.now();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CRON_SECRET}`,
        },
      });
      const elapsedMs = Math.round(performance.now() - t0);
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log(
          `[${chunkIndex + 1}/${totalChunks}] OK ${startIso.slice(0, 10)} (${elapsedMs}ms, server=${data.durationSec ?? "?"}s)`,
        );
        return { ok: true };
      }

      console.warn(
        `[${chunkIndex + 1}/${totalChunks}] attempt ${attempt} FAIL status=${response.status} (${elapsedMs}ms)`,
        data,
      );

      if (response.status >= 500 && attempt < MAX_RETRIES_PER_CHUNK) {
        continue;
      }
      return { ok: false, status: response.status, data };
    } catch (err) {
      const elapsedMs = Math.round(performance.now() - t0);
      console.warn(
        `[${chunkIndex + 1}/${totalChunks}] attempt ${attempt} ERROR (${elapsedMs}ms)`,
        err,
      );
      if (attempt < MAX_RETRIES_PER_CHUNK) continue;
      return { ok: false, error: err };
    }
  }
  return { ok: false };
}

async function runAllChunks() {
  const totalDays = TOTAL_MONTHS_AHEAD * 30;
  const totalChunks = Math.ceil(totalDays / CHUNK_STRIDE_DAYS);

  console.log(`Запуск ${totalChunks} чанков по ${CHUNK_STRIDE_DAYS} дней, начиная с #${START_FROM_CHUNK}`);

  const overallStart = performance.now();
  let okCount = 0;
  let failCount = 0;

  for (let i = START_FROM_CHUNK; i < totalChunks; i++) {
    const result = await runChunk(i, totalChunks);
    if (result.ok) {
      okCount++;
    } else {
      failCount++;
      console.error(
        `Чанк ${i + 1} не выполнен. Чтобы возобновить, поменяй START_FROM_CHUNK = ${i} и запусти снова.`,
      );
      break;
    }
  }

  const totalSec = ((performance.now() - overallStart) / 1000).toFixed(1);
  console.log("================================");
  console.log(`Готово: ${okCount} OK, ${failCount} провалов за ${totalSec}с`);
  console.log("================================");
  if (failCount === 0) {
    console.log("Проверка: SELECT COUNT(*) FROM \"Route\", \"FlightsRoutes\";");
  }
}

runAllChunks();
