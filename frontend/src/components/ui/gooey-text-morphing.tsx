"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const frameRef = React.useRef<number | null>(null);
  const filterId = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    if (texts.length === 0) return;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    }

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        const nextFraction = Math.min(Math.max(fraction, 0.16), 1);
        text2Ref.current.style.filter = `blur(${Math.min(3.8 / nextFraction - 3.8, 12)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.52) * 100}%`;

        const prevFraction = Math.min(Math.max(1 - fraction, 0.16), 1);
        text1Ref.current.style.filter = `blur(${Math.min(3.8 / prevFraction - 3.8, 12)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(1 - fraction, 0.52) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative isolate", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="grid h-full w-full place-items-center overflow-visible"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "col-start-1 row-start-1 inline-block select-none text-center leading-none text-6xl md:text-[60pt]",
            textClassName
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "col-start-1 row-start-1 inline-block select-none text-center leading-none text-6xl md:text-[60pt]",
            textClassName
          )}
        />
      </div>
    </div>
  );
}
