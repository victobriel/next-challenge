import { Files, LayoutDashboard } from "lucide-react"
import { NavItem } from "../../../lib/types"

export const generateMainNav = (): NavItem[] => {
		return [
			{
				title: 'Dashboard',
				href: '/dashboard',
				icon: LayoutDashboard
			},
			{
				title: 'Report',
				href: '/report',
				icon: Files
			}
		]
}
