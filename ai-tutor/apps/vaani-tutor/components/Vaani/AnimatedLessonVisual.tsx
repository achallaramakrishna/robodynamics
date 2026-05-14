"use client";

import type { SyntheticEvent } from "react";
import { getVaaniVisualMotion } from "@/lib/vaaniVisualMotion";

type Props = {
  src: string;
  alt: string;
  lessonId?: string | null;
  title?: string | null;
  wordHindi?: string | null;
  wordEnglish?: string | null;
  maxHeight?: number;
  borderRadius?: number;
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
};

export default function AnimatedLessonVisual({
  src,
  alt,
  lessonId,
  title,
  wordHindi,
  wordEnglish,
  maxHeight = 360,
  borderRadius = 20,
  onError,
}: Props) {
  const motion = getVaaniVisualMotion({ lessonId, assetPath: src, title, wordHindi, wordEnglish });
  const showPages = motion.kind === "book";
  const showTrails = motion.kind === "run";
  const showConfetti = motion.kind === "celebrate";
  const showGlow = motion.kind === "glow";
  const showBubbles = motion.kind === "hop";

  return (
    <div className={`visual-shell motion-${motion.kind}`} aria-label={motion.label || "Lesson visual"}>
      <div className="stage">
        {showPages && (
          <>
            <span className="page page-left" />
            <span className="page page-right" />
          </>
        )}

        {showTrails && (
          <div className="trails" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}

        {showConfetti && (
          <div className="confetti" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}

        {showGlow && (
          <div className="sparkles" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}

        {showBubbles && (
          <div className="bubbles" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}

        <img
          src={src}
          alt={alt}
          className="visual-image"
          style={{ maxHeight, borderRadius }}
          onError={onError}
        />
        <div className="shadow" aria-hidden="true" />
      </div>

      <style jsx>{`
        .visual-shell {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: ${borderRadius + 4}px;
        }

        .stage {
          position: relative;
          min-height: ${Math.max(220, maxHeight * 0.72)}px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .visual-image {
          position: relative;
          z-index: 3;
          width: 100%;
          object-fit: contain;
          transform-origin: center bottom;
          animation: idleFloat 5.8s ease-in-out infinite;
          filter: drop-shadow(0 18px 28px rgba(23, 32, 51, 0.14));
        }

        .shadow {
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 56%;
          height: 18px;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(23, 32, 51, 0.18) 0%, rgba(23, 32, 51, 0) 72%);
          border-radius: 999px;
          z-index: 1;
          animation: shadowPulse 5.8s ease-in-out infinite;
        }

        .page,
        .sparkles span,
        .bubbles span,
        .confetti span,
        .trails span {
          position: absolute;
          z-index: 2;
          pointer-events: none;
        }

        .page {
          width: 76px;
          height: 106px;
          bottom: 18px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 247, 237, 0.82));
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 14px;
          box-shadow: 0 14px 28px rgba(249, 115, 22, 0.14);
        }

        .page-left {
          left: calc(50% - 70px);
          transform-origin: right center;
          animation: openLeftPage 2.6s ease-in-out infinite;
        }

        .page-right {
          right: calc(50% - 70px);
          transform-origin: left center;
          animation: openRightPage 2.6s ease-in-out infinite;
        }

        .trails {
          position: absolute;
          left: 18%;
          bottom: 30%;
          width: 24%;
          height: 22%;
        }

        .trails span {
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.34));
          height: 8px;
          animation: trailMove 1.4s ease-out infinite;
        }

        .trails span:nth-child(1) {
          width: 58px;
          left: 0;
          top: 18px;
        }

        .trails span:nth-child(2) {
          width: 42px;
          left: 24px;
          top: 38px;
          animation-delay: 0.2s;
        }

        .trails span:nth-child(3) {
          width: 30px;
          left: 10px;
          top: 58px;
          animation-delay: 0.4s;
        }

        .sparkles {
          position: absolute;
          inset: 0;
        }

        .sparkles span {
          width: 14px;
          height: 14px;
          background: radial-gradient(circle, rgba(253, 224, 71, 1) 0%, rgba(253, 224, 71, 0) 72%);
          border-radius: 999px;
          animation: twinkle 2s ease-in-out infinite;
        }

        .sparkles span:nth-child(1) {
          top: 14%;
          left: 24%;
        }

        .sparkles span:nth-child(2) {
          top: 20%;
          right: 22%;
          animation-delay: 0.6s;
        }

        .sparkles span:nth-child(3) {
          bottom: 20%;
          right: 30%;
          animation-delay: 1.1s;
        }

        .bubbles {
          position: absolute;
          inset: 0;
        }

        .bubbles span {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.94) 0%, rgba(191, 219, 254, 0.2) 70%);
          border: 1px solid rgba(59, 130, 246, 0.18);
          animation: bubbleRise 3.2s ease-in-out infinite;
        }

        .bubbles span:nth-child(1) {
          left: 18%;
          bottom: 18%;
        }

        .bubbles span:nth-child(2) {
          right: 18%;
          bottom: 22%;
          animation-delay: 0.6s;
        }

        .bubbles span:nth-child(3) {
          left: 50%;
          bottom: 14%;
          animation-delay: 1.1s;
        }

        .confetti {
          position: absolute;
          inset: 0;
        }

        .confetti span {
          width: 10px;
          height: 18px;
          border-radius: 6px;
          animation: confettiDrop 2.4s linear infinite;
        }

        .confetti span:nth-child(1) {
          left: 18%;
          top: 8%;
          background: #f97316;
        }

        .confetti span:nth-child(2) {
          left: 34%;
          top: 4%;
          background: #3b82f6;
          animation-delay: 0.2s;
        }

        .confetti span:nth-child(3) {
          right: 36%;
          top: 7%;
          background: #10b981;
          animation-delay: 0.4s;
        }

        .confetti span:nth-child(4) {
          right: 16%;
          top: 2%;
          background: #facc15;
          animation-delay: 0.6s;
        }

        .confetti span:nth-child(5) {
          left: 54%;
          top: 0;
          background: #ec4899;
          animation-delay: 0.9s;
        }

        .confetti span:nth-child(6) {
          right: 50%;
          top: 10%;
          background: #8b5cf6;
          animation-delay: 1.1s;
        }

        .motion-run .visual-image {
          animation: runBob 1.15s ease-in-out infinite;
        }

        .motion-run .shadow {
          animation: runShadow 1.15s ease-in-out infinite;
        }

        .motion-hop .visual-image {
          animation: hopBounce 2.6s ease-in-out infinite;
        }

        .motion-book .visual-image {
          animation: bookLift 2.6s ease-in-out infinite;
        }

        .motion-celebrate .visual-image {
          animation: celebratePulse 2.3s ease-in-out infinite;
        }

        .motion-glow .visual-image {
          animation: idleFloat 5.8s ease-in-out infinite, glowPulse 2.7s ease-in-out infinite;
        }

        @keyframes idleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-7px) scale(1.01); }
        }

        @keyframes shadowPulse {
          0%, 100% { opacity: 0.42; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.22; transform: translateX(-50%) scaleX(0.9); }
        }

        @keyframes runBob {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(-1deg) scale(1); }
          25% { transform: translateX(6px) translateY(-7px) rotate(1.5deg) scale(1.02); }
          50% { transform: translateX(0px) translateY(-3px) rotate(0deg) scale(1); }
          75% { transform: translateX(-6px) translateY(-8px) rotate(-1.5deg) scale(1.02); }
        }

        @keyframes runShadow {
          0%, 100% { opacity: 0.28; transform: translateX(-50%) scaleX(0.9); }
          50% { opacity: 0.18; transform: translateX(-50%) scaleX(0.76); }
        }

        @keyframes hopBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          20% { transform: translateY(-10px) rotate(-1deg) scale(1.02); }
          38% { transform: translateY(0px) rotate(1deg) scale(0.99); }
          58% { transform: translateY(-5px) rotate(0deg) scale(1.01); }
        }

        @keyframes bookLift {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          35% { transform: translateY(-6px) rotate(-1.3deg) scale(1.015); }
          65% { transform: translateY(-2px) rotate(1.2deg) scale(1.012); }
        }

        @keyframes celebratePulse {
          0%, 100% { transform: translateY(0px) scale(1); }
          30% { transform: translateY(-7px) scale(1.03); }
          55% { transform: translateY(0px) scale(0.995); }
          80% { transform: translateY(-3px) scale(1.015); }
        }

        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 18px 28px rgba(23, 32, 51, 0.14)); }
          50% { filter: drop-shadow(0 18px 32px rgba(250, 204, 21, 0.24)); }
        }

        @keyframes openLeftPage {
          0%, 100% { transform: perspective(220px) rotateY(64deg) translateY(0px); opacity: 0.18; }
          50% { transform: perspective(220px) rotateY(10deg) translateY(-4px); opacity: 0.4; }
        }

        @keyframes openRightPage {
          0%, 100% { transform: perspective(220px) rotateY(-64deg) translateY(0px); opacity: 0.18; }
          50% { transform: perspective(220px) rotateY(-10deg) translateY(-4px); opacity: 0.4; }
        }

        @keyframes bubbleRise {
          0% { transform: translateY(0px) scale(0.9); opacity: 0; }
          20% { opacity: 0.85; }
          100% { transform: translateY(-44px) scale(1.05); opacity: 0; }
        }

        @keyframes twinkle {
          0%, 100% { transform: scale(0.4); opacity: 0.35; }
          50% { transform: scale(1.1); opacity: 0.95; }
        }

        @keyframes trailMove {
          0% { transform: translateX(0px); opacity: 0; }
          35% { opacity: 0.8; }
          100% { transform: translateX(-24px); opacity: 0; }
        }

        @keyframes confettiDrop {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110px) rotate(180deg); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .visual-image,
          .shadow,
          .page,
          .sparkles span,
          .bubbles span,
          .confetti span,
          .trails span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
