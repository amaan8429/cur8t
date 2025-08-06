import { VelocityScroll } from '../ui/scrollbasedvelocity';

export default function ScrollBasedVelocityDemo() {
  return (
    <div className="bg-background py-16 border-t border-border/50">
      <VelocityScroll
        className="px-6 text-center text-4xl font-bold tracking-tight text-foreground/80 dark:text-foreground md:text-7xl md:leading-[5rem]"
        text="Organize • Discover • Share • Cur8t"
        default_velocity={5}
      />
    </div>
  );
}
