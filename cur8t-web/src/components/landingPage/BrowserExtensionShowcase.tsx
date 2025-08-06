'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'motion/react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';
import { PiBrowser } from 'react-icons/pi';
import { Badge } from '@/components/ui/badge';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

function FeatureCard({
  title,
  description,
  bgClass,
  children,
}: CardProps & {
  children: React.ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const motionTemplateX = useMotionTemplate`${mouseX}px`;
  const motionTemplateY = useMotionTemplate`${mouseY}px`;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="animated-cards relative w-full rounded-[16px]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': motionTemplateX,
          '--y': motionTemplateY,
        } as WrapperStyle
      }
    >
      <div
        className={cn(
          'group relative w-full overflow-hidden rounded-3xl border border-border bg-card transition duration-300',
          'md:hover:border-primary/50',
          bgClass
        )}
      >
        <div className="m-6 min-h-[350px] w-full">
          <div className="flex w-4/6 flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {title}
            </h2>
            <p className="text-sm leading-5 text-muted-foreground sm:text-base sm:leading-5">
              <Balancer>{description}</Balancer>
            </p>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

const steps = [
  { id: '1', name: 'Install' },
  { id: '2', name: 'Save' },
  { id: '3', name: 'Access' },
  { id: '4', name: 'Organize' },
];

function IconCheck({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  );
}

interface StepsProps {
  steps: { id: string; name: string }[];
  current: number;
  onChange: (stepIdx: number) => void;
}

function Steps({ steps, current, onChange }: StepsProps) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 sm:justify-center md:w-10/12 md:divide-y-0"
        role="list"
      >
        {steps.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          const isFuture = !isCompleted && !isCurrent;
          return (
            <li
              className={cn(
                'relative z-50 rounded-full px-3 py-1 transition-all duration-300 ease-in-out md:flex',
                isCompleted ? 'bg-primary/20' : 'bg-muted/20'
              )}
              key={`${step.name}-${stepIdx}`}
            >
              <div
                className={cn(
                  'group flex w-full cursor-pointer items-center focus:outline-none focus-visible:ring-2',
                  (isFuture || isCurrent) && 'pointer-events-none'
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      'flex shrink-0 items-center justify-center rounded-full duration-300',
                      isCompleted &&
                        'bg-primary size-4 text-primary-foreground',
                      isCurrent &&
                        'bg-primary/80 size-4 p-2 text-primary-foreground',
                      isFuture && 'bg-muted size-4 p-2 text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <IconCheck className="size-3 stroke-current" />
                    ) : (
                      <span
                        className={cn(
                          'text-xs',
                          isCurrent && 'text-primary-foreground'
                        )}
                      >
                        {stepIdx + 1}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium duration-300',
                      isCompleted && 'text-primary',
                      isFuture && 'text-muted-foreground'
                    )}
                  >
                    {step.name}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function useNumberCycler() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [dummy, setDummy] = useState(0);

  const increment = () => {
    setCurrentNumber((prevNumber) => {
      return (prevNumber + 1) % 4;
    });

    setDummy((prev) => prev + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNumber((prevNumber) => {
        return (prevNumber + 1) % 4;
      });
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dummy]);

  return {
    increment,
    currentNumber,
  };
}

export function BrowserExtensionCard({
  image,
  step1img1Class,
  step1img2Class,
  step2img1Class,
  step2img2Class,
  step3imgClass,
  ...props
}: CardProps & {
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  image: {
    step1dark1: StaticImageData;
    step1dark2: StaticImageData;
    step2dark1: StaticImageData;
    step2dark2: StaticImageData;
    step3dark: StaticImageData;
    step4dark: StaticImageData;
    alt: string;
  };
}) {
  const { currentNumber: step, increment } = useNumberCycler();

  return (
    <FeatureCard {...props}>
      <div
        className={cn(
          { 'translate-x-0 opacity-0': step < 3 },
          'absolute left-2/4 top-1/3 flex w-full -translate-x-1/2 -translate-y-[33%] flex-col gap-12 text-center text-2xl font-bold transition-all duration-500 md:w-3/5'
        )}
      >
        <Image
          alt={image.alt}
          className="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[35px] md:top-[30%] md:w-full"
          src={image.step4dark}
          width={800}
          height={300}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />
      </div>

      <div>
        {/* step 1 */}
        <Image
          alt={image.alt}
          className={cn(step1img1Class, {
            '-translate-x-36 opacity-0 rounded-2xl': step > 0,
          })}
          src={image.step1dark1}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />
        <Image
          alt={image.alt}
          className={cn(step1img2Class, {
            '-translate-x-24 opacity-0 rounded-2xl': step > 0,
          })}
          src={image.step1dark2}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />

        {/* step 2 */}
        <Image
          alt={image.alt}
          className={cn(
            step2img1Class,
            'rounded-2xl',
            { 'translate-x-36 opacity-0': step < 1 },
            { '-translate-x-36 opacity-0': step > 1 }
          )}
          src={image.step2dark1}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />
        <Image
          alt={image.alt}
          className={cn(
            step2img2Class,
            'rounded-2xl',
            { 'translate-x-24 opacity-0': step < 1 },
            { '-translate-x-24 opacity-0': step > 1 }
          )}
          src={image.step2dark2}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />

        {/* step 3 */}
        <Image
          alt={image.alt}
          className={cn(
            step3imgClass,
            'rounded-2xl',
            { 'translate-x-36 opacity-0': step < 2 },
            { '-translate-x-36 opacity-0': step > 2 },
            { 'opacity-90': step === 2 }
          )}
          src={image.step3dark}
          style={{
            position: 'absolute',
            userSelect: 'none',
            maxWidth: 'unset',
          }}
        />

        <div className="absolute left-48 top-5 z-50 size-full cursor-pointer md:left-0">
          <Steps current={step} onChange={() => {}} steps={steps} />
        </div>
      </div>

      <div
        className="absolute right-0 top-0 z-50 size-full cursor-pointer md:left-0"
        onClick={() => increment()}
      />
    </FeatureCard>
  );
}

// Placeholder images - replace with actual screenshots
const placeholderImage: StaticImageData = {
  src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJyb3dzZXIgRXh0ZW5zaW9uIFNjcmVlbnNob3Q8L3RleHQ+PC9zdmc+',
  height: 300,
  width: 800,
  blurDataURL:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+PC9zdmc+',
};

export default function BrowserExtensionShowcase() {
  return (
    <section className="py-8 bg-muted/20" id="browser-extension-showcase">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <PiBrowser className="text-primary mr-1 h-3.5 w-3.5" />
            Browser Extension
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Save from anywhere on the web
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-md pt-2 text-lg mx-auto"
          >
            Save and organize bookmarks instantly while browsing. Never lose
            track of important content again
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BrowserExtensionCard
            title="Chrome Extension"
            description="Seamlessly integrate Cur8t into your browsing workflow. Save any webpage to your collections with a single click."
            image={{
              step1dark1: placeholderImage,
              step1dark2: placeholderImage,
              step2dark1: placeholderImage,
              step2dark2: placeholderImage,
              step3dark: placeholderImage,
              step4dark: placeholderImage,
              alt: 'Browser Extension Walkthrough',
            }}
            step1img1Class="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[35px] md:top-[30%] md:w-full"
            step1img2Class="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[45px] md:top-[35%] md:w-full"
            step2img1Class="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[35px] md:top-[30%] md:w-full"
            step2img2Class="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[45px] md:top-[35%] md:w-full"
            step3imgClass="pointer-events-none top-1/2 w-[90%] overflow-hidden rounded-2xl border border-border transition-all duration-500 md:left-[35px] md:top-[30%] md:w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
