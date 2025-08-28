export async function getBinaryContent(url: string): Promise<ArrayBuffer> {
	return (await fetch(url)).arrayBuffer();
}
