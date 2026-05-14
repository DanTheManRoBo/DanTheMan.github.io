import { ElementType, StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { base } from "./manifest.json";
import ErrorBoundary from "./src/runtime/ErrorBoundry";
import "styles/main.less";
import "setimmediate";
import Drawer from "./src/components/Drawer";
import Toolbar from "./src/components/Toolbar";
import Footer from "./src/components/Footer";
import Keybinds from "./src/runtime/Keybinds";
import PWAInstaller from "./src/components/PWAInstaller";

if ("serviceWorker" in navigator && !/localhost/.test(window.location.toString())) registerSW({
	immediate: true
});

export const queryClient = new QueryClient;

export type Page = { default: ElementType, path: string, caseSensitive?: boolean };
const pageModules = import.meta.glob<Page>("./src/pages/*.tsx", { eager: true });
const pages = Object.fromEntries(
	Object.entries(pageModules).map(([key, module]) => [key, module.default ? { ...module, default: module.default } : module])
);

// Log SHS GAMES!!
console.log(" _______           _______    _______  _______  _______  _______  _______ \n(  ____ \\|\\     /|(  ____ \\  (  ____ \\(  ___  )(       )(  ____ \\(  ____ \\\n| (    \\/| )   ( || (    \\/  | (    \\/| (   ) || ()   () || (    \\/| (    \\/\n| (_____ | (___) || (___     | (     | |   | || |     | || (_____ | (__    \n(_____  )|  ___  |(_____  )  | |     | |   | || |     | |(_____  )|  __)   \n      ) || (   ) |      ) |   | |     | |   | || |     | |      ) || (      \n/\\____) || )   ( |/\\____) |   | (____/| (___) || (___) || /\\____) || (____/\\\n\\_______)|/     \\|\\_______)   (_______(_______)|(_______)|(_______)(_______/", "color: #1976d4");
console.log("%cJoin our cult at http://github.com/SHSGames/shsgames.github.io", "color: #1976d4");
console.log("%cHi, Evan!", "font-style: italic");

ReactDOM.render(
	<StrictMode>
		<ErrorBoundary>
			<QueryClientProvider client={ queryClient }>
				<BrowserRouter>
					<Toolbar/>
					<Drawer/>
					<Routes>
						{ Object.values(pages).map((page, key) => {
							const typedPage = page as Page;
							return <Route
								key={ key }
								path={ base + typedPage.path.substring(1) }
								caseSensitive={ typedPage.caseSensitive || false }
								element={ <typedPage.default/> }/>
						}) }
					</Routes>
					<Footer/>
					<PWAInstaller/>
					<Keybinds/>
				</BrowserRouter>
				{ !PRODUCTION && <ReactQueryDevtools/> }
			</QueryClientProvider>
		</ErrorBoundary>
	</StrictMode>,
	document.getElementById("root")
);
