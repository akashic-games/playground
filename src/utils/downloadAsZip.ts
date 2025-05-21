import * as path from "path";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import urlJoin from "url-join";
import type { PseudoFile } from "~/types/PseudoFile";
import { getBinaryContent } from "~/utils/getBinaryContent";
import { dirname } from "~/utils/path";

const binaryCache: { [name: string]: any } = {};

export async function downloadAsZip(name: string, pseudoFiles: PseudoFile[]): Promise<void> {
	const zip = new JSZip();

	for (const file of pseudoFiles) {
		if (file.assetType === "game.json") {
			zip.file(file.filename, file.value);
		} else if (file.assetType === "script" || file.assetType === "text") {
			const dir = zip.folder(path.dirname(file.path));
			if (!dir) continue;
			dir.file(file.filename, file.value);
		} else if (file.assetType === "image" || file.assetType === "vector-image") {
			const dir = zip.folder(path.dirname(file.path));
			if (!dir) continue;
			dir.file(file.filename, file.blob, { binary: true });
		} else if (file.assetType === "audio") {
			try {
				const dir = zip.folder(path.dirname(file.path));
				if (!dir) continue;
				for (const extension of file.hint.extensions) {
					const filename = file.filename + extension; // extension は ".xxx" の形式なのでそのまま結合可能
					if (!binaryCache[filename]) {
						binaryCache[filename] = await getBinaryContent(urlJoin(dirname(file.uri), filename));
					}
					dir.file(filename, binaryCache[filename], { binary: true });
				}
			} catch (e) {
				console.error(e);
			}
		} else if (file.assetType === "binary") {
			const dir = zip.folder(path.dirname(file.path));
			if (!dir) continue;
			dir.file(file.filename, file.blob, { binary: true });
		}
	}

	const content = await zip.generateAsync({ type: "blob" });
	saveAs(content, name);
}
