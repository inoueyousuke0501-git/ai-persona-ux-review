"use client";

import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronRight,
  FileImage,
  FlaskConical,
  ImagePlus,
  Loader2,
  Lock,
  Sparkles,
  Users
} from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";

type UploadSlot = "A" | "B";

type Persona = {
  id: number;
  name: string;
  profile: string;
  preference: "A" | "B" | "同等";
  confidence: number;
  comment: string;
  concern: string;
};

const basePersonas: Persona[] = [
  {
    id: 1,
    name: "忙しい比較検討者",
    profile: "30代 / EC利用頻度高 / 価格と安心感を重視",
    preference: "A",
    confidence: 78,
    comment: "Aは主要CTAが見つけやすく、購入前の迷いが少なそうです。",
    concern: "ただし、説明量が少ない場合は比較検討の材料が不足します。"
  },
  {
    id: 2,
    name: "初回訪問ユーザー",
    profile: "20代 / ブランド認知なし / 第一印象で判断",
    preference: "B",
    confidence: 71,
    comment: "Bは視線の入口が明確で、何の画面かを早く理解できます。",
    concern: "一方で、細部の情報が下に流れると離脱が早まる可能性があります。"
  },
  {
    id: 3,
    name: "慎重な申し込み検討者",
    profile: "40代 / SaaS検討経験あり / リスク回避型",
    preference: "A",
    confidence: 66,
    comment: "Aは情報のまとまりが落ち着いていて、信頼形成に向いています。",
    concern: "差別化要素が弱いと、既存サービスとの差が伝わりにくいです。"
  },
  {
    id: 4,
    name: "スマホ中心の時短ユーザー",
    profile: "20代 / 移動中に閲覧 / 直感操作を重視",
    preference: "B",
    confidence: 74,
    comment: "Bは操作対象が大きく見え、スマホでの初動が軽くなりそうです。",
    concern: "余白が狭い箇所があると誤タップの懸念が残ります。"
  },
  {
    id: 5,
    name: "情報収集フェーズのユーザー",
    profile: "30代 / 複数案を保存 / すぐ決めない",
    preference: "同等",
    confidence: 58,
    comment: "A/Bともに入口は成立していますが、次に何を比較すべきかの導線が鍵です。",
    concern: "保存、共有、比較表などの補助導線があると仮説を深められます。"
  },
  {
    id: 6,
    name: "感覚重視のライトユーザー",
    profile: "20代 / SNS経由 / 見た目の好みが強い",
    preference: "B",
    confidence: 69,
    comment: "Bは印象に残りやすく、最初の数秒で興味を引きやすいです。",
    concern: "訴求が強すぎると広告っぽく見えるリスクがあります。"
  }
];

const modeOptions = [
  { label: "20人", available: true },
  { label: "100人", available: false },
  { label: "1000人", available: false }
];

const segmentOptions = [
  { label: "マス個人", available: true },
  { label: "シニア層", available: false },
  { label: "富裕層", available: false },
  { label: "法人担当者", available: false }
];

function UploadPanel({
  slot,
  preview,
  onUpload
}: {
  slot: UploadSlot;
  preview: string | null;
  onUpload: (slot: UploadSlot, file: File) => void;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onUpload(slot, file);
  }

  return (
    <section className="min-w-0 rounded-lg border border-ink/10 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-md bg-ocean/10 text-ocean">
            <FileImage size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">UI案 {slot}</h2>
            <p className="text-xs text-ink/55">機密ではないデモ画像を使用</p>
          </div>
        </div>
        {preview ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-moss/10 px-2 py-1 text-xs font-medium text-moss">
            <Check size={13} />
            読み込み済み
          </span>
        ) : null}
      </div>

      <label className="group block cursor-pointer p-4">
        <input
          className="sr-only"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
        />
        <div className="grid aspect-[16/10] place-items-center overflow-hidden rounded-md border border-dashed border-ink/20 bg-linen transition group-hover:border-ocean/60">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={`UI案${slot}のプレビュー`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex max-w-56 flex-col items-center gap-3 text-center">
              <div className="grid size-11 place-items-center rounded-md bg-white text-ocean shadow-sm">
                <ImagePlus size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold">画像をアップロード</p>
                <p className="mt-1 text-xs leading-5 text-ink/55">
                  PNG, JPG, WebP。実顧客データや社内機密は使わないでください。
                </p>
              </div>
            </div>
          )}
        </div>
      </label>
    </section>
  );
}

export default function Home() {
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState("20人");
  const [selectedSegment, setSelectedSegment] = useState("マス個人");
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const canRun = Boolean(previewA && previewB) && selectedMode === "20人";

  const result = useMemo(() => {
    const personas = basePersonas;
    const aVotes = personas.filter((persona) => persona.preference === "A").length;
    const bVotes = personas.filter((persona) => persona.preference === "B").length;
    const neutralVotes = personas.filter(
      (persona) => persona.preference === "同等"
    ).length;
    const winner = aVotes > bVotes ? "A" : "B";

    return {
      personas,
      aVotes,
      bVotes,
      neutralVotes,
      winner,
      averageConfidence: Math.round(
        personas.reduce((sum, persona) => sum + persona.confidence, 0) /
          personas.length
      )
    };
  }, []);

  function handleUpload(slot: UploadSlot, file: File) {
    const url = URL.createObjectURL(file);
    if (slot === "A") setPreviewA(url);
    if (slot === "B") setPreviewB(url);
    setHasResult(false);
  }

  function runReview() {
    if (!canRun) return;
    setIsRunning(true);
    setHasResult(false);
    window.setTimeout(() => {
      setIsRunning(false);
      setHasResult(true);
    }, 900);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal">
              <FlaskConical size={14} />
              仮説生成支援
            </div>
            <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">
              AIペルソナUXレビュー
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
              UI案A/Bをアップロードし、マス個人20人のAIペルソナ視点で比較します。
              結果はユーザー調査の代替ではなく、次に検証すべき仮説の材料です。
            </p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-ink/10 bg-linen text-center">
            <div className="px-4 py-3">
              <p className="text-lg font-bold">2</p>
              <p className="text-xs text-ink/55">UI案</p>
            </div>
            <div className="border-x border-ink/10 px-4 py-3">
              <p className="text-lg font-bold">20</p>
              <p className="text-xs text-ink/55">ペルソナ</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-lg font-bold">MVP</p>
              <p className="text-xs text-ink/55">デモ</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <UploadPanel slot="A" preview={previewA} onUpload={handleUpload} />
            <UploadPanel slot="B" preview={previewB} onUpload={handleUpload} />
          </div>

          <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-panel">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold">レビュー設定</h2>
                <p className="mt-1 text-xs text-ink/55">
                  MVPではマス個人20人モードのみ実行できます。
                </p>
              </div>
              <button
                type="button"
                onClick={runReview}
                disabled={!canRun || isRunning}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/25"
              >
                {isRunning ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
                AIレビューを実行
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold text-ink/60">人数モード</p>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map((option) => (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => option.available && setSelectedMode(option.label)}
                      className={`flex h-10 items-center justify-center gap-1 rounded-md border text-sm font-semibold ${
                        selectedMode === option.label
                          ? "border-ocean bg-ocean text-white"
                          : "border-ink/10 bg-linen text-ink/70"
                      } ${option.available ? "hover:border-ocean/60" : "cursor-not-allowed opacity-55"}`}
                    >
                      {!option.available ? <Lock size={13} /> : null}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-ink/60">セグメント</p>
                <div className="grid grid-cols-2 gap-2">
                  {segmentOptions.map((option) => (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => option.available && setSelectedSegment(option.label)}
                      className={`flex h-10 items-center justify-center gap-1 rounded-md border text-sm font-semibold ${
                        selectedSegment === option.label
                          ? "border-moss bg-moss text-white"
                          : "border-ink/10 bg-linen text-ink/70"
                      } ${option.available ? "hover:border-moss/60" : "cursor-not-allowed opacity-55"}`}
                    >
                      {!option.available ? <Lock size={13} /> : null}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {hasResult ? (
            <section className="rounded-lg border border-ink/10 bg-white shadow-panel">
              <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-ocean" />
                  <h2 className="text-sm font-semibold">結果サマリ</h2>
                </div>
                <span className="rounded-md bg-linen px-2.5 py-1 text-xs font-semibold text-ink/65">
                  平均確信度 {result.averageConfidence}%
                </span>
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="rounded-lg bg-linen p-4">
                  <p className="text-xs font-semibold text-ink/55">優勢案</p>
                  <p className="mt-2 text-4xl font-bold text-ink">案{result.winner}</p>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    20人モードの疑似レビューでは、初動理解とCTA発見性が評価軸になりました。
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["案A", result.aVotes, "bg-ocean"],
                      ["案B", result.bVotes, "bg-signal"],
                      ["同等", result.neutralVotes, "bg-moss"]
                    ].map(([label, count, color]) => (
                      <div key={label} className="rounded-lg border border-ink/10 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-ink/55">{label}</p>
                          <p className="text-lg font-bold">{count}</p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
                          <div
                            className={`h-full ${color}`}
                            style={{ width: `${(Number(count) / 6) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-signal/20 bg-signal/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-signal">
                      <AlertTriangle size={16} />
                      次に検証したい仮説
                    </div>
                    <p className="text-sm leading-6 text-ink/70">
                      案{result.winner}は第一印象で優位ですが、比較検討フェーズでは根拠情報の不足が離脱要因になり得ます。
                      次の実ユーザー調査では「CTAに進む前に何を確認したいか」を聞くと改善点が絞れます。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-lg border border-ink/10 bg-white shadow-panel">
            <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
              <Users size={18} className="text-moss" />
              <h2 className="text-sm font-semibold">ペルソナ別コメント</h2>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {(hasResult ? result.personas : basePersonas.slice(0, 4)).map((persona) => (
                <article key={persona.id} className="rounded-lg border border-ink/10 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{persona.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-ink/55">{persona.profile}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-linen px-2 py-1 text-xs font-bold">
                      {hasResult
                        ? persona.preference === "同等"
                          ? "同等"
                          : `案${persona.preference}`
                        : "待機"}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ink/75">
                    {hasResult ? persona.comment : "レビュー実行後に、このペルソナの評価コメントが表示されます。"}
                  </p>
                  {hasResult ? (
                    <p className="mt-3 border-t border-ink/10 pt-3 text-xs leading-5 text-ink/55">
                      懸念: {persona.concern}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-panel">
            <h2 className="text-sm font-semibold">MVPスコープ</h2>
            <div className="mt-4 space-y-3">
              {[
                "画像A/Bアップロード",
                "AIペルソナ比較",
                "マス個人20人モード",
                "結果サマリ表示",
                "ペルソナ別コメント"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-ink/75">
                  <Check size={16} className="text-moss" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-panel">
            <h2 className="text-sm font-semibold">実装メモ</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-ink/65">
              <p>
                現在はUIデモ用の疑似結果です。OpenAI API接続時は画像入力とペルソナプロンプトをAPI Routeに移します。
              </p>
              <p>
                Supabaseには実顧客データではなく、レビュー実行履歴と匿名化された設定のみ保存する想定です。
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-ink p-4 text-white shadow-panel">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-signal" />
              <h2 className="text-sm font-semibold">次の一手</h2>
            </div>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-left text-sm font-semibold text-ink"
            >
              OpenAI連携の設計へ
              <ChevronRight size={16} />
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
