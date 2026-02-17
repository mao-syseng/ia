import { useEffect, useState } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import page1 from "./page1";

function Index() {
  return <h1>Index</h1>;
}

function Page0() {
  return <h1>Page 0</h1>;
}

function Page2() {
  return <h1>Page 2</h1>;
}

function NotFound() {
  return <h1>404</h1>;
}

const routes: Record<string, FunctionalComponent> = {
  "": Index,
  "0": Page0,
  "1": page1,
  "2": Page2,
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

  const Component = routes[segment] || NotFound;

  return (
    <>
      <header>
        <a style="text-decoration: none;" class="b" href="/0">
          <pre>{title2}</pre>
        </a>
      </header>
      <main>
        <ul>
          <li>
            <a href="/1">Unicode symboler</a>
          </li>
          <li>
            <a href="/2">intet lige nu</a>
          </li>
        </ul>

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
