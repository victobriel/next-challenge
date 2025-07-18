import Link from "next/link";
import { generateMainNav } from "./navt";

export const MainSidebar = () => {
	const nav = generateMainNav();

	return (
		<aside className="min-h-screen bg-kdwa-background text-kdwa-foreground px-6 border-r border-foreground/10">
			<nav className="h-full">
				<h1 className="text-2xl font-bold text-kdwa-foreground py-4">Kudwa App</h1>
				<ul>
					{nav.map(({title, href, icon: Icon}) => (
						<li key={href} className="mb-2">
							<Link href={href} className="flex items-center text-lg gap-2 h-12 rounded-md px-2">
								<Icon className='size-4'/>
								<p className="text-sm font-semibold">{title}</p>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
