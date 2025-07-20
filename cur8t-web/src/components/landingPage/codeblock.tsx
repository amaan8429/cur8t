export default function CodeBlock() {
  return (
    <>
      <div className="relative w-full max-w-2xl rounded-xl p-0.5">
        <div className="code-border-anim" />
        <div className="rounded-xl bg-gradient-to-br from-card via-card to-muted p-6 shadow-lg border border-border">
          <div className="flex items-center justify-between pb-4">
            <span className="text-base font-semibold text-foreground">
              app.tsx
            </span>
            <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90">
              Copy
            </button>
          </div>
          <pre className="m-0 overflow-x-auto rounded-lg bg-transparent p-0 text-sm leading-relaxed whitespace-pre text-muted-foreground">
            <code>
              <span className="text-primary">import</span>{" "}
              <span className="text-foreground">{"{"}</span>useState
              <span className="text-foreground">{"}"}</span>{" "}
              <span className="text-primary">from</span>{" "}
              <span className="text-accent">&apos;react&apos;</span>;<br />
              <br />
              <span className="text-primary">function</span>{" "}
              <span className="text-secondary-foreground">Counter</span>() {"{"}
              <br />
              &nbsp;&nbsp;<span className="text-primary">const</span> [count,
              setCount] = useState(<span className="text-accent">0</span>);
              <br />
              <br />
              &nbsp;&nbsp;<span className="text-primary">return</span> (<br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-secondary-foreground">&lt;button</span>{" "}
              <span className="text-emerald-400">onClick</span>=
              <span className="text-accent">{"{"}</span>() =&gt; setCount(count
              + <span className="text-accent">1</span>)
              <span className="text-accent">{"}"}</span>
              <span className="text-secondary-foreground">&gt;</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clicked {"{"}count{"}"} times
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-secondary-foreground">&lt;/button&gt;</span>
              <br />
              &nbsp;&nbsp;);
              <br />
              {"}"}
            </code>
          </pre>
        </div>
      </div>

      <style>{`
          .code-border-anim {
            position: absolute;
            z-index: -10;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            border-radius: 1rem;
            overflow: hidden;
            pointer-events: none;
          }
          .code-border-anim::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 10rem;
            background: linear-gradient(
              0deg,
              hsla(0,0%,100%,0) 0%,
              hsl(var(--primary)) 40%,
              hsl(var(--primary)) 60%,
              hsla(0,0%,40%,0) 100%
            );
            transform: translate(-50%, -50%) rotate(0deg);
            transform-origin: left;
            animation: border-rotate 8s linear infinite;
            z-index: 2;
            pointer-events: none;
          }
          @keyframes border-rotate {
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}</style>
    </>
  );
}
