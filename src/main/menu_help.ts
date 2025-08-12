import { shell, app, MenuItemConstructorOptions } from "electron";
import os from "os";
import { isMac } from "../common/platform";
import { showAboutWindow } from "./menu_app_about";
import { openUrlMenuItem } from "./menu_item_open_url";
import { i18n } from "./i18n";

const WEBSITE_URL = "https://github.com/xqk/exifcleaner";
const GITHUB_USERNAME = "xqk";
const GITHUB_PROJECTNAME = "exifcleaner";
const SOURCE_CODE_URL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_PROJECTNAME}`;

export function helpMenuTemplate(): MenuItemConstructorOptions {
	return {
		label: i18n("menu.help.name"),
		role: "help",
		submenu: buildHelpSubmenu(),
	};
}

function buildHelpSubmenu(): MenuItemConstructorOptions[] {
	let submenu = [
		openUrlMenuItem(i18n("menu.help.website"), WEBSITE_URL),
		openUrlMenuItem(i18n("menu.help.source-code"), SOURCE_CODE_URL),
		{
			label: `${i18n("menu.help.report-issue")}…`,
			click() {
				const url = newGithubIssueUrl(
					GITHUB_USERNAME,
					GITHUB_PROJECTNAME,
					newGithubIssueBody()
				);
				shell.openExternal(url);
			},
		},
	];

	if (!isMac()) {
		submenu.push(
			{
				type: "separator",
			},
			{
				label: `${i18n("menu.help.about")}${app.getName()}`,
				click() {
					showAboutWindow(GITHUB_USERNAME, WEBSITE_URL);
				},
			}
		);
	}

	return submenu;
}

function newGithubIssueUrl(user: string, repo: string, body: string): string {
	const url = new URL(`https://github.com/${user}/${repo}/issues/new`);
	url.searchParams.set("body", body);

	return url.toString();
}

function newGithubIssueBody(): string {
	return `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;
}

function debugInfo(): string {
	return `
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${os.release()}
Locale: ${app.getLocale()}
`.trim();
}
