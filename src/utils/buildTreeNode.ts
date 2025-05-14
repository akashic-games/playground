import type { TreeNode } from "~/types/TreeNode";

/**
 * ディレクトリ -> ファイルの順でソートする簡易的な関数
 */
export function compareNodes(a: TreeNode, b: TreeNode): number {
	if (a.isDirectory === b.isDirectory) {
		return a.label.localeCompare(b.label);
	}
	return a.isDirectory ? -1 : 1;
}

export function buildTreeNode<T>(data: T[], key: keyof T, compareFunc: (a: TreeNode, b: TreeNode) => number = compareNodes): TreeNode {
	const root: TreeNode = {
		label: "",
		path: "",
		isDirectory: true,
		children: []
	};

	for (const item of data) {
		const path = item[key] as string;
		const segments = path.split("/");
		let currentNode: TreeNode = root;
		let currentPath = "";

		for (const segment of segments) {
			currentPath += currentPath ? `/${segment}` : segment;
			let existingNode = currentNode.children.find(node => node.label === segment);

			if (!existingNode) {
				existingNode = {
					label: segment,
					path: currentPath,
					isDirectory: !currentPath.endsWith(path),
					children: []
				};

				currentNode.children.push(existingNode);
			}

			currentNode = existingNode;
		}
	}

	sortTree(root, compareFunc);

	return root;
}

function sortTree(node: TreeNode, compareFunc: (a: TreeNode, b: TreeNode) => number): void {
	if (node.children.length <= 0) return;
	node.children.sort(compareFunc);
	for (const childNode of node.children) {
		sortTree(childNode, compareFunc);
	}
}
