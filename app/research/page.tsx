
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research",
};

export default function ResearchPage() {
  return (
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">Research</h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-300">
          기존 연구실 사이트의 큰 축(전기기기 / 드라이브 / 센서 / 모빌리티)을 그대로 가져오되,
          방문자가 “무슨 강점이 있는 연구실인지” 한눈에 보이도록 재구성했습니다.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card
            title="Electric Machines"
            description="고성능 전기기기 설계/해석/최적화, 손실/열/구조/NVH, 고장 모드까지"
            href="#electric-machines"
          />
          <Card
            title="Machine Drives"
            description="PWM/회로-전자계 연성, HIL 기반 구동 시스템 검증, 하드웨어 통합"
            href="#machine-drives"
          />
          <Card
            title="Sensors"
            description="자동차/모빌리티용 VR Resolver 등 센서 설계 및 평가"
            href="#sensors"
          />
          <Card
            title="Mobility Applications"
            description="EV 파워트레인 모델·디지털트윈·시스템 분석 및 데이터베이스"
            href="#mobility"
          />
        </div>

        <section id="electric-machines" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Electric Machines</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            전동기 타입/권선/재료 선택부터 전자계–열–구조–NVH까지, 실제 적용을 기준으로 설계 품질을 끌어올립니다.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card
              title="High-performance machine topologies"
              description="Wound-field, IPM, vernier/flux-switching 등 응용에 맞는 구조 설계"
            />
            <Card
              title="Core loss, DC bias & PWM effects"
              description="손실 모델 정교화 및 구동 조건(PWM, DC bias)까지 고려한 평가"
            />
            <Card
              title="Thermal / Structural / NVH"
              description="1D–CFD 열해석, FEA 구조해석, 소음/진동(NVH)까지 통합"
            />
            <Card
              title="Multi-objective & multiphysics optimization"
              description="효율·출력밀도·제조성·내구성 등 상충 목표를 동시에 최적화"
            />
          </div>

          <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            참고: 세부 키워드는 기존 사이트(Electric Machines 페이지)의 항목을 반영했습니다.
          </div>
        </section>

        <section id="machine-drives" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Machine Drives</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            인버터 PWM, 연성 시뮬레이션, HILS 기반 검증 등 구동 시스템 관점에서 성능과 신뢰성을 다룹니다.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card
              title="Coupled EM–Circuit simulation"
              description="PWM effects 포함, 고정밀 전자계–회로 연성 해석"
            />
            <Card
              title="High-fidelity system simulation"
              description="Simulink → HIL → 다이나모 실험으로 이어지는 검증 파이프라인"
            />
            <Card
              title="Characterization & integration"
              description="모터/인버터 특성화 및 하드웨어 통합"
            />
            <Card
              title="Fault modes / diagnostics"
              description="고장 모드 조사, 진단·예지 관점의 drive-system 최적화"
            />
          </div>
        </section>

        <section id="sensors" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Sensors</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            모빌리티용 구동 시스템에서 핵심인 위치/속도 센싱을 위해, VR Resolver 등 센서 구조/오차 요인을 연구합니다.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card
              title="Variable Reluctance Resolver"
              description="자동차 응용을 위한 VR Resolver 설계 및 각도 오차 저감"
            />
          </div>
        </section>

        <section id="mobility" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Mobility Applications</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            EV 파워트레인 모델, 통합 시스템 분석, 디지털 트윈 등 ‘시스템 레벨’ 연구를 통해
            설계 의사결정을 지원합니다.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card
              title="EV powertrain modeling"
              description="주행/에너지 소비 모델링 및 성능·효율 평가"
            />
            <Card
              title="EV digital twin"
              description="시뮬레이션 기반 가상검증 및 운영 데이터 기반 분석"
            />
            <Card
              title="Integrated transportation / power-grid"
              description="수송-전력망 연계 관점의 운영/최적화 이슈 탐색"
            />
            <Card
              title="Database"
              description="파워트레인 모델/데이터를 체계적으로 정리해 재사용성 강화"
            />
          </div>
        </section>

        <div className="mt-14 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-6 dark:border-zinc-800/70 dark:bg-zinc-900">
          <div className="text-base font-semibold">다음 단계 (선택)</div>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
            여기에 연구 성과(대표 논문/특허/프로젝트)와 장비 사진(다이나모, HIL 등)을 추가하면
            “고급진 연구실 사이트” 느낌이 확 올라갑니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Projects 보기
            </Link>
            <Link
              href="/publications"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Publications 보기
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
