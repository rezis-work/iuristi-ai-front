"use client";

import { useEffect, useState } from "react";
import { MotionValue, motion, useMotionValue, animate } from "motion/react";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = mv.on("change", (latest) => {
      const placeValue = latest % 10;
      const offset = (10 + number - placeValue) % 10;
      let memo = offset * height;
      if (offset > 5) {
        memo -= 10 * height;
      }
      y.set(memo);
    });

    return unsubscribe;
  }, [mv, number, height, y]);

  return (
    <motion.span
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        y,
      }}
    >
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  targetValue: number;
  height: number;
  digitIndex: number;
  firstDigitProgress: number;
}

function Digit({
  place,
  targetValue,
  height,
  digitIndex,
  firstDigitProgress,
}: DigitProps) {
  const finalDigit = Math.floor(targetValue / place) % 10;
  const isFirstDigit = digitIndex === 0;

  const animatedValue = useMotionValue(0);

  useEffect(() => {
    if (isFirstDigit) {
      animate(animatedValue, finalDigit, {
        type: "tween",
        duration: 0.8,
        ease: "easeOut",
      });
    } else {
      if (firstDigitProgress < 1) {
        const continuousSpin = () => {
          animate(animatedValue, animatedValue.get() + 100, {
            type: "tween",
            duration: 2,
            ease: "linear",
            onComplete: () => {
              if (firstDigitProgress < 1) {
                continuousSpin();
              }
            },
          });
        };
        continuousSpin();
      } else {
        setTimeout(() => {
          const currentMod = animatedValue.get() % 10;
          const targetWithOvershoot =
            animatedValue.get() - currentMod + finalDigit + 20;

          animate(animatedValue, targetWithOvershoot, {
            type: "spring",
            stiffness: 150,
            damping: 30,
            mass: 0.5,
          });
        }, 200);
      }
    }
  }, [animatedValue, finalDigit, isFirstDigit, firstDigitProgress]);

  return (
    <span
      style={{
        height,
        position: "relative",
        width: "1ch",
        fontVariantNumeric: "tabular-nums",
        overflow: "hidden",
        display: "inline-flex",
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface CounterProps {
  targetValue: number;
  fontSize?: number;
  padding?: number;
  gap?: number;
  color?: string;
  fontWeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Counter({
  targetValue,
  fontSize = 40,
  padding = 10,
  gap = 8,
  color = "black",
  fontWeight = 900,
  className = "",
  style = {},
}: CounterProps) {
  const [firstDigitProgress, setFirstDigitProgress] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setFirstDigitProgress(0);
    setStarted(true);

    const duration = 800;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFirstDigitProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, [targetValue]);

  const height = fontSize + padding;
  const digits = Math.max(String(Math.floor(targetValue)).length, 1);

  if (!started) {
    return (
      <div
        className={className}
        style={{
          fontSize,
          display: "flex",
          gap,
          lineHeight: 1,
          color,
          fontWeight,
          ...style,
        }}
      >
        {Array.from({ length: digits }, () => "0").join("")}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        fontSize,
        display: "flex",
        gap,
        lineHeight: 1,
        color,
        fontWeight,
        ...style,
      }}
    >
      {Array.from({ length: digits }, (_, i) => {
        const place = Math.pow(10, digits - i - 1);
        return (
          <Digit
            key={i}
            place={place}
            targetValue={targetValue}
            height={height}
            digitIndex={i}
            firstDigitProgress={firstDigitProgress}
          />
        );
      })}
    </div>
  );
}
