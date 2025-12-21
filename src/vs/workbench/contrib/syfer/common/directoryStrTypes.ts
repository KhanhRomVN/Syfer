import { URI } from '../../../../base/common/uri.js';

export type SyferDirectoryItem = {
	uri: URI;
	name: string;
	isSymbolicLink: boolean;
	children: SyferDirectoryItem[] | null;
	isDirectory: boolean;
	isGitIgnoredDirectory: false | { numChildren: number }; // if directory is gitignored, we ignore children
}
