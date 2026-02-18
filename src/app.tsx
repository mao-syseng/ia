import { useEffect, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import unicode from "./unicode";
import notFound from "./notFound";
import spil from "./spil";
import papir from "./papir";

function Index() {
  return <h1>Index</h1>;
}

const routes: Record<string, FunctionalComponent> = {
  "": Index,
  "0": spil,
  "1": unicode,
  "2": papir,
};

export function App() {
  useLinkInterceptor();
  const title2 = ` _   _    
:_; :_;   
.-. .--.  
: :' .; ; 
:_;\`.__,_;`;

  const path = usePath();
  const segment = path.slice(1);

  const Component = routes[segment] || notFound;

  return (
    <>
      <header className="nm">
        <a style="text-decoration: none;" class="b" href="/">
          <pre>{title2}</pre>
        </a>
        <ul>
          <li>
            <a href="/0">Spil</a>
          </li>
          <li>
            <a href="/1">Unicode</a>
          </li>
          <li>
            <a href="/2">Papir</a>
          </li>
        </ul>
      </header>
      <main>

        <Component />
      </main>
    </>
  );
}

// ! ||--------------------------------------------------------------------------------||
// ! ||                              custom minimal router                             ||
// ! ||--------------------------------------------------------------------------------||
// Very minimal router, only supports one level of routes and only numbers.
// So /0, /1, /2 and so on.
function usePath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return path;
}

function navigate(to: string) {
  history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// Intercept clicks on links and navigate client-side, so i can use a elements.
function useLinkInterceptor() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a");
      if (!link) return;

      // Ignore modified clicks (ctrl/cmd/middle click etc.)
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(link.href);

      // Only intercept same-origin links
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      navigate(url.pathname);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
